import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import shallow from 'zustand/shallow';
import { ERC20__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
import { KnownNetwork } from '@tracer-protocol/pools-js';

import { deprecatedPools } from '~/constants/deprecatedPools';
import { networkConfig as networkConfig_ } from '~/constants/networks';
import { TCR_DECIMALS, USDC_DECIMALS } from '~/constants/pools';
import { farmConfig } from '~/constants/staking';
import { useAllPoolLists } from '~/hooks/useAllPoolLists';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';
import { Network } from '~/types/networks';
import { PoolStatus } from '~/types/pools';
import { Farm, FarmConfig } from '~/types/staking';
import { StakingRewards } from '~/types/staking/typechain';
import { UniswapV2Router02__factory, UniswapV2Router02 } from '~/types/uniswapV2Router';
import { fetchTokenPrice } from '~/utils/farms';

type RewardsTokenUSDPrices = Record<string, BigNumber>;
type FarmsLookup = { [address: string]: Farm };
interface ContextProps {
    farms: FarmsLookup;
    refreshFarm: (farmAddress: string) => void;
    fetchingFarms: boolean;
    rewardsTokenUSDPrices: RewardsTokenUSDPrices;
}

export const FarmContext = React.createContext<ContextProps>({
    farms: {},
    refreshFarm: () => console.error('default FarmContext.refreshFarm'),
    fetchingFarms: false,
    rewardsTokenUSDPrices: {},
});

export type FarmContexts = 'poolFarms';

/**
 * Wrapper store for the FarmContext.
 */
export const FarmStore: React.FC = ({ children }) => {
    const staticPoolInfo = useAllPoolLists();
    const { signer, account, provider, network } = useStore(selectWeb3Info, shallow);
    const [farms, setFarms] = useState<ContextProps['farms']>({});
    const [fetchingFarms, setFetchingFarms] = useState<boolean>(false);
    const [rewardsTokenUSDPrices, setRewardsTokenUSDPrices] = useState<Record<string, BigNumber>>({});

    // want to fail over to undefined
    const config: FarmConfig | undefined = farmConfig[network ?? ('0' as KnownNetwork)];
    const networkConfig: Network | undefined = networkConfig_[network ?? ('0' as KnownNetwork)];

    const refreshFarm = async (farmAddress: string) => {
        const farm = farms[farmAddress];
        const { stakingToken, stakingTokenDecimals } = farm;
        if (account && network && farm) {
            const [stakingTokenBalance, stakingTokenAllowance, myStaked, myRewards, rewardsTokenAddress] =
                await Promise.all([
                    stakingToken.balanceOf(account),
                    stakingToken.allowance(account, farmAddress),
                    farm.contract.balanceOf(account),
                    farm.contract.rewards(account),
                    farm.contract.rewardsToken(),
                ]);

            // @ts-ignore
            const rewardsToken = ERC20__factory.connect(rewardsTokenAddress, signer);

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

    const fetchFarms = async ({ reset }: { reset: boolean }) => {
        if (provider && account && staticPoolInfo.length !== 0) {
            if (reset) {
                setFetchingFarms(true);
                setFarms({});
            }

            Promise.all(
                config.poolFarms.map(async ({ address, abi, pool, link, linkText, rewardsEnded }) => {
                    try {
                        const contract = new ethers.Contract(address, abi, provider) as StakingRewards;

                        const [myStaked, stakingTokenAddress, myRewards, rewardsPerWeek, rewardsTokenAddress] =
                            await Promise.all([
                                contract.balanceOf(account),
                                contract.stakingToken(),
                                contract.earned(account),
                                contract.getRewardForDuration(),
                                contract.rewardsToken(),
                            ]);

                        const stakingToken = ERC20__factory.connect(stakingTokenAddress, provider);
                        const rewardsToken = ERC20__factory.connect(rewardsTokenAddress, provider);

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

                        const totalStaked = new BigNumber(ethers.utils.formatUnits(_totalStaked, stakingTokenDecimals));

                        const poolInfo = staticPoolInfo.find((poolInfo) => poolInfo.address === pool);
                        if (!poolInfo) {
                            console.error(`Failed find to ${pool.slice()} in poolList`, staticPoolInfo.slice());
                            return;
                        }
                        const poolDetails = {
                            poolTokenPrice: await fetchTokenPrice(poolInfo, stakingTokenAddress, provider),
                            address: poolInfo.address,
                            status:
                                network && deprecatedPools?.[network]?.[poolInfo.address]
                                    ? PoolStatus.Deprecated
                                    : PoolStatus.Live,
                        };

                        const stakingDecimalMultiplier = 10 ** stakingTokenDecimals;
                        const rewardsDecimalMultiplier = 10 ** rewardsTokenDecimals;
                        // totalEmittedTokensPerYear x priceOfRewardsTokens) / (totalSupply x priceOfStakingTokens
                        const stakingTokenSupply = new BigNumber(_stakingTokenSupply.toString()).div(
                            stakingDecimalMultiplier,
                        );

                        const tvl = poolDetails.poolTokenPrice.times(totalStaked);

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
                            poolDetails,
                            tvl,
                            link,
                            linkText,
                            rewardsEnded: Boolean(rewardsEnded),
                            rewardsTokenAddress,
                        };
                    } catch (error) {
                        console.error('Failed fetching farm with address: ', address, error);
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
    };

    const refreshRewardsTokenPriceUSDC = async ({ address, decimals }: { address?: string; decimals?: number }) => {
        if (!config?.sushiRouterAddress || !address || !decimals || !networkConfig.usdcAddress || !provider) {
            // no update to perform
            return;
        }

        const sushiRouter = new ethers.Contract(
            config?.sushiRouterAddress,
            UniswapV2Router02__factory.abi,
            signer,
        ) as UniswapV2Router02;

        const oneUnit = new BigNumber('1').times(10 ** decimals);

        const [, buyPrice] = await sushiRouter
            .getAmountsOut(oneUnit.toFixed(), [address, networkConfig.usdcAddress])
            .catch((_err) => {
                console.error('Failed to fetch rewardsTokenPrice');
                return [0, 0];
            });

        const formattedUSDCPrice = new BigNumber(ethers.utils.formatUnits(buyPrice, USDC_DECIMALS));

        setRewardsTokenUSDPrices((previousValue) => ({
            ...previousValue,
            // we can cast here because we exit early if it's not set
            [address as string]: formattedUSDCPrice,
        }));
    };

    const refreshTcrPriceUSDC = async () => {
        refreshRewardsTokenPriceUSDC({
            address: networkConfig?.tcrAddress,
            decimals: TCR_DECIMALS,
        });
    };

    const refreshFxsPriceUSDC = async () => {
        refreshRewardsTokenPriceUSDC({
            address: config?.stakingRewardTokens?.fxs.address,
            decimals: config?.stakingRewardTokens?.fxs.decimals,
        });
    };

    // fetch farms initially
    useEffect(() => {
        fetchFarms({ reset: false });
        refreshTcrPriceUSDC();
        refreshFxsPriceUSDC();
    }, []);

    // update farms on network change
    useEffect(() => {
        fetchFarms({ reset: true });
        refreshTcrPriceUSDC();
        refreshFxsPriceUSDC();
    }, [provider, config, account, staticPoolInfo]);

    return (
        <FarmContext.Provider
            value={{
                farms,
                refreshFarm,
                fetchingFarms,
                rewardsTokenUSDPrices,
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
