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
import { useUpkeeps } from '../useUpkeeps';
import { AvailableNetwork } from '@context/Web3Context/Web3Context.Config';

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

                rows.push({
                    address: address,
                    name: name,
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
                    pastUpkeep: {
                        pool: address,
                        network: network as AvailableNetwork,
                        timestamp: lastUpdate.toNumber(),
                        tvl: new BigNumber(tvl),
                        newPrice: new BigNumber(0),
                        oldPrice: new BigNumber(0),
                        longTokenBalance: new BigNumber(0),
                        shortTokenBalance: new BigNumber(0),
                        longTokenSupply: new BigNumber(0),
                        shortTokenSupply: new BigNumber(0),
                    },
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

    useEffect(() => {
        console.log(upkeeps, 'Final upkeeps');
        // n^2 way of doing this
        // but rows and upkeeps will only ever
        // be relatively small
        setRows(
            rows.map((row) => {
                const lowerCaseAddress = row.address.toLowerCase();
                for (const upkeep of upkeeps) {
                    if (upkeep.pool.toLowerCase() === lowerCaseAddress) {
                        return {
                            ...row,
                            pastUpkeep: upkeep,
                        };
                    }
                }
                // else
                return row;
            }),
        );
    }, [upkeeps]);

    return rows;
}) as () => BrowseTableRowData[];
