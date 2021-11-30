import { useState, useEffect } from 'react';
import { BrowseTableRowData } from '@archetypes/Browse/state';
import { usePools } from '@context/PoolContext';
import {
    calcEffectiveLongGain,
    calcEffectiveShortGain,
    calcRebalanceRate,
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
                    name,
                    address,
                    longToken,
                    shortToken,
                    quoteToken,
                    shortBalance,
                    longBalance,
                    nextShortBalance: shortBalanceAfterTransfer,
                    nextLongBalance: longBalanceAfterTransfer,
                    leverage,
                    lastUpdate,
                    frontRunningInterval,
                    updateInterval,
                } = pool;

                const {
                    pendingLong: { burn: pendingLongBurn, mint: pendingLongMint },
                    pendingShort: { burn: pendingShortBurn, mint: pendingShortMint },
                } = pool.committer;

                const leverageBN = new BigNumber(leverage);

                const nextLongTokenPrice = calcTokenPrice(
                    longBalanceAfterTransfer,
                    longToken.supply.plus(pendingLongBurn),
                );
                const nextShortTokenPrice = calcTokenPrice(
                    shortBalanceAfterTransfer,
                    shortToken.supply.plus(pendingShortBurn),
                );

                const nextLongBalance = longBalanceAfterTransfer
                    .plus(pendingLongMint)
                    .minus(nextLongTokenPrice.times(pendingLongBurn));
                const nextShortBalance = shortBalanceAfterTransfer
                    .plus(pendingShortMint)
                    .minus(nextShortTokenPrice.times(pendingShortBurn));

                rows.push({
                    address: address,
                    name: name,
                    leverage: leverage,
                    decimals: quoteToken.decimals,

                    skew: calcSkew(shortBalance, longBalance).toNumber(),
                    nextSkew: calcSkew(nextShortBalance, nextLongBalance).toNumber(),

                    tvl: shortBalance.plus(longBalance).toNumber(),
                    nextTVL: nextLongBalance.plus(nextShortBalance).toNumber(),

                    rebalanceRate: calcRebalanceRate(shortBalance, longBalance).toNumber(),
                    nextRebalanceRate: calcRebalanceRate(nextShortBalance, nextLongBalance).toNumber(),

                    shortToken: {
                        address: shortToken.address,
                        symbol: shortToken.symbol,
                        effectiveGain: calcEffectiveLongGain(shortBalance, longBalance, leverageBN).toNumber(),
                        lastTCRPrice: calcTokenPrice(shortBalance, shortToken.supply.plus(pendingShortBurn)).toNumber(),
                        nextTCRPrice: nextShortTokenPrice.toNumber(),
                        balancerPrice: calcTokenPrice(
                            shortBalance,
                            shortToken.supply.plus(pendingShortBurn),
                        ).toNumber(),
                        tvl: shortBalance.toNumber(),
                        nextTvl: nextShortBalance.toNumber(),
                    },
                    longToken: {
                        address: longToken.address,
                        symbol: longToken.symbol,
                        effectiveGain: calcEffectiveShortGain(shortBalance, longBalance, leverageBN).toNumber(),
                        lastTCRPrice: calcTokenPrice(longBalance, longToken.supply.plus(pendingLongBurn)).toNumber(),
                        nextTCRPrice: nextLongTokenPrice.toNumber(),
                        balancerPrice: calcTokenPrice(longBalance, longToken.supply.plus(pendingLongBurn)).toNumber(),
                        tvl: longBalance.toNumber(),
                        nextTvl: nextLongBalance.toNumber(),
                    },
                    nextRebalance: lastUpdate.plus(updateInterval).toNumber(),
                    myHoldings: shortToken.balance.toNumber(),
                    frontRunning: frontRunningInterval.toNumber(),
                });
            });
            setRows(rows);
        }
    }, [pools]);
    return rows;
}) as () => BrowseTableRowData[];
