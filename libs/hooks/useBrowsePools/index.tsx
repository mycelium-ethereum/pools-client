import { useState, useEffect, useMemo } from 'react';
import { BrowseTableRowData } from '@archetypes/Pools/state';
import { usePools } from '@context/PoolContext';
import {
    calcEffectiveLongGain,
    calcEffectiveShortGain,
    calcSkew,
    calcTokenPrice,
} from '@tracer-protocol/tracer-pools-utils';
import { BigNumber } from 'bignumber.js';
import useBalancerSpotPrices from '../useBalancerSpotPrices';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { useUpkeeps } from '../useUpkeeps';
import { tickerToName } from '@libs/utils/converters';

// const useBrowsePools
export default (() => {
    const { network } = useWeb3();
    const { pools } = usePools();
    const [rows, setRows] = useState<BrowseTableRowData[]>([]);
    const balancerPoolPrices = useBalancerSpotPrices(network);
    const upkeeps = useUpkeeps(network);

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

                const tvl = shortBalance.plus(longBalance).toNumber();

                const defaultUpkeep = {
                    pool: address,
                    timestamp: lastUpdate.toNumber(),
                    tvl: tvl,
                    newPrice: 0,
                    oldPrice: 0,
                    longTokenBalance: 0,
                    shortTokenBalance: 0,
                    longTokenSupply: 0,
                    shortTokenSupply: 0,
                    longTokenPrice: 0,
                    shortTokenPrice: 0,
                    skew: 1,
                };

                rows.push({
                    address: address,
                    name: name,
                    market: tickerToName(name),
                    leverage: leverage,
                    decimals: quoteToken.decimals,

                    lastPrice: pool.lastPrice.toNumber(),
                    oraclePrice: pool.oraclePrice.toNumber(),

                    skew: calcSkew(shortBalance, longBalance).toNumber(),
                    nextSkew: calcSkew(nextShortBalance, nextLongBalance).toNumber(),

                    tvl: tvl,
                    nextTVL: nextLongBalance.plus(nextShortBalance).toNumber(),

                    shortToken: {
                        address: shortToken.address,
                        symbol: shortToken.symbol,
                        effectiveGain: calcEffectiveShortGain(shortBalance, longBalance, leverageBN).toNumber(),
                        lastTCRPrice: calcTokenPrice(shortBalance, shortToken.supply.plus(pendingShortBurn)).toNumber(),
                        nextTCRPrice: nextShortTokenPrice.toNumber(),
                        tvl: shortBalance.toNumber(),
                        nextTvl: nextShortBalance.toNumber(),
                        balancerPrice: balancerPoolPrices[shortToken.symbol]?.toNumber() ?? 0,
                        userHoldings: pool.shortToken.balance.toNumber(),
                    },
                    longToken: {
                        address: longToken.address,
                        symbol: longToken.symbol,
                        effectiveGain: calcEffectiveLongGain(shortBalance, longBalance, leverageBN).toNumber(),
                        lastTCRPrice: calcTokenPrice(longBalance, longToken.supply.plus(pendingLongBurn)).toNumber(),
                        nextTCRPrice: nextLongTokenPrice.toNumber(),
                        tvl: longBalance.toNumber(),
                        nextTvl: nextLongBalance.toNumber(),
                        balancerPrice: balancerPoolPrices[longToken.symbol]?.toNumber() ?? 0,
                        userHoldings: pool.longToken.balance.toNumber(),
                    },
                    nextRebalance: lastUpdate.plus(updateInterval).toNumber(),
                    myHoldings: shortToken.balance.plus(longToken.balance).toNumber(),
                    frontRunning: frontRunningInterval.toNumber(),
                    pastUpkeep: defaultUpkeep,
                    antecedentUpkeep: defaultUpkeep,
                });
            });

            setRows(rows);
        }
    }, [pools]);

    const attachedBalancerPrices: BrowseTableRowData[] = useMemo(() => {
        return rows.map((row) => ({
            ...row,
            longToken: {
                ...row.longToken,
                balancerPrice: balancerPoolPrices[row.longToken.symbol]?.toNumber() ?? 0,
            },
            shortToken: {
                ...row.shortToken,
                balancerPrice: balancerPoolPrices[row.shortToken.symbol]?.toNumber() ?? 0,
            },
        }));
    }, [rows, balancerPoolPrices]);

    const finalRows: BrowseTableRowData[] = useMemo(
        () =>
            attachedBalancerPrices.map((row) => {
                for (const pool of Object.keys(upkeeps)) {
                    if (pool === row.address) {
                        return {
                            ...row,
                            pastUpkeep: upkeeps[pool][0],
                            antecedentUpkeep: upkeeps[pool][1],
                        };
                    }
                }
                // else
                return row;
            }),
        [attachedBalancerPrices, upkeeps],
    );

    return {
        rows: finalRows,
    };
}) as () => {
    rows: BrowseTableRowData[];
};
