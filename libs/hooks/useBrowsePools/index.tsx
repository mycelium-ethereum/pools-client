import { useState, useEffect } from 'react';
import { BrowseTableRowData } from '@archetypes/Browse/state';
import { usePools } from '@context/PoolContext';
import { calcEffectiveLongGain, calcEffectiveShortGain, calcTokenPrice } from '@tracer-protocol/tracer-pools-utils';
import { BigNumber } from 'bignumber.js';

// const useBrowsePools
export default (() => {
    const { pools } = usePools();
    const [rows, setRows] = useState<BrowseTableRowData[]>([]);
    useEffect(() => {
        if (pools) {
            const poolValues = Object.values(pools);
            const rows: BrowseTableRowData[] = [];
            poolValues.forEach((pool) => {
                const { longToken, shortToken, shortBalance, longBalance, leverage } = pool;
                const {
                    pendingLong: { burn: pendingLongBurn },
                    pendingShort: { burn: pendingShortBurn },
                } = pool.committer;

                const leverageBN = new BigNumber(leverage);
                rows.push(
                    {
                        address: shortToken.address,
                        decimals: shortToken.decimals,
                        pool: pool.address,
                        symbol: shortToken.symbol,
                        leverage: pool.leverage,
                        side: 'short',
                        lastPrice: calcTokenPrice(
                            pool.nextShortBalance,
                            shortToken.supply.plus(pendingShortBurn),
                        ).toNumber(),
                        effectiveGain: calcEffectiveShortGain(shortBalance, longBalance, leverageBN).toNumber(),
                        // rebalanceRate: calcRebalanceRate(
                        //     pool.nextShortBalance.plus(pool.committer.pendingShort.mint),
                        //     pool.nextLongBalance.plus(pool.committer.pendingLong.mint),
                        // ).toNumber(),
                        nextRebalance: pool.lastUpdate.plus(pool.updateInterval).toNumber(),
                        totalValueLocked: pool.shortBalance.toNumber(),
                        myHoldings: shortToken.balance.toNumber(),
                        frontRunning: pool.frontRunningInterval.toNumber(),
                    },
                    {
                        address: longToken.address,
                        decimals: longToken.decimals,
                        pool: pool.address,
                        symbol: longToken.symbol,
                        leverage: pool.leverage,
                        side: 'long',
                        lastPrice: calcTokenPrice(
                            pool.nextLongBalance,
                            longToken.supply.plus(pendingLongBurn),
                        ).toNumber(),
                        effectiveGain: calcEffectiveLongGain(shortBalance, longBalance, leverageBN).toNumber(),
                        // rebalanceRate: calcRebalanceRate(
                        //     pool.nextShortBalance.plus(pool.committer.pendingShort.mint),
                        //     pool.nextLongBalance.plus(pool.committer.pendingLong.mint),
                        // ).toNumber(),
                        nextRebalance: pool.lastUpdate.plus(pool.updateInterval).toNumber(),
                        totalValueLocked: pool.longBalance.toNumber(),
                        myHoldings: longToken.balance.toNumber(),
                        frontRunning: pool.frontRunningInterval.toNumber(),
                    },
                );
            });
            setRows(rows);
        }
    }, [pools]);
    return rows;
}) as () => BrowseTableRowData[];
