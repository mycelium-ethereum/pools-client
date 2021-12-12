import { useState, useEffect } from 'react';
import { usePools } from '@context/PoolContext';
import { calcTokenPrice } from '@tracer-protocol/tracer-pools-utils';
import { BigNumber } from 'bignumber.js';
import { TokenRowProps } from '@archetypes/Portfolio/Overview';

export default (() => {
    const { pools } = usePools();
    const [loading, setLoading] = useState<boolean>(true);
    const [rows, setRows] = useState<TokenRowProps[]>([]);

    useEffect(() => {
        if (pools) {
            const poolValues = Object.values(pools);
            const rows: TokenRowProps[] = [];

            poolValues.forEach((pool) => {
                const { longToken, shortToken, shortBalance, longBalance } = pool;
                const {
                    pendingLong: { burn: pendingLongBurn },
                    pendingShort: { burn: pendingShortBurn },
                } = pool.committer;

                rows.push(
                    {
                        name: shortToken.name,
                        address: shortToken.address,
                        decimals: shortToken.decimals,
                        symbol: shortToken.symbol,
                        price: calcTokenPrice(shortBalance, shortToken.supply.plus(pendingShortBurn)),
                        holdings: shortToken.balance,
                        deposits: new BigNumber(0),
                    },
                    {
                        name: longToken.name,
                        address: longToken.address,
                        decimals: longToken.decimals,
                        symbol: longToken.symbol,
                        price: calcTokenPrice(longBalance, longToken.supply.plus(pendingLongBurn)),
                        holdings: longToken.balance,
                        deposits: new BigNumber(0),
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
