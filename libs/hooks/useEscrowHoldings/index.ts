import { useEffect, useState } from 'react';
import { EscrowRowProps, EntryPrice, TokenType } from '@archetypes/Portfolio/Overview/state';
import { usePools } from '@context/PoolContext';
import { LogoTicker } from '@components/General';
import { BigNumber } from 'bignumber.js';
import useSubgraphAggregateBalances from '../useSubgraphAggregateBalances';

// TODO fetch acquisition prices from API
// mock return of prices
const fetchEntryPrices: () => {
    shortToken: EntryPrice;
    longToken: EntryPrice;
} = () => {
    return {
        shortToken: {
            tokenPrice: new BigNumber(1),
            basePrice: new BigNumber(100),
        },
        longToken: {
            tokenPrice: new BigNumber(1),
            basePrice: new BigNumber(100),
        },
    };
};

export default (() => {
    const { pools } = usePools();
    const subgraphAggregateBalances = useSubgraphAggregateBalances();
    const [rows, setRows] = useState<EscrowRowProps[]>([]);
    const [rowsWithSubgraph, setRowsWithSubgraph] = useState<EscrowRowProps[]>([]);

    useEffect(() => {
        if (pools) {
            const _rows: EscrowRowProps[] = [];
            Object.values(pools).forEach((pool) => {
                const { poolInstance, userBalances } = pool;

                const { shortToken, longToken, quoteToken, leverage, address, name } = poolInstance;

                const entryPrices = fetchEntryPrices();

                const nextLongTokenPrice = poolInstance.getNextLongTokenPrice();

                const nextShortTokenPrice = poolInstance.getNextShortTokenPrice();

                // 1 for stable coins
                const quoteTokenPrice = new BigNumber(1);

                const longTokenValue = userBalances.aggregateBalances.longTokens.times(nextLongTokenPrice);
                const shortTokenValue = userBalances.aggregateBalances.shortTokens.times(nextShortTokenPrice);
                const quoteTokenValue = userBalances.aggregateBalances.quoteTokens.times(quoteTokenPrice);

                const claimableLongTokens = {
                    symbol: longToken.symbol,
                    balance: userBalances.aggregateBalances.longTokens,
                    currentTokenPrice: nextLongTokenPrice,
                    type: TokenType.Long,
                    token: 'Long',
                    entryPrice: entryPrices?.longToken,
                    notionalValue: longTokenValue.times(leverage),
                };
                const claimableShortTokens = {
                    symbol: shortToken.symbol,
                    balance: userBalances.aggregateBalances.shortTokens,
                    currentTokenPrice: nextShortTokenPrice,
                    type: TokenType.Short,
                    token: 'Short',
                    entryPrice: entryPrices?.shortToken,
                    notionalValue: shortTokenValue.times(leverage),
                };
                const claimableSettlementTokens = {
                    symbol: quoteToken.symbol,
                    balance: userBalances.aggregateBalances.quoteTokens,
                    currentTokenPrice: quoteTokenPrice,
                    type: TokenType.Settlement,
                    token: quoteToken.symbol,
                    notionalValue: quoteTokenValue,
                };
                const claimableSum = userBalances.aggregateBalances.quoteTokens
                    .plus(userBalances.aggregateBalances.shortTokens.times(nextShortTokenPrice))
                    .plus(userBalances.aggregateBalances.longTokens.times(nextLongTokenPrice));
                const numClaimable = [claimableSettlementTokens, claimableShortTokens, claimableLongTokens].reduce(
                    (count, current) => {
                        if (current.balance.gt(0)) {
                            return count + 1;
                        }
                        return count;
                    },
                    0,
                );

                _rows.push({
                    poolAddress: address,
                    poolName: name,
                    marketTicker: name.split('-')[1].split('/')[0] as LogoTicker,
                    claimableSettlementTokens,
                    claimableLongTokens,
                    claimableShortTokens,
                    claimableSum,
                    numClaimable,
                });
            });
            setRows(_rows);
        }
    }, [pools]);

    useEffect(() => {
        if (Object.keys(subgraphAggregateBalances).length) {
            setRowsWithSubgraph(
                rows.map((row) => {
                    if (subgraphAggregateBalances[row.poolAddress.toLowerCase()]) {
                        const subgraphInfo = subgraphAggregateBalances[row.poolAddress.toLowerCase()];
                        // adds any subgraph info to the existing row
                        return {
                            ...row,
                            claimableLongTokens: {
                                ...row.claimableLongTokens,
                                balance: subgraphInfo.longTokenHolding,
                                entryPrice: {
                                    ...row.claimableLongTokens.entryPrice,
                                    tokenPrice: subgraphInfo.longTokenAvgBuyIn,
                                },
                            },
                            claimableShortTokens: {
                                ...row.claimableShortTokens,
                                balance: subgraphInfo.shortTokenHolding,
                                entryPrice: {
                                    ...row.claimableShortTokens.entryPrice,
                                    tokenPrice: subgraphInfo.shortTokenAvgBuyIn,
                                },
                            },
                        };
                    } else {
                        return row;
                    }
                }),
            );
        }
    }, [rows, subgraphAggregateBalances]);

    return rowsWithSubgraph;
}) as () => EscrowRowProps[];
