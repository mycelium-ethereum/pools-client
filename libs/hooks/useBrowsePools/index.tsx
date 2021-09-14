import { useState, useEffect } from 'react';
import { BrowseTableRowData } from '@archetypes/Browse/state';
import { usePools } from '@context/PoolContext';
import { calcRebalanceRate, calcTokenPrice } from '@libs/utils/calcs';

// const useBrowsePools
export default (() => {
    const { pools } = usePools();
    const [rows, setRows] = useState<BrowseTableRowData[]>([]);
    useEffect(() => {
        if (pools) {
            const poolValues = Object.values(pools);
            const rows: BrowseTableRowData[] = [];
            poolValues.forEach((pool) => {
                const { longToken, shortToken } = pool;
                rows.push(
                    {
                        address: shortToken.address,
                        pool: pool.address,
                        symbol: shortToken.symbol,
                        leverage: pool.leverage,
                        side: 'short',
                        lastPrice: calcTokenPrice(pool.nextShortBalance, shortToken.supply).toNumber(),
                        rebalanceRate: calcRebalanceRate(pool.nextShortBalance.plus(pool.committer.pendingShort), pool.nextLongBalance.plus(pool.committer.pendingLong)).toNumber(),
                        nextRebalance: pool.lastUpdate.plus(pool.updateInterval).toNumber(),
                        totalValueLocked: pool.shortBalance.toNumber(),
                        myHoldings: shortToken.balance.toNumber(),
                    },
                    {
                        address: longToken.address,
                        pool: pool.address,
                        symbol: longToken.symbol,
                        leverage: pool.leverage,
                        side: 'long',
                        lastPrice: calcTokenPrice(pool.nextLongBalance, longToken.supply).toNumber(),
                        rebalanceRate: calcRebalanceRate(pool.nextShortBalance.plus(pool.committer.pendingShort), pool.nextLongBalance.plus(pool.committer.pendingLong)).toNumber(),
                        nextRebalance: pool.lastUpdate.plus(pool.updateInterval).toNumber(),
                        totalValueLocked: pool.longBalance.toNumber(),
                        myHoldings: longToken.balance.toNumber(),
                    },
                );
            });
            setRows(rows);
        }
    }, [pools]);
    return rows;
}) as () => BrowseTableRowData[];
