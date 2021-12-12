import { useState, useEffect } from 'react';
import { usePools } from '@context/PoolContext';
import { calcTokenPrice } from '@tracer-protocol/tracer-pools-utils';
import { BigNumber } from 'bignumber.js';
import { TokenRowProps } from '@archetypes/Portfolio/Overview';

// const useBrowsePools
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
    // useEffect(() => {
    //     const tokens: Record<number, string> = {
    //         0: '1L-BTC/USD',
    //         1: '1S-BTC/USD',
    //         2: '1L-ETH/USD',
    //         3: '1S-ETH/USD',
    //         4: '3L-BTC/USD',
    //         5: '3S-BTC/USD',
    //         6: '3L-ETH/USD',
    //         7: '3S-ETH/USD',
    //     };
    //     for (let i = 0; i < 8; i++) {
    //         const balance = new BigNumber(Math.random() * 100000);
    //         const tokenSupply = new BigNumber(Math.random() * 1000000);
    //         rows.push({
    //             address: '',
    //             decimals: 6,
    //             symbol: tokens[i],
    //             name: tokens[i],
    //             price: calcTokenPrice(balance, tokenSupply),
    //             holdings: new BigNumber(Math.random() * 1000),
    //             deposits: new BigNumber(Math.random() * 10000),
    //         });
    //     }
    //     setRows(rows);
    //     setLoading(false);
    // }, []);
    return {
        rows,
        loading,
    };
}) as () => {
    rows: TokenRowProps[];
    loading: boolean;
};
