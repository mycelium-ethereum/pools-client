import { useEffect, useState } from 'react';
import { BigNumber } from 'bignumber.js';
import { SideEnum } from '@tracer-protocol/pools-js';
import { EscrowRowProps, TokenType } from '~/archetypes/Portfolio/Overview/state';
import { LogoTicker } from '~/components/General';
import { usePools } from '~/hooks/usePools';
import useSubgraphAggregateBalances from '../useSubgraphAggregateBalances';

const DEFAULT_ENTRY_PRICES = {
    shortToken: {
        tokenPrice: new BigNumber(1),
        basePrice: new BigNumber(100),
    },
    longToken: {
        tokenPrice: new BigNumber(1),
        basePrice: new BigNumber(100),
    },
};

type EscrowRowInfo = Omit<EscrowRowProps, 'onClickCommitAction'>;

export default (() => {
    const { pools } = usePools();
    const subgraphAggregateBalances = useSubgraphAggregateBalances();
    const [rows, setRows] = useState<EscrowRowInfo[]>([]);
    const [rowsWithSubgraph, setRowsWithSubgraph] = useState<EscrowRowInfo[]>([]);

    useEffect(() => {
        if (pools) {
            const _rows: EscrowRowInfo[] = [];
            Object.values(pools).forEach((pool) => {
                const { poolInstance, userBalances } = pool;

                const { shortToken, longToken, settlementToken, leverage, address, name } = poolInstance;

                const nextLongTokenPrice = poolInstance.getNextLongTokenPrice();

                const nextShortTokenPrice = poolInstance.getNextShortTokenPrice();

                // 1 for stable coins
                const settlementTokenPrice = new BigNumber(1);

                const longTokenValue = userBalances.aggregateBalances.longTokens.times(nextLongTokenPrice);
                const shortTokenValue = userBalances.aggregateBalances.shortTokens.times(nextShortTokenPrice);
                const settlementTokenValue =
                    userBalances.aggregateBalances.settlementTokens.times(settlementTokenPrice);

                const claimableLongTokens = {
                    symbol: longToken.symbol,
                    balance: userBalances.aggregateBalances.longTokens,
                    currentTokenPrice: nextLongTokenPrice,
                    type: TokenType.Long,
                    side: SideEnum.long,
                    entryPrice: DEFAULT_ENTRY_PRICES.longToken,
                    notionalValue: longTokenValue.times(leverage),
                };
                const claimableShortTokens = {
                    symbol: shortToken.symbol,
                    balance: userBalances.aggregateBalances.shortTokens,
                    currentTokenPrice: nextShortTokenPrice,
                    type: TokenType.Short,
                    side: SideEnum.short,
                    entryPrice: DEFAULT_ENTRY_PRICES.shortToken,
                    notionalValue: shortTokenValue.times(leverage),
                };
                const claimableSettlementTokens = {
                    symbol: settlementToken.symbol,
                    balance: userBalances.aggregateBalances.settlementTokens,
                    currentTokenPrice: settlementTokenPrice,
                    type: TokenType.Settlement,
                    notionalValue: settlementTokenValue,
                };
                const claimableSum = userBalances.aggregateBalances.settlementTokens
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
