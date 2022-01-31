import { useState, useEffect, useMemo } from 'react';
import { BrowseTableRowData } from '@archetypes/Pools/state';
import { usePools } from '@context/PoolContext';
import { calcEffectiveLongGain, calcEffectiveShortGain, calcSkew } from '@tracer-protocol/pools-js';
import { BigNumber } from 'bignumber.js';
import useBalancerSpotPrices from '../useBalancerSpotPrices';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { useUpkeeps } from '../useUpkeeps';
import { tickerToName } from '@libs/utils/converters';

const STATIC_DEFAULT_UPKEEP = {
    pool: '',
    lastUpdate: 0,
    tvl: 0,
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
            poolValues.forEach((pool_) => {
                const { poolInstance: pool, userBalances } = pool_;
                const {
                    address,
                    lastUpdate,
                    longToken,
                    shortToken,
                    shortBalance,
                    longBalance,
                    leverage,
                    name,
                    quoteToken,
                    updateInterval,
                    frontRunningInterval,
                    keeper,
                    committer,
                } = pool;

                const leverageBN = new BigNumber(leverage);

                const {
                    expectedLongBalance,
                    expectedShortBalance,
                    newLongTokenPrice,
                    newShortTokenPrice,
                    expectedSkew,
                } = pool.getNextPoolState();

                const tvl = shortBalance.plus(longBalance).toNumber();

                const defaultUpkeep = {
                    ...STATIC_DEFAULT_UPKEEP,
                    pool: address,
                    timestamp: lastUpdate.toNumber(),
                    tvl: tvl,
                };

                rows.push({
                    address: address,
                    name: name,
                    market: tickerToName(name),
                    leverage: leverage,
                    decimals: quoteToken.decimals,
                    quoteTokenSymbol: quoteToken.symbol,

                    lastPrice: pool.lastPrice.toNumber(),
                    oraclePrice: pool.oraclePrice.toNumber(),

                    skew: calcSkew(shortBalance, longBalance).toNumber(),
                    nextSkew: expectedSkew.toNumber(),

                    tvl: tvl,
                    nextTVL: expectedLongBalance.plus(expectedShortBalance).toNumber(),

                    shortToken: {
                        address: shortToken.address,
                        symbol: shortToken.symbol,
                        effectiveGain: calcEffectiveShortGain(shortBalance, longBalance, leverageBN).toNumber(),
                        lastTCRPrice: pool.getShortTokenPrice().toNumber(),
                        nextTCRPrice: newShortTokenPrice.toNumber(),
                        tvl: shortBalance.toNumber(),
                        nextTvl: expectedShortBalance.toNumber(),
                        balancerPrice: balancerPoolPrices[shortToken.symbol]?.toNumber() ?? 0,
                        userHoldings: userBalances.shortToken.balance.toNumber(),
                    },
                    longToken: {
                        address: longToken.address,
                        symbol: longToken.symbol,
                        effectiveGain: calcEffectiveLongGain(shortBalance, longBalance, leverageBN).toNumber(),
                        lastTCRPrice: pool.getLongTokenPrice().toNumber(),
                        nextTCRPrice: newLongTokenPrice.toNumber(),
                        tvl: longBalance.toNumber(),
                        nextTvl: expectedLongBalance.toNumber(),
                        balancerPrice: balancerPoolPrices[longToken.symbol]?.toNumber() ?? 0,
                        userHoldings: userBalances.longToken.balance.toNumber(),
                    },
                    nextRebalance: lastUpdate.plus(updateInterval).toNumber(),
                    myHoldings: userBalances.shortToken.balance.plus(userBalances.longToken.balance).toNumber(),
                    frontRunning: frontRunningInterval.toNumber(),
                    pastUpkeep: defaultUpkeep,
                    antecedentUpkeep: defaultUpkeep,

                    keeper: keeper,
                    committer: committer.address,
                    collateralAsset: quoteToken.symbol,
                    collateralAssetAddress: quoteToken.address,
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
                        const defualtUpkeep = {
                            ...STATIC_DEFAULT_UPKEEP,
                            pool,
                        };

                        const pastUpkeep = upkeeps[pool][0] ?? defualtUpkeep;
                        const antecedentUpkeep = upkeeps[pool][1] ?? pastUpkeep;

                        return {
                            ...row,
                            pastUpkeep: pastUpkeep,
                            antecedentUpkeep: antecedentUpkeep,
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
