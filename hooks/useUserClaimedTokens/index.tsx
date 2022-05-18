import { useState, useEffect } from 'react';
import { BigNumber } from 'bignumber.js';
import { calcEffectiveLongGain, calcEffectiveShortGain, calcNotionalValue } from '@tracer-protocol/pools-js';
import { TokenRowProps } from '~/archetypes/Portfolio//state';
import { usePools } from '~/hooks/usePools';
import { LoadingRows } from '~/types/hooks';

export const useUserClaimedTokens = (): LoadingRows<TokenRowProps> => {
    const { pools, isLoadingPools } = usePools();
    const [rows, setRows] = useState<TokenRowProps[]>([]);

    useEffect(() => {
        if (pools) {
            const poolValues = Object.values(pools);
            const tokens: TokenRowProps[] = [];

            poolValues.forEach((pool) => {
                const { poolInstance, userBalances } = pool;

                const { address, oraclePrice, longToken, shortToken, longBalance, shortBalance, leverage } =
                    poolInstance;
                const leverageBN = new BigNumber(leverage);

                const longTokenPrice = poolInstance.getLongTokenPrice();
                const longNotionalValue = calcNotionalValue(longTokenPrice, userBalances.longToken.balance);
                const shortTokenPrice = poolInstance.getShortTokenPrice();
                const shortNotionalValue = calcNotionalValue(shortTokenPrice, userBalances.shortToken.balance);

                if (!userBalances.shortToken.balance.eq(0)) {
                    tokens.push({
                        name: shortToken.name,
                        poolAddress: address,
                        address: shortToken.address,
                        decimals: shortToken.decimals,
                        symbol: shortToken.symbol,
                        side: shortToken.side,
                        currentTokenPrice: poolInstance.getShortTokenPrice(),
                        balance: userBalances.shortToken.balance,
                        leveragedNotionalValue: shortNotionalValue.times(leverageBN),
                        oraclePrice: oraclePrice,
                        effectiveGain: calcEffectiveShortGain(shortBalance, longBalance, leverageBN).toNumber(),
                        entryPrice: userBalances.tradeStats.avgShortEntryPriceWallet,
                        settlementTokenSymbol: poolInstance.settlementToken.symbol,
                    });
                }
                if (!userBalances.longToken.balance.eq(0)) {
                    tokens.push({
                        name: longToken.name,
                        poolAddress: address,
                        address: longToken.address,
                        decimals: longToken.decimals,
                        symbol: longToken.symbol,
                        side: longToken.side,
                        currentTokenPrice: poolInstance.getLongTokenPrice(),
                        balance: userBalances.longToken.balance,
                        leveragedNotionalValue: longNotionalValue.times(leverageBN),
                        oraclePrice: oraclePrice,
                        effectiveGain: calcEffectiveLongGain(longBalance, longBalance, leverageBN).toNumber(),
                        entryPrice: userBalances.tradeStats.avgLongEntryPriceWallet,
                        settlementTokenSymbol: poolInstance.settlementToken.symbol,
                    });
                }
            });

            setRows(tokens);
        }
    }, [pools]);

    return {
        rows,
        isLoading: isLoadingPools && rows.length === 0,
    };
};

export default useUserClaimedTokens;
