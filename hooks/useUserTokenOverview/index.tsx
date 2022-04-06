import { useState, useEffect } from 'react';
import { BigNumber } from 'bignumber.js';
import { calcEffectiveLongGain, calcEffectiveShortGain } from '@tracer-protocol/pools-js';
import { TokenRowProps } from '~/archetypes/Portfolio/Overview/state';
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
                        effectiveGain: calcEffectiveShortGain(shortBalance, longBalance, leverageBN).toNumber(),
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
                        effectiveGain: calcEffectiveLongGain(longBalance, longBalance, leverageBN).toNumber(),
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
