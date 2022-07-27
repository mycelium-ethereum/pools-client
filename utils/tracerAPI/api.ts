import BigNumber from 'bignumber.js';
import { CommitEnum, KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';
import { CommitTypeFilter } from '~/archetypes/Portfolio/state';
import { CommitTypeMap } from '~/constants/commits';
import { knownNetworkToSubgraphUrl } from '~/constants/networks';
import { PendingCommits, GraphCommit, TradeHistoryResult, TradeHistory } from '~/types/commits';
import { V2_SUPPORTED_NETWORKS } from '~/types/networks';
import {
    PoolCommitStats,
    TradeStatsAPIResponse,
    PoolCommitStatsAPIResponse,
    NextPoolState,
    NextPoolStateAPIResponse,
} from '~/types/pools';
import { pendingCommitsQuery } from './subgraph';
import { formatBN } from '../converters';

// Base API URL
const TRACER_API = process.env.NEXT_PUBLIC_TRACER_API;

export const fetchPendingCommits: (
    network: V2_SUPPORTED_NETWORKS,
    params: {
        pool?: string;
        from?: number;
        to?: number;
        account?: string;
    },
) => Promise<PendingCommits[]> = async (network, { pool, account }) => {
    if (!knownNetworkToSubgraphUrl[network]) {
        return [];
    }

    const tracerCommits = await fetch(knownNetworkToSubgraphUrl[network] as string, {
        method: 'POST',
        body: JSON.stringify({
            query: pendingCommitsQuery({ pool, account }),
        }),
    })
        .then((res) => res.json())
        .then((allCommits) => {
            const parsedCommits: PendingCommits[] = [];
            allCommits.data.commits.forEach((commit: GraphCommit) => {
                parsedCommits.push({
                    amount: commit.amount,
                    commitType: CommitTypeMap[commit.type],
                    from: commit.trader,
                    txnHash: commit.txnHash,
                    timestamp: parseInt(commit.created),
                    pool: commit.pool,
                    commitID: commit.txnHash,
                    updateIntervalId: parseInt(commit.updateIntervalId),
                });
            });

            return parsedCommits;
        })
        .catch((err) => {
            console.error('Failed to fetch commits', err);
            return [];
        });
    return tracerCommits;
};

export const fetchCommitHistory: (params: {
    network?: V2_SUPPORTED_NETWORKS;
    account: string;
    type: CommitTypeFilter;
    page: number;
    pageSize: number;
}) => Promise<{ results: TradeHistory[]; totalRecords: number }> = async ({
    network,
    account,
    type,
    page,
    pageSize,
}) => {
    let route = `${TRACER_API}/poolsv2/tradeHistory?page=${page}&pageSize=${pageSize}&network=${
        network ?? NETWORKS.ARBITRUM
    }&userAddress=${account}`;
    if (type === CommitTypeFilter.Mint) {
        route += '&types=LongMint&types=ShortMint';
    } else if (type === CommitTypeFilter.Burn) {
        route += '&types=LongBurn&types=ShortBurn';
    } else if (type === CommitTypeFilter.Flip) {
        route += '&types=LongBurnShortMint&types=ShortBurnLongMint';
    }
    const fetchedTradeHistory: { results: TradeHistory[]; totalRecords: number } = await fetch(route)
        .then((res) => res.json())
        .then((results) => {
            const parsedResults: TradeHistory[] = [];
            results.rows.forEach((row: TradeHistoryResult) => {
                const date = new Date(row.date * 1000);
                const timeString = new Intl.DateTimeFormat('en-AU', {
                    hour: 'numeric',
                    minute: 'numeric',
                }).format(date);
                const dateString = new Intl.DateTimeFormat('en-AU').format(date);
                const decimals = row.tokenDecimals;
                const commitType = CommitTypeMap[row.type];
                let tokenInIsLong, tokenOutIsLong;
                if (commitType === CommitEnum.longMint) {
                    tokenOutIsLong = true;
                } else if (commitType === CommitEnum.shortMint) {
                    tokenOutIsLong = false;
                } else if (commitType === CommitEnum.longBurn) {
                    tokenInIsLong = true;
                } else if (commitType === CommitEnum.shortBurn) {
                    tokenInIsLong = false;
                } else if (commitType === CommitEnum.shortBurnLongMint) {
                    tokenInIsLong = false;
                    tokenOutIsLong = true;
                } else if (commitType === CommitEnum.longBurnShortMint) {
                    tokenInIsLong = true;
                    tokenOutIsLong = false;
                }
                parsedResults.push({
                    timestamp: row.date,
                    dateString,
                    timeString,
                    commitType,
                    fee: formatBN(new BigNumber(row.fee), 18), // fees is always in WAD (18 decimal places)
                    mintingFee: formatBN(new BigNumber(row.mintingFee), 18),
                    burningFee: formatBN(new BigNumber(row.burningFee), 18),
                    txnHashIn: row.transactionHashIn,
                    txnHashOut: row.transactionHashOut,
                    settlementToken: {
                        address: row.priceTokenAddress,
                        name: row.priceTokenName,
                        symbol: row.priceTokenSymbol,
                        decimals: row.tokenDecimals,
                    },
                    tokenIn: {
                        address: row.tokenInAddress,
                        name: row.tokenInName,
                        symbol: row.tokenInSymbol,
                        amount: formatBN(new BigNumber(row.tokenInAmount), decimals),
                        price: formatBN(new BigNumber(row.priceIn), decimals),
                        isLong: tokenInIsLong,
                    },
                    tokenOut: {
                        address: row.tokenOutAddress,
                        name: row.tokenOutName,
                        symbol: row.tokenOutSymbol,
                        amount: formatBN(new BigNumber(row.tokenOutAmount), decimals),
                        price: formatBN(new BigNumber(row.priceOut), decimals),
                        isLong: tokenOutIsLong,
                    },
                });
            });
            return {
                results: parsedResults,
                totalRecords: results.totalRecords,
            };
        })
        .catch((err) => {
            console.error('Failed to fetch trade history', err);
            return {
                results: [],
                totalRecords: 0,
            };
        });
    return fetchedTradeHistory;
};

export const fetchTradeStats: (params: {
    network: KnownNetwork;
    pool: string;
    account: string;
}) => Promise<TradeStatsAPIResponse> = async ({ network, pool, account }) => {
    const route = `${TRACER_API}/poolsv2/tradeStats?network=${
        network ?? NETWORKS.ARBITRUM
    }&userAddress=${account}&poolAddress=${pool}`;

    const fetchedTradeStats: TradeStatsAPIResponse = await fetch(route)
        .then((res) => res.json())
        .then((tradeStats) => {
            return tradeStats;
        })
        .catch((err) => {
            console.error('Failed to fetch average entry prices', err);
            return {
                avgLongEntryPriceWallet: '0',
                avgShortEntryPriceWallet: '0',
                avgLongEntryPriceAggregate: '0',
                avgShortEntryPriceAggregate: '0',
                avgLongExitPriceWallet: '0',
                avgShortExitPriceWallet: '0',
                avgLongExitPriceAggregate: '0',
                avgShortExitPriceAggregate: '0',
                totalLongTokensMinted: '0',
                totalLongMintSpend: '0',
                totalShortTokensMinted: '0',
                totalShortMintSpend: '0',
                totalLongTokensBurned: '0',
                totalLongBurnReceived: '0',
                totalShortTokensBurned: '0',
                totalShortBurnReceived: '0',
                totalLongBurns: 0,
                totalLongMints: 0,
                totalShortBurns: 0,
                totalShortMints: 0,
            };
        });
    return fetchedTradeStats;
};

export const fetchNextPoolState: (params: { network: KnownNetwork; pool: string }) => Promise<NextPoolState> = async ({
    network,
    pool,
}) => {
    const route = `${TRACER_API}/poolsv2/nextPoolState?network=${network ?? NETWORKS.ARBITRUM}&poolAddress=${pool}`;

    const fetchedNextPoolState: NextPoolState = await fetch(route)
        .then((res) => {
            if (!res.ok) {
                throw new Error('Error fetching next pool state');
            }
            return res.json();
        })
        .then((nextPoolState: NextPoolStateAPIResponse) => {
            return {
                currentSkew: new BigNumber(nextPoolState.currentSkew),
                currentLongBalance: new BigNumber(nextPoolState.currentLongBalance),
                currentLongSupply: new BigNumber(nextPoolState.currentLongSupply),
                currentShortBalance: new BigNumber(nextPoolState.currentShortBalance),
                currentShortSupply: new BigNumber(nextPoolState.currentShortSupply),
                currentLongTokenPrice: new BigNumber(nextPoolState.currentLongTokenPrice),
                currentShortTokenPrice: new BigNumber(nextPoolState.currentShortTokenPrice),
                currentPendingLongTokenBurn: new BigNumber(nextPoolState.currentPendingLongTokenBurn),
                currentPendingShortTokenBurn: new BigNumber(nextPoolState.currentPendingShortTokenBurn),
                expectedSkew: new BigNumber(nextPoolState.expectedSkew),
                expectedLongBalance: new BigNumber(nextPoolState.expectedLongBalance),
                expectedLongSupply: new BigNumber(nextPoolState.expectedLongSupply),
                expectedShortBalance: new BigNumber(nextPoolState.expectedShortBalance),
                expectedShortSupply: new BigNumber(nextPoolState.expectedShortSupply),
                expectedLongTokenPrice: new BigNumber(nextPoolState.expectedLongTokenPrice),
                expectedShortTokenPrice: new BigNumber(nextPoolState.expectedShortTokenPrice),
                expectedPendingLongTokenBurn: new BigNumber(nextPoolState.expectedPendingLongTokenBurn),
                expectedPendingShortTokenBurn: new BigNumber(nextPoolState.expectedPendingShortTokenBurn),
                totalNetPendingLong: new BigNumber(nextPoolState.totalNetPendingLong),
                totalNetPendingShort: new BigNumber(nextPoolState.totalNetPendingShort),
                lastOraclePrice: new BigNumber(nextPoolState.lastOraclePrice),
                expectedOraclePrice: new BigNumber(nextPoolState.expectedOraclePrice),
                expectedFrontRunningSkew: new BigNumber(nextPoolState.expectedFrontRunningSkew),
                expectedFrontRunningLongBalance: new BigNumber(nextPoolState.expectedFrontRunningLongBalance),
                expectedFrontRunningLongSupply: new BigNumber(nextPoolState.expectedFrontRunningLongSupply),
                expectedFrontRunningShortBalance: new BigNumber(nextPoolState.expectedFrontRunningShortBalance),
                expectedFrontRunningShortSupply: new BigNumber(nextPoolState.expectedFrontRunningShortSupply),
                totalNetFrontRunningPendingLong: new BigNumber(nextPoolState.totalNetFrontRunningPendingLong),
                totalNetFrontRunningPendingShort: new BigNumber(nextPoolState.totalNetFrontRunningPendingShort),
                expectedFrontRunningLongTokenPrice: new BigNumber(nextPoolState.expectedFrontRunningLongTokenPrice),
                expectedFrontRunningShortTokenPrice: new BigNumber(nextPoolState.expectedFrontRunningShortTokenPrice),
                expectedFrontRunningPendingLongTokenBurn: new BigNumber(
                    nextPoolState.expectedFrontRunningPendingLongTokenBurn,
                ),
                expectedFrontRunningPendingShortTokenBurn: new BigNumber(
                    nextPoolState.expectedFrontRunningPendingShortTokenBurn,
                ),
                expectedFrontRunningOraclePrice: new BigNumber(nextPoolState.expectedFrontRunningOraclePrice),
            };
        });
    return fetchedNextPoolState;
};

const TWENTY_FOUR_HOURS_IN_SECONDS = 24 * 60 * 60;
export const fetchPoolCommitStats: (
    network: KnownNetwork,
    pool: string,
    decimals: number,
) => Promise<PoolCommitStats> = async (network, pool) => {
    const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - TWENTY_FOUR_HOURS_IN_SECONDS;
    const route = `${TRACER_API}/poolsv2/stats/commits?network=${
        network ?? NETWORKS.ARBITRUM
    }&poolAddress=${pool}&from=${twentyFourHoursAgo}`;
    const fetchedPoolCommitStats: PoolCommitStats = await fetch(route)
        .then((res) => res.json())
        .then((commitStats: PoolCommitStatsAPIResponse) => {
            return {
                oneDayVolume: new BigNumber(commitStats.totalVolumeUSD),
            };
        })
        .catch((err) => {
            console.error('Failed to fetch pool commit stats', err);
            return {
                oneDayVolume: new BigNumber(0),
            };
        });
    return fetchedPoolCommitStats;
};
