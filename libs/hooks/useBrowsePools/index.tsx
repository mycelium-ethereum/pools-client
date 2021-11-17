import { useState, useEffect } from 'react';
import { BrowseTableRowData } from '@archetypes/Browse/state';
import { usePools } from '@context/PoolContext';
import { calcEffectiveLongGain, calcEffectiveShortGain, calcTokenPrice } from '@tracer-protocol/pools-js/dist/utils';
import { BigNumber } from 'bignumber.js';

// const useBrowsePools
export default (() => {
    const { pools } = usePools();
    const [rows, setRows] = useState<BrowseTableRowData[]>([]);
    useEffect(() => {
        if (pools) {
            const poolValues = Object.values(pools);
            const rows: BrowseTableRowData[] = [];
            poolValues.forEach((pool_) => {
                const { poolInstance: pool, userBalances } = pool_;
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
                        lastPrice: calcTokenPrice(shortBalance, shortToken.supply.plus(pendingShortBurn)).toNumber(),
                        nextPrice: pool.getNextShortTokenPrice().toNumber(),
                        effectiveGain: calcEffectiveShortGain(shortBalance, longBalance, leverageBN).toNumber(),
                        nextRebalance: pool.lastUpdate.plus(pool.updateInterval).toNumber(),
                        totalValueLocked: pool.shortBalance.toNumber(),
                        myHoldings: userBalances.shortToken.balance.toNumber(),
                        frontRunning: pool.frontRunningInterval.toNumber(),
                    },
                    {
                        address: longToken.address,
                        decimals: longToken.decimals,
                        pool: pool.address,
                        symbol: longToken.symbol,
                        leverage: pool.leverage,
                        side: 'long',
                        lastPrice: calcTokenPrice(longBalance, longToken.supply.plus(pendingLongBurn)).toNumber(),
                        nextPrice: pool.getNextLongTokenPrice().toNumber(),
                        effectiveGain: calcEffectiveLongGain(shortBalance, longBalance, leverageBN).toNumber(),
                        nextRebalance: pool.lastUpdate.plus(pool.updateInterval).toNumber(),
                        totalValueLocked: pool.longBalance.toNumber(),
                        myHoldings: userBalances.longToken.balance.toNumber(),
                        frontRunning: pool.frontRunningInterval.toNumber(),
                    },
                );
            });
            setRows(rows);
        }
    }, [pools]);
    return rows;
}) as () => BrowseTableRowData[];
