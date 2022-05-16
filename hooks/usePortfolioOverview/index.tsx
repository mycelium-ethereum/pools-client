import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { calcNotionalValue } from '@tracer-protocol/pools-js';
import { PortfolioOverview } from '~/archetypes/Portfolio/state';
import { useStore } from '~/store/main';
import { selectAccount } from '~/store/Web3Slice';
import { calcPercentageDifference } from '~/utils/converters';
import usePools from '../usePools';

export const usePortfolioOverview = (): PortfolioOverview => {
    const { pools } = usePools();
    const account = useStore(selectAccount);
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
                const {
                    totalLongBurnReceived,
                    totalShortBurnReceived,

                    totalLongMintSpend,
                    totalShortMintSpend,
                } = userBalances.tradeStats;

                const shortTokenPrice = poolInstance.getShortTokenPrice();
                const longTokenPrice = poolInstance.getLongTokenPrice();

                totalPortfolioValue = totalPortfolioValue
                    .plus(calcNotionalValue(shortTokenPrice, userBalances.shortToken.balance))
                    .plus(calcNotionalValue(shortTokenPrice, userBalances.aggregateBalances.shortTokens))
                    .plus(calcNotionalValue(longTokenPrice, userBalances.longToken.balance))
                    .plus(calcNotionalValue(longTokenPrice, userBalances.aggregateBalances.longTokens));

                totalSettlementSpend = totalSettlementSpend.plus(totalLongMintSpend).plus(totalShortMintSpend);

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
    }, [pools, account]);

    return portfolioOverview;
};

export default usePortfolioOverview;
