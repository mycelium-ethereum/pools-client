import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Children } from 'libs/types/General';
import { useWeb3 } from '../Web3Context/Web3Context';
import { ethers } from 'ethers';
import { StakingRewards } from '@libs/staking/typechain';
import {
    AggregatorV3Interface,
    AggregatorV3Interface__factory,
    ERC20,
    ERC20__factory,
} from '@tracer-protocol/perpetual-pools-contracts/types';
import { Vault, Vault__factory } from '@libs/staking/balancerV2Vault';

import BigNumber from 'bignumber.js';
import { fetchTokenPrice } from './helpers';
import { BalancerPoolAsset, Farm } from '@libs/types/Staking';
import { calcBptTokenPrice } from '@libs/utils/calcs';

type FarmsLookup = { [address: string]: Farm };
interface ContextProps {
    farms: FarmsLookup;
    refreshFarm: (farmAddress: string) => void;
    fetchingFarms: boolean;
}

export const FarmContext = React.createContext<ContextProps>({
    farms: {},
    refreshFarm: () => console.error('default FarmContext.refreshFarm'),
    fetchingFarms: false,
});

export type FarmContexts = 'bptFarms' | 'poolFarms';

/**
 * Wrapper store for the FarmContext.
 */
export const FarmStore: React.FC<
    {
        farmContext: FarmContexts;
    } & Children
> = ({ farmContext, children }) => {
    const { signer, config, account, provider } = useWeb3();
    const [farms, setFarms] = useState<ContextProps['farms']>({});
    const [fetchingFarms, setFetchingFarms] = useState<boolean>(false);

    // used to fetch details of tokens on both sides of a sushi pool
    const getBptDetails = async (
        balancerPoolId: string,
        pool: string,
        balancerPoolName: string,
    ): Promise<Farm['bptDetails']> => {
        if (!config) {
            return undefined;
        }

        const balancerPool = new ethers.Contract(config.balancerVaultAddress, Vault__factory.abi, provider) as Vault;

        const [tokenAddresses, tokenBalances] = await balancerPool.getPoolTokens(balancerPoolId);

        const tokenLookup: Record<string, BalancerPoolAsset> = {};

        // populate token details and add to lookup
        await Promise.all(
            tokenAddresses.map(async (address, index) => {
                const tokenContract = new ethers.Contract(address, ERC20__factory.abi, provider) as ERC20;

                const [decimals, symbol] = await Promise.all([tokenContract.decimals(), tokenContract.symbol()]);
                const tokenBalance = tokenBalances[index];

                let isPoolToken = false;

                let usdcPrice = new BigNumber(0);

                if (address.toLowerCase() === config.usdcAddress.toLowerCase()) {
                    usdcPrice = new BigNumber(1);
                } else if (config?.knownUSDCPriceFeeds?.[address]) {
                    // fetch USDC price for known markets (BTC and ETH)
                    // known market price feed addresses are configured in Web3Context.Config.ts
                    const priceFeedAggregator = new ethers.Contract(
                        config.knownUSDCPriceFeeds[address],
                        AggregatorV3Interface__factory.abi,
                        provider,
                    ) as AggregatorV3Interface;

                    const [{ answer }, priceFeedDecimals] = await Promise.all([
                        priceFeedAggregator.latestRoundData(),
                        priceFeedAggregator.decimals(),
                    ]);

                    usdcPrice = new BigNumber(ethers.utils.formatUnits(answer, priceFeedDecimals));
                } else {
                    // not usdc and not listed as a known non-pool token
                    // assume it is a perpetual pools token
                    [usdcPrice] = await fetchTokenPrice(pool, [address], provider);
                    isPoolToken = true;
                }

                tokenLookup[symbol] = {
                    address,
                    symbol,
                    isPoolToken,
                    reserves: new BigNumber(ethers.utils.formatUnits(tokenBalance, decimals)),
                    usdcPrice,
                    decimals,
                };
            }),
        );

        // ensure the tokens are ordered the same as the pool name
        // this is just for display purposes
        // the pool name is formatted like so:
        // 50 wETH 33 3S-ETH 17 3L-ETH
        const poolNameComponents = balancerPoolName.split(' ');
        // results in something like
        // ['50', 'wETH', '33', '3S-ETH', '17', '3L-ETH']

        const token1 = poolNameComponents[1].toUpperCase();
        const token2 = poolNameComponents[3].toUpperCase();
        const token3 = poolNameComponents[5].toUpperCase();

        // the tracer pool token symbols have a trailing '/USD' in the symbol
        // but the balancer pool name omits this trailing '/USD'
        const tokens: BalancerPoolAsset[] = [
            tokenLookup[token1] || tokenLookup[`${token1}/USD`],
            tokenLookup[token2] || tokenLookup[`${token2}/USD`],
            tokenLookup[token3] || tokenLookup[`${token3}/USD`],
        ];

        return { tokens };
    };

    const refreshFarm = async (farmAddress: string) => {
        const farm = farms[farmAddress];
        const { stakingToken, stakingTokenDecimals } = farm;
        if (account && farm) {
            const [stakingTokenBalance, stakingTokenAllowance, myStaked, myRewards, rewardsTokenAddress] =
                await Promise.all([
                    stakingToken.balanceOf(account),
                    stakingToken.allowance(account, farmAddress),
                    farm.contract.balanceOf(account),
                    farm.contract.rewards(account),
                    farm.contract.rewardsToken(),
                ]);

            const rewardsToken = new ethers.Contract(rewardsTokenAddress, ERC20__factory.abi, signer) as ERC20;

            const rewardsTokenDecimals = await rewardsToken.decimals();

            const decimalMultiplier = 10 ** stakingTokenDecimals;

            setFarms((previousFarms) => ({
                ...previousFarms,
                [farmAddress]: {
                    ...previousFarms[farmAddress],
                    stakingTokenBalance: new BigNumber(stakingTokenBalance.toString()).div(decimalMultiplier),
                    stakingTokenAllowance: new BigNumber(stakingTokenAllowance.toString()).div(decimalMultiplier),
                    myStaked: new BigNumber(myStaked.toString()).div(decimalMultiplier),
                    myRewards: new BigNumber(myRewards.toString()).div(10 ** rewardsTokenDecimals),
                },
            }));
        }
    };

    const fetchFarms = useCallback(
        async ({ reset }: { reset: boolean }) => {
            if (provider && config && account) {
                if (reset) {
                    setFarms({});
                    setFetchingFarms(true);
                }

                Promise.all(
                    config[farmContext].map(async ({ address, abi, pool, balancerPoolId, link, linkText }) => {
                        try {
                            const contract = new ethers.Contract(address, abi, signer) as StakingRewards;

                            const [myStaked, stakingTokenAddress, myRewards, rewardsPerWeek, rewardsTokenAddress] =
                                await Promise.all([
                                    contract.balanceOf(account),
                                    contract.stakingToken(),
                                    contract.earned(account),
                                    contract.getRewardForDuration(),
                                    contract.rewardsToken(),
                                ]);

                            const stakingToken = new ethers.Contract(
                                stakingTokenAddress,
                                ERC20__factory.abi,
                                signer,
                            ) as ERC20;
                            const rewardsToken = new ethers.Contract(
                                rewardsTokenAddress,
                                ERC20__factory.abi,
                                signer,
                            ) as ERC20;

                            const [
                                stakingTokenName,
                                stakingTokenDecimals,
                                stakingTokenBalance,
                                stakingTokenAllowance,
                                _totalStaked,
                                rewardsTokenDecimals,
                                _stakingTokenSupply,
                            ] = await Promise.all([
                                stakingToken.name(),
                                stakingToken.decimals(),
                                stakingToken.balanceOf(account),
                                stakingToken.allowance(account, address),
                                contract.totalSupply(),
                                rewardsToken.decimals(),
                                stakingToken.totalSupply(),
                            ]);

                            const totalStaked = new BigNumber(
                                ethers.utils.formatUnits(_totalStaked, stakingTokenDecimals),
                            );

                            const isPoolTokenFarm = farmContext === 'poolFarms';

                            const bptDetails = isPoolTokenFarm
                                ? undefined
                                : await getBptDetails(balancerPoolId as string, pool, stakingTokenName);

                            const poolDetails = isPoolTokenFarm
                                ? {
                                      poolTokenPrice: (await fetchTokenPrice(pool, [stakingTokenAddress], provider))[0],
                                  }
                                : undefined;

                            const stakingDecimalMultiplier = 10 ** stakingTokenDecimals;
                            const rewardsDecimalMultiplier = 10 ** rewardsTokenDecimals;
                            // totalEmittedTokensPerYear x priceOfRewardsTokens) / (totalSupply x priceOfStakingTokens
                            const stakingTokenSupply = new BigNumber(_stakingTokenSupply.toString()).div(
                                stakingDecimalMultiplier,
                            );

                            const tvl = poolDetails
                                ? poolDetails.poolTokenPrice.times(totalStaked)
                                : calcBptTokenPrice({ bptDetails, stakingTokenSupply }).times(totalStaked);

                            return {
                                name: stakingTokenName,
                                address,
                                contract,
                                totalStaked,
                                stakingToken: stakingToken,
                                stakingTokenDecimals,
                                stakingTokenBalance: new BigNumber(stakingTokenBalance.toString()).div(
                                    stakingDecimalMultiplier,
                                ),
                                stakingTokenAllowance: new BigNumber(stakingTokenAllowance.toString()).div(
                                    stakingDecimalMultiplier,
                                ),
                                stakingTokenSupply,
                                myStaked: new BigNumber(myStaked.toString()).div(stakingDecimalMultiplier),
                                myRewards: new BigNumber(myRewards.toString()).div(rewardsDecimalMultiplier),
                                rewardsPerYear: new BigNumber(rewardsPerWeek.toString())
                                    .div(rewardsDecimalMultiplier)
                                    .times(52),
                                isPoolTokenFarm,
                                bptDetails,
                                poolDetails: poolDetails,
                                tvl,
                                link,
                                linkText,
                            };
                        } catch (error) {
                            console.error('failed fetching farm with address: ', address, error);
                            return;
                        }
                    }),
                ).then((farms_) => {
                    const farms: FarmsLookup = {};
                    farms_.forEach((farm: Farm | undefined) => {
                        if (farm) {
                            farms[farm.address] = farm;
                        }
                    });
                    setFarms(farms);
                    setFetchingFarms(false);
                });
            }
        },
        [provider, config, account],
    );

    // fetch farms initially
    useEffect(() => {
        fetchFarms({ reset: false });
    }, []);

    // update farms on network change
    useEffect(() => {
        fetchFarms({ reset: true });
    }, [signer, config, account]);

    return (
        <FarmContext.Provider
            value={{
                farms,
                refreshFarm,
                fetchingFarms,
            }}
        >
            {children}
        </FarmContext.Provider>
    );
};

export const useFarms: () => ContextProps = () => {
    const context = useContext(FarmContext);
    if (context === undefined) {
        throw new Error(`useFarms must be called within FarmContext`);
    }
    return context;
};
