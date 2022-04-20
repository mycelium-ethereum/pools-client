import BigNumber from 'bignumber.js';
import { CommitEnum, KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';
import { CommitTypeFilter } from '~/archetypes/Portfolio/state';
import { CommitTypeMap } from '~/constants/commits';
import { PendingCommits, GraphCommit, TradeHistoryResult, TradeHistory } from '~/types/commits';
import { V2_SUPPORTED_NETWORKS } from '~/types/networks';
import { AverageEntryPricesAPIResponse } from '~/types/pools';
import { pendingCommitsQuery, subgraphUrlByNetwork } from './subgraph';
import { formatBN } from '../converters';

// Base API URL
const TRACER_API = process.env.NEXT_PUBLIC_TRACER_API;
const V2_GRAPH_URI_TESTNET = subgraphUrlByNetwork['421611'];

export const fetchPendingCommits: (
    network: V2_SUPPORTED_NETWORKS,
    params: {
        pool?: string;
        from?: number;
        to?: number;
        account?: string;
    },
) => Promise<PendingCommits[]> = async (_network, { pool, account }) => {
    // TODO uncomment when swapping back to api
    // const pendingCommits =
    // `${TRACER_API}/poolsv2/pendingCommits?network=${network}` +
    // `${pool ? `&poolAddress=${pool}` : ''}` +
    // `${account ? `&userAddress=${account}` : ''}`;
    // const tracerCommits = await fetch(pendingCommits)
    const tracerCommits = await fetch(V2_GRAPH_URI_TESTNET, {
        method: 'POST',
        body: JSON.stringify({
            query: pendingCommitsQuery({ pool, account }),
        }),
    })
        .then((res) => res.json())
        .then((allCommits) => {
            const parsedCommits: PendingCommits[] = [];
            // allCommits.forEach((commit: PendingCommitsResult) => {
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
                    fee: formatBN(new BigNumber(row.fee), decimals),
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

export const fetchAverageEntryPrices: (params: {
    network: KnownNetwork;
    pool: string;
    account: string;
}) => Promise<AverageEntryPricesAPIResponse> = async ({ network, pool, account }) => {
    const route = `${TRACER_API}/poolsv2/averageEntryPrices?network=${
        network ?? NETWORKS.ARBITRUM
    }&userAddress=${account}&poolAddress=${pool}`;

    const fetchedAverageEntryPrices: AverageEntryPricesAPIResponse = await fetch(route)
        .then((res) => res.json())
        .then((averageEntryPrices) => {
            return averageEntryPrices;
        })
        .catch((err) => {
            console.error('Failed to fetch average entry prices', err);
            return {
                longPriceWallet: '0',
                shortPriceWallet: '0',
                longPriceAggregate: '0',
                shortPriceAggregate: '0',
            };
        });
    return fetchedAverageEntryPrices;
};
