import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import shallow from 'zustand/shallow';
import { ERC20__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { networkConfig as networkConfig_ } from '~/constants/networks';
import { TCR_DECIMALS, USDC_DECIMALS } from '~/constants/pools';
import { farmConfig } from '~/constants/staking';
import { useAllPoolLists } from '~/hooks/useAllPoolLists';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';
import { Network } from '~/types/networks';
import { Farm, FarmConfig } from '~/types/staking';
import { UniswapV2Router02__factory, UniswapV2Router02 } from '~/types/uniswapV2Router';
import { aggregateInfo, getStakingRewardsInfo, getTokenCallsInfo } from './utils';

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
    const { signer, account, multicallProvider, network } = useStore(selectWeb3Info, shallow);

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
        if (!multicallProvider || !account || staticPoolInfo.length === 0) {
            return;
        }
        if (reset) {
            setFetchingFarms(true);
            setFarms({});
        }
        const stakingRewardsLookup = await getStakingRewardsInfo(config.poolFarms, account, multicallProvider);
        const tokenCallsLookup = await getTokenCallsInfo(
            stakingRewardsLookup,
            config.poolFarms,
            account,
            multicallProvider,
        );
        const farms = await aggregateInfo(
            stakingRewardsLookup,
            tokenCallsLookup,
            config.poolFarms,
            network,
            staticPoolInfo,
            multicallProvider,
        );

        setFarms(farms);
        setFetchingFarms(false);
    };

    const refreshRewardsTokenPriceUSDC = async ({ address, decimals }: { address?: string; decimals?: number }) => {
        if (!config?.sushiRouterAddress || !address || !decimals || !networkConfig.usdcAddress || !multicallProvider) {
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

    // update farms on network change
    useEffect(() => {
        const fetchData = async () => {
            await fetchFarms({ reset: true });
            await refreshTcrPriceUSDC();
            await refreshFxsPriceUSDC();
        };

        fetchData();
    }, [multicallProvider, account, staticPoolInfo]);

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
