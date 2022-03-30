import { useState, useEffect } from 'react';
import { usePools } from '@context/PoolContext';
import { BigNumber } from 'bignumber.js';
import { TokenRowProps } from '@archetypes/Portfolio/Overview/state';

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

                const { address, oraclePrice, longToken, shortToken } = poolInstance;

                rows.push(
                    {
                        name: shortToken.name,
                        poolAddress: address,
                        address: shortToken.address,
                        decimals: shortToken.decimals,
                        symbol: shortToken.symbol,
                        side: shortToken.side,
                        price: poolInstance.getShortTokenPrice(),
                        holdings: userBalances.shortToken.balance,
                        deposits: new BigNumber(0),
                        oraclePrice: oraclePrice,
                    },
                    {
                        name: longToken.name,
                        poolAddress: address,
                        address: longToken.address,
                        decimals: longToken.decimals,
                        symbol: longToken.symbol,
                        side: longToken.side,
                        price: poolInstance.getLongTokenPrice(),
                        holdings: userBalances.longToken.balance,
                        deposits: new BigNumber(0),
                        oraclePrice: oraclePrice,
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
