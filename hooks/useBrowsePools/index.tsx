import { useState, useEffect, useMemo } from 'react';
import { BigNumber } from 'bignumber.js';
import { calcEffectiveLongGain, calcEffectiveShortGain, calcSkew } from '@tracer-protocol/pools-js';
import { BrowseTableRowData } from '~/archetypes/Pools/state';
import { usePools } from '~/hooks/usePools';
import { useStore } from '~/store/main';
import { selectNetwork } from '~/store/Web3Slice';
import { LoadingRows } from '~/types/hooks';
import { formatBN } from '~/utils/converters';
import { getMarketSymbol } from '~/utils/poolNames';
import { useUpkeeps } from '../useUpkeeps';

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
export const useBrowsePools = (): LoadingRows<BrowseTableRowData> => {
    const network = useStore(selectNetwork);
    const { pools, isLoadingPools } = usePools();
    const [rows, setRows] = useState<BrowseTableRowData[]>([]);
    const upkeeps = useUpkeeps(network);

    useEffect(() => {
        if (pools) {
            const poolValues = Object.values(pools);
            const rows: BrowseTableRowData[] = [];
            poolValues.forEach((pool_) => {
                const {
                    poolInstance: pool,
                    oracleDetails,
                    poolStatus,
                    userBalances,
                    upkeepInfo,
                    poolCommitStats,
                    balancerPrices,
                    nextPoolState,
                } = pool_;
                const {
                    address,
                    lastUpdate,
                    longToken,
                    shortToken,
                    shortBalance,
                    longBalance,
                    leverage,
                    name,
                    settlementToken,
                    keeper,
                    committer,
                } = pool;

                const leverageBN = new BigNumber(leverage);

                const {
                    totalNetFrontRunningPendingShort,
                    expectedFrontRunningShortBalance,
                    totalNetFrontRunningPendingLong,
                    expectedFrontRunningLongBalance,
                    expectedLongBalance,
                    expectedShortBalance,
                    expectedLongTokenPrice,
                    expectedShortTokenPrice,
                    expectedSkew,
                } = nextPoolState;

                // const currentLongPrice = currentLongBalance.div(currentLongSupply.gt(0) ? currentLongSupply : 1);
                // const currentShortPrice = currentShortBalance.div(currentShortSupply.gt(0) ? currentShortSupply : 1);

                console.log('CURRENT LONG PRICE', pool.getLongTokenPrice().toNumber());
                console.log('CURRENT SHORT PRICE', pool.getShortTokenPrice().toNumber());

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
                    marketSymbol: getMarketSymbol(name),
                    leverage: leverage,
                    decimals: settlementToken.decimals,
                    settlementTokenSymbol: settlementToken.symbol,

                    lastPrice: pool.lastPrice.toNumber(),
                    oraclePrice: pool.oraclePrice.toNumber(),

                    skew: calcSkew(shortBalance, longBalance).toNumber(),
                    nextSkew: expectedSkew.toNumber(),
                    // estimatedSkew with all pending commits
                    estimatedSkew: nextPoolState.expectedFrontRunningSkew.toNumber(),

                    tvl: tvl,
                    nextTVL: formatBN(
                        expectedLongBalance.plus(expectedShortBalance),
                        settlementToken.decimals,
                    ).toNumber(),
                    oneDayVolume: poolCommitStats.oneDayVolume,

                    shortToken: {
                        address: shortToken.address,
                        symbol: shortToken.symbol,
                        effectiveGain: calcEffectiveShortGain(shortBalance, longBalance, leverageBN).toNumber(),
                        lastTCRPrice: pool.getShortTokenPrice().toNumber(),
                        nextTCRPrice: expectedShortTokenPrice.toNumber(),
                        tvl: shortBalance.toNumber(),
                        nextTvl: formatBN(expectedShortBalance, settlementToken.decimals).toNumber(),
                        balancerPrice: balancerPrices.shortToken.toNumber(),
                        userHoldings: userBalances.shortToken.balance
                            .plus(userBalances.aggregateBalances.shortTokens)
                            .toNumber(),
                        pendingTvl: formatBN(totalNetFrontRunningPendingShort, settlementToken.decimals).toNumber(),
                        estimatedTvl: formatBN(expectedFrontRunningShortBalance, settlementToken.decimals).toNumber(),
                        poolStatus,
                    },
                    longToken: {
                        address: longToken.address,
                        symbol: longToken.symbol,
                        effectiveGain: calcEffectiveLongGain(shortBalance, longBalance, leverageBN).toNumber(),
                        lastTCRPrice: pool.getLongTokenPrice().toNumber(),
                        nextTCRPrice: expectedLongTokenPrice.toNumber(),
                        tvl: longBalance.toNumber(),
                        nextTvl: formatBN(expectedLongBalance, settlementToken.decimals).toNumber(),
                        balancerPrice: balancerPrices.longToken.toNumber(),
                        userHoldings: userBalances.longToken.balance
                            .plus(userBalances.aggregateBalances.longTokens)
                            .toNumber(),
                        pendingTvl: formatBN(totalNetFrontRunningPendingLong, settlementToken.decimals).toNumber(),
                        estimatedTvl: formatBN(expectedFrontRunningLongBalance, settlementToken.decimals).toNumber(),
                        poolStatus,
                    },
                    isWaitingForUpkeep: upkeepInfo.isWaitingForUpkeep,
                    expectedExecution: upkeepInfo.expectedExecution,
                    myHoldings: userBalances.shortToken.balance.plus(userBalances.longToken.balance).toNumber(),
                    pastUpkeep: defaultUpkeep,
                    antecedentUpkeep: defaultUpkeep,

                    keeper: keeper,
                    committer: committer.address,
                    collateralAsset: settlementToken.symbol,
                    collateralAssetAddress: settlementToken.address,
                    oracleDetails,
                    poolStatus,
                });
            });

            setRows(rows);
        }
    }, [pools]);

    const finalRows: BrowseTableRowData[] = useMemo(
        () =>
            rows.map((row) => {
                for (const pool of Object.keys(upkeeps)) {
                    if (pool === row.address) {
                        const defaultUpkeep = {
                            ...STATIC_DEFAULT_UPKEEP,
                            pool,
                        };

                        const pastUpkeep = upkeeps[pool][0] ?? defaultUpkeep;
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
        [rows, upkeeps],
    );

    return {
        rows: finalRows,
        isLoading: isLoadingPools && rows.length === 0,
    };
};

export default useBrowsePools;
