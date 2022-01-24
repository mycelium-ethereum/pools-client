import { useEffect, useState } from 'react';
import { EscrowRowProps, EntryPrice, TokenType } from '@archetypes/Portfolio/Overview/state';
import { usePools } from '@context/PoolContext';
import { LogoTicker } from '@components/General';
import { calcTokenPrice } from '@tracer-protocol/tracer-pools-utils';
import { BigNumber } from 'bignumber.js';

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
    const [rows, setRows] = useState<EscrowRowProps[]>([]);

    useEffect(() => {
        // TODO fetch actual rows
        if (pools) {
            const _rows: EscrowRowProps[] = [];
            Object.values(pools).forEach((pool) => {
                const {
                    longToken,
                    shortToken,
                    nextShortBalance: shortBalanceAfterTransfer,
                    nextLongBalance: longBalanceAfterTransfer,
                    leverage,
                } = pool;

                const {
                    pendingLong: { burn: pendingLongBurn },
                    pendingShort: { burn: pendingShortBurn },
                } = pool.committer;

                const entryPrices = fetchEntryPrices();

                const nextLongTokenPrice = calcTokenPrice(
                    longBalanceAfterTransfer,
                    longToken.supply.plus(pendingLongBurn),
                );

                const nextShortTokenPrice = calcTokenPrice(
                    shortBalanceAfterTransfer,
                    shortToken.supply.plus(pendingShortBurn),
                );

                // 1 for stable coins
                const quoteTokenPrice = new BigNumber(1);

                const longTokenValue = pool.aggregateBalances.longTokens.times(nextLongTokenPrice);
                const shortTokenValue = pool.aggregateBalances.shortTokens.times(nextShortTokenPrice);
                const quoteTokenValue = pool.aggregateBalances.quoteTokens.times(quoteTokenPrice);

                const claimableLongTokens = {
                    symbol: pool.longToken.symbol,
                    balance: pool.aggregateBalances.longTokens,
                    currentTokenPrice: nextLongTokenPrice,
                    type: TokenType.Long,
                    token: 'Long',
                    entryPrice: entryPrices?.longToken,
                    notionalValue: longTokenValue.times(leverage),
                };
                const claimableShortTokens = {
                    symbol: pool.shortToken.symbol,
                    balance: pool.aggregateBalances.shortTokens,
                    currentTokenPrice: nextShortTokenPrice,
                    type: TokenType.Short,
                    token: 'Short',
                    entryPrice: entryPrices?.shortToken,
                    notionalValue: shortTokenValue.times(leverage),
                };
                const claimableSettlementTokens = {
                    symbol: pool.quoteToken.symbol,
                    balance: pool.aggregateBalances.quoteTokens,
                    currentTokenPrice: quoteTokenPrice,
                    type: TokenType.Settlement,
                    token: pool.quoteToken.symbol,
                    notionalValue: quoteTokenValue,
                };
                const claimableSum = pool.aggregateBalances.quoteTokens
                    .plus(pool.aggregateBalances.shortTokens.times(nextShortTokenPrice))
                    .plus(pool.aggregateBalances.longTokens.times(nextLongTokenPrice));
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
                    poolAddress: pool.address,
                    poolName: pool.name,
                    marketTicker: pool.name.split('-')[1].split('/')[0] as LogoTicker,
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

    return rows;
}) as () => EscrowRowProps[];
