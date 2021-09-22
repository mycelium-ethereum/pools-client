import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Children } from 'libs/types/General';
import { useWeb3 } from '../Web3Context/Web3Context';
import { ethers } from 'ethers';
import { StakingRewards } from '@libs/staking/typechain';
import { ERC20, ERC20__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
import { UniswapV2Router02, UniswapV2Router02__factory } from '@libs/staking/uniswapRouterV2';
import usePoolTokens from '@libs/hooks/usePoolTokens';
import { Vault, Vault__factory } from '@libs/staking/balancerV2Vault';

import BigNumber from 'bignumber.js';
import { fetchTokenPrice } from './helpers';
import { USDC_DECIMALS } from '@libs/constants';
import { BalancerPoolAsset, Farm } from '@libs/types/Staking';

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
    const { tokenMap } = usePoolTokens();

    // used to fetch details of tokens on both sides of a sushi pool
    const getBptDetails = async (balancerPoolId: string, pool: string): Promise<Farm['bptDetails']> => {
        if (!config) {
            return undefined;
        }

        const balancerPool = new ethers.Contract(config.balancerVaultAddress, Vault__factory.abi, provider) as Vault;

        const [tokenAddresses, tokenBalances] = await balancerPool.getPoolTokens(balancerPoolId);

        const sushiRouter = new ethers.Contract(
            config.sushiRouterAddress,
            UniswapV2Router02__factory.abi,
            provider,
        ) as UniswapV2Router02;

        const tokens: BalancerPoolAsset[] = await Promise.all(
            tokenAddresses.map(async (address, index) => {
                const tokenContract = new ethers.Contract(address, ERC20__factory.abi, provider) as ERC20;

                const [decimals, symbol] = await Promise.all([tokenContract.decimals(), tokenContract.symbol()]);
                const tokenBalance = tokenBalances[index];

                const isPoolToken = Boolean(tokenMap[address]);

                let usdcPrice = new BigNumber(0);

                if (address.toLowerCase() === config.usdcAddress.toLowerCase()) {
                    usdcPrice = new BigNumber(1);
                } else if (config?.knownNonPoolTokenPricePaths?.[address]) {
                    const oneToken = new BigNumber('1').times(10 ** decimals);
                    const usdcPricePath = config.knownNonPoolTokenPricePaths[address];

                    const [_usdcPrice] = await sushiRouter.getAmountsIn(oneToken.toFixed(), usdcPricePath);

                    usdcPrice = new BigNumber(ethers.utils.formatUnits(_usdcPrice, USDC_DECIMALS));
                } else {
                    // not usdc and not listed as a known non-pool token
                    // assume it is a perpetual pools token
                    [usdcPrice] = await fetchTokenPrice(pool, [address], provider);
                }

                return {
                    address,
                    symbol,
                    isPoolToken,
                    reserves: new BigNumber(ethers.utils.formatUnits(tokenBalance, decimals)),
                    usdcPrice,
                    decimals,
                };
            }),
        );

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
                    config[farmContext].map(async ({ address, abi, pool, balancerPoolId }) => {
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
                                : await getBptDetails(balancerPoolId as string, pool);

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

                            return {
                                name: isPoolTokenFarm
                                    ? stakingTokenName
                                    : generateBptFarmName(bptDetails?.tokens || []),
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

// generates a farm name where the non-pool token (if either) is listed second
const generateBptFarmName = (tokens: BalancerPoolAsset[]) => {
    // ensure that the non-pool token is the second listed token
    return tokens.map((token) => token.symbol).join(', ');
};

export const useFarms: () => ContextProps = () => {
    const context = useContext(FarmContext);
    if (context === undefined) {
        throw new Error(`useFarms must be called within FarmContext`);
    }
    return context;
};
