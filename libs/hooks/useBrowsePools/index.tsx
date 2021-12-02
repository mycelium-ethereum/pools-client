import { useState, useEffect } from 'react';
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

// const useBrowsePools
export default (() => {
    const { network } = useWeb3();
    const { pools } = usePools();
    const [rows, setRows] = useState<BrowseTableRowData[]>([]);
    const balancerPoolPrices = useBalancerSpotPrices(network);

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

                    shortToken: {
                        address: shortToken.address,
                        symbol: shortToken.symbol,
                        effectiveGain: calcEffectiveShortGain(shortBalance, longBalance, leverageBN).toNumber(),
                        lastTCRPrice: calcTokenPrice(shortBalance, shortToken.supply.plus(pendingShortBurn)).toNumber(),
                        nextTCRPrice: nextShortTokenPrice.toNumber(),
                        tvl: shortBalance.toNumber(),
                        nextTvl: nextShortBalance.toNumber(),
                        balancerPrice: balancerPoolPrices[shortToken.symbol]?.toNumber() ?? 0,
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
                    },
                    nextRebalance: lastUpdate.plus(updateInterval).toNumber(),
                    myHoldings: shortToken.balance.plus(longToken.balance).toNumber(),
                    frontRunning: frontRunningInterval.toNumber(),
                });
            });
            setRows(rows);
        }
    }, [pools]);

    useEffect(() => {
        console.log(balancerPoolPrices, 'Changed');
        setRows((rows) =>
            rows.map((row) => ({
                ...row,
                longToken: {
                    ...row.longToken,
                    balancerPrice: balancerPoolPrices[row.longToken.symbol]?.toNumber() ?? 0,
                },
                shortToken: {
                    ...row.shortToken,
                    balancerPrice: balancerPoolPrices[row.longToken.symbol]?.toNumber() ?? 0,
                },
            })),
        );
    }, [balancerPoolPrices]);

    return rows;
}) as () => BrowseTableRowData[];
