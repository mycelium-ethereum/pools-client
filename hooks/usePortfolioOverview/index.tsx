import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { calcNotionalValue } from '@tracer-protocol/pools-js';
import { DEFAULT_PENDING_COMMIT_AMOUNTS } from '~/constants/commits';
import { useStore } from '~/store/main';
import { selectUserPendingCommitAmounts } from '~/store/PendingCommitSlice';
import { selectAccount } from '~/store/Web3Slice';
import { PortfolioOverview } from '~/types/portfolio';
import { calcPercentageDifference } from '~/utils/converters';
import useFarmBalances from '../useFarmBalances';
import usePools from '../usePools';

export const usePortfolioOverview = (): PortfolioOverview => {
    const { pools } = usePools();
    const account = useStore(selectAccount);
    const poolPendingCommitAmounts = useStore(selectUserPendingCommitAmounts);
    const farmBalances = useFarmBalances();

    const [portfolioOverview, setPortfolioOverview] = useState<PortfolioOverview>({
        totalPortfolioValue: new BigNumber(0),
        unrealisedProfit: new BigNumber(0),
        realisedProfit: new BigNumber(0),
        portfolioDelta: 0,
    });

    useEffect(() => {
        if (!account) {
            setPortfolioOverview({
                totalPortfolioValue: new BigNumber(0),
                unrealisedProfit: new BigNumber(0),
                realisedProfit: new BigNumber(0),
                portfolioDelta: 0,
            });
        } else if (pools) {
            const poolValues = Object.values(pools);
            let realisedProfit = new BigNumber(0);
            let totalPortfolioValue = new BigNumber(0);

            let totalSettlementSpend = new BigNumber(0);

            poolValues.forEach((pool) => {
                const { poolInstance, userBalances } = pool;
                const { totalLongBurnReceived, totalShortBurnReceived, totalLongMintSpend, totalShortMintSpend } =
                    userBalances.tradeStats;

                const pendingAmounts =
                    poolPendingCommitAmounts?.[pool.poolInstance.address.toLowerCase()]?.[account] ??
                    DEFAULT_PENDING_COMMIT_AMOUNTS;

                const shortTokenPrice = poolInstance.getShortTokenPrice();
                const longTokenPrice = poolInstance.getLongTokenPrice();

                const nextLongTokenPrice = poolInstance.getNextLongTokenPrice();
                const nextShortTokenPrice = poolInstance.getNextShortTokenPrice();

                const shortStaked: BigNumber = farmBalances[poolInstance.shortToken.address] ?? new BigNumber(0);
                const longStaked: BigNumber = farmBalances[poolInstance.longToken.address] ?? new BigNumber(0);
                const totalStaked = shortStaked.times(nextShortTokenPrice).plus(longStaked.times(nextLongTokenPrice));

                totalPortfolioValue = totalPortfolioValue
                    .plus(calcNotionalValue(shortTokenPrice, userBalances.shortToken.balance))
                    .plus(calcNotionalValue(shortTokenPrice, userBalances.aggregateBalances.shortTokens))
                    .plus(calcNotionalValue(longTokenPrice, userBalances.longToken.balance))
                    .plus(calcNotionalValue(longTokenPrice, userBalances.aggregateBalances.longTokens))
                    // TODO handle non stable coin settlementTokens
                    .plus(userBalances.aggregateBalances.settlementTokens)
                    .plus(pendingAmounts.longMint)
                    .plus(pendingAmounts.shortMint)
                    // not accurate but not sure how much it matters
                    .plus(calcNotionalValue(nextLongTokenPrice, pendingAmounts.longBurn))
                    .plus(calcNotionalValue(nextShortTokenPrice, pendingAmounts.shortBurn))
                    .plus(totalStaked);

                totalSettlementSpend = totalSettlementSpend
                    .plus(totalLongMintSpend)
                    .plus(totalShortMintSpend)
                    .plus(pendingAmounts.longMint)
                    .plus(pendingAmounts.shortMint);

                realisedProfit = realisedProfit.plus(totalShortBurnReceived).plus(totalLongBurnReceived);
            });

            setPortfolioOverview({
                totalPortfolioValue,
                realisedProfit,
                portfolioDelta: calcPercentageDifference(
                    totalPortfolioValue.toNumber(),
                    totalSettlementSpend.toNumber(),
                ),
                unrealisedProfit: totalPortfolioValue.minus(totalSettlementSpend),
            });
        }
    }, [pools, account, poolPendingCommitAmounts, farmBalances]);

    return portfolioOverview;
};

export default usePortfolioOverview;
