import { useState, useEffect } from 'react';
import { BrowseTableRowData } from '@archetypes/Browse/state';
import { usePools } from '@context/PoolContext';
import {
    calcEffectiveLongGain,
    calcEffectiveShortGain,
    calcSkew,
    calcTokenPrice,
} from '@tracer-protocol/tracer-pools-utils';
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
                const {
                    longToken,
                    shortToken,
                    shortBalance,
                    longBalance,
                    nextShortBalance,
                    nextLongBalance,
                    leverage,
                } = pool;

                const {
                    pendingLong: { burn: pendingLongBurn },
                    pendingShort: { burn: pendingShortBurn },
                } = pool.committer;

                const leverageBN = new BigNumber(leverage);
                rows.push({
                    address: pool.address,
                    name: pool.name,
                    leverage: pool.leverage,
                    decimals: pool.quoteToken.decimals,
                    skew: calcSkew(pool.shortBalance, pool.longBalance).toNumber(),
                    shortToken: {
                        address: shortToken.address,
                        symbol: shortToken.symbol,
                        effectiveGain: calcEffectiveLongGain(shortBalance, longBalance, leverageBN).toNumber(),
                        lastTCRPrice: calcTokenPrice(shortBalance, shortToken.supply.plus(pendingShortBurn)).toNumber(),
                        nextTCRPrice: calcTokenPrice(
                            nextShortBalance,
                            shortToken.supply.plus(pendingShortBurn),
                        ).toNumber(),
                        balancerPrice: calcTokenPrice(
                            shortBalance,
                            shortToken.supply.plus(pendingShortBurn),
                        ).toNumber(),
                        tvl: pool.longBalance.toNumber(),
                        nextTvl: nextLongBalance.toNumber(),
                    },
                    longToken: {
                        address: longToken.address,
                        symbol: longToken.symbol,
                        effectiveGain: calcEffectiveShortGain(shortBalance, longBalance, leverageBN).toNumber(),
                        lastTCRPrice: calcTokenPrice(longBalance, longToken.supply.plus(pendingLongBurn)).toNumber(),
                        nextTCRPrice: calcTokenPrice(
                            nextLongBalance,
                            longToken.supply.plus(pendingLongBurn),
                        ).toNumber(),
                        balancerPrice: calcTokenPrice(longBalance, longToken.supply.plus(pendingLongBurn)).toNumber(),
                        tvl: pool.longBalance.toNumber(),
                        nextTvl: nextLongBalance.toNumber(),
                    },
                    nextRebalance: pool.lastUpdate.plus(pool.updateInterval).toNumber(),
                    totalValueLocked: pool.shortBalance.toNumber(),
                    myHoldings: shortToken.balance.toNumber(),
                    frontRunning: pool.frontRunningInterval.toNumber(),
                });
            });
            setRows(rows);
        }
    }, [pools]);
    return rows;
}) as () => BrowseTableRowData[];