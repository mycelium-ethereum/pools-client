import { useState, useEffect } from 'react';
import { BigNumber } from 'bignumber.js';
import { calcEffectiveLongGain, calcEffectiveShortGain, calcNotionalValue } from '@tracer-protocol/pools-js';
import { TokenRowProps } from '~/archetypes/Portfolio//state';
import { usePools } from '~/hooks/usePools';

export default (() => {
    const { pools } = usePools();
    const [loading, setLoading] = useState<boolean>(true);
    const [rows, setRows] = useState<TokenRowProps[]>([]);

    useEffect(() => {
        if (pools) {
            const poolValues = Object.values(pools);
            const rows: TokenRowProps[] = [];

            poolValues.forEach((pool) => {
                const { poolInstance, userBalances } = pool;

                const { address, oraclePrice, longToken, shortToken, longBalance, shortBalance, leverage } =
                    poolInstance;
                const leverageBN = new BigNumber(leverage);

                const longTokenPrice = poolInstance.getLongTokenPrice();
                const longNotionalValue = calcNotionalValue(longTokenPrice, userBalances.longToken.balance);
                const shortTokenPrice = poolInstance.getShortTokenPrice();
                const shortNotionalValue = calcNotionalValue(shortTokenPrice, userBalances.shortToken.balance);

                rows.push(
                    {
                        name: shortToken.name,
                        poolAddress: address,
                        address: shortToken.address,
                        decimals: shortToken.decimals,
                        symbol: shortToken.symbol,
                        side: shortToken.side,
                        currentTokenPrice: poolInstance.getShortTokenPrice(),
                        balance: userBalances.shortToken.balance,
                        notionalValue: shortNotionalValue,
                        oraclePrice: oraclePrice,
                        effectiveGain: calcEffectiveShortGain(shortBalance, longBalance, leverageBN).toNumber(),
                        entryPrice: userBalances.tradeStats.avgShortEntryPriceWallet,
                        settlementTokenSymbol: poolInstance.settlementToken.symbol,
                    },
                    {
                        name: longToken.name,
                        poolAddress: address,
                        address: longToken.address,
                        decimals: longToken.decimals,
                        symbol: longToken.symbol,
                        side: longToken.side,
                        currentTokenPrice: poolInstance.getLongTokenPrice(),
                        balance: userBalances.longToken.balance,
                        notionalValue: longNotionalValue,
                        oraclePrice: oraclePrice,
                        effectiveGain: calcEffectiveLongGain(longBalance, longBalance, leverageBN).toNumber(),
                        entryPrice: userBalances.tradeStats.avgLongEntryPriceWallet,
                        settlementTokenSymbol: poolInstance.settlementToken.symbol,
                    },
                );
            });

            setRows(rows);
            setLoading(false);
        }
    }, [pools]);
    return {
        rows,
        loading,
    };
}) as () => {
    rows: TokenRowProps[];
    loading: boolean;
};
