import { useEffect, useState } from 'react';
import { BigNumber } from 'bignumber.js';
import { calcNotionalValue, SideEnum } from '@tracer-protocol/pools-js';
import { TokenType } from '~/archetypes/Portfolio/state';
import { LogoTicker } from '~/components/General';
import { usePools } from '~/hooks/usePools';
import { LoadingRows } from '~/types/hooks';
import { PoolStatus } from '~/types/pools';
import { UnclaimedRowInfo } from '~/types/unclaimedTokens';
import { getBaseAsset } from '~/utils/poolNames';
import { useDeprecatedPools } from '../useDeprecatedPools';

export const useUserUnclaimedTokens = (): LoadingRows<UnclaimedRowInfo> => {
    const { pools, isLoadingPools } = usePools();
    const deprecatedPools = useDeprecatedPools();
    const [rows, setRows] = useState<UnclaimedRowInfo[]>([]);

    useEffect(() => {
        if (pools) {
            const _rows: UnclaimedRowInfo[] = [];
            Object.values(pools).forEach((pool) => {
                const { poolInstance, userBalances } = pool;

                const { shortToken, longToken, settlementToken, leverage, address, name } = poolInstance;

                const poolStatus = deprecatedPools[address] ? PoolStatus.Deprecated : PoolStatus.Live;

                // TODO calc relevant token price
                const longTokenPrice = poolInstance.getLongTokenPrice();
                const shortTokenPrice = poolInstance.getShortTokenPrice();

                // 1 for stable coins
                // TODO support non stable coin settlement tokens
                const settlementTokenPrice = new BigNumber(1);

                const longEntryPrice = userBalances.tradeStats.avgLongEntryPriceAggregate;
                const longTokenNotional = calcNotionalValue(longEntryPrice, userBalances.aggregateBalances.longTokens);

                const shortEntryPrice = userBalances.tradeStats.avgShortEntryPriceAggregate;
                const shortTokenNotional = calcNotionalValue(
                    shortEntryPrice,
                    userBalances.aggregateBalances.shortTokens,
                );

                const settlementTokenValue =
                    userBalances.aggregateBalances.settlementTokens.times(settlementTokenPrice);

                const claimableLongTokens = {
                    symbol: longToken.symbol,
                    address: longToken.address,
                    decimals: settlementToken.decimals,
                    balance: userBalances.aggregateBalances.longTokens,
                    currentTokenPrice: longTokenPrice,
                    type: TokenType.Long,
                    side: SideEnum.long,
                    entryPrice: longEntryPrice,
                    leveragedNotionalValue: longTokenNotional.times(leverage),
                };
                const claimableShortTokens = {
                    symbol: shortToken.symbol,
                    address: shortToken.address,
                    decimals: settlementToken.decimals,
                    balance: userBalances.aggregateBalances.shortTokens,
                    currentTokenPrice: shortTokenPrice,
                    type: TokenType.Short,
                    side: SideEnum.short,
                    entryPrice: shortEntryPrice,
                    leveragedNotionalValue: shortTokenNotional.times(leverage),
                };
                const claimableSettlementTokens = {
                    symbol: settlementToken.symbol,
                    address: settlementToken.address,
                    decimals: settlementToken.decimals,
                    balance: userBalances.aggregateBalances.settlementTokens,
                    currentTokenPrice: settlementTokenPrice,
                    type: TokenType.Settlement,
                    leveragedNotionalValue: settlementTokenValue,
                };
                const claimableSum = userBalances.aggregateBalances.settlementTokens
                    .plus(userBalances.aggregateBalances.shortTokens.times(shortEntryPrice))
                    .plus(userBalances.aggregateBalances.longTokens.times(longEntryPrice));

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
                    marketTicker: getBaseAsset(name) as LogoTicker,
                    claimableSettlementTokens,
                    claimableLongTokens,
                    claimableShortTokens,
                    claimableSum,
                    numClaimable,
                    poolStatus,
                });
            });
            setRows(_rows);
        }
    }, [pools]);

    return {
        rows,
        isLoading: isLoadingPools && rows.length === 0,
    };
};

export default useUserUnclaimedTokens;
