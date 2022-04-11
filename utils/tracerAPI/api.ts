import BigNumber from 'bignumber.js';
import { CommitEnum, NETWORKS } from '@tracer-protocol/pools-js';
import { CommitTypeMap } from '~/constants/commits';
import { PendingCommits, GraphCommit, TradeHistoryResult, TradeHistory } from '~/types/commits';
import { V2_SUPPORTED_NETWORKS } from '~/types/networks';
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
    type: 'mint' | 'burn' | 'flip';
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
    if (type === 'mint') {
        route += '&types=LongMint&types=ShortMint';
    } else if (type === 'burn') {
        route += '&types=LongBurn&types=ShortBurn';
    } else {
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
                parsedResults.push({
                    timestamp: row.date,
                    dateString,
                    timeString,
                    commitType,
                    inTokenPrice: formatBN(new BigNumber(row.price), decimals),
                    fee: formatBN(new BigNumber(row.fee), decimals),
                    txnHashIn: row.transactionHashIn,
                    txnHashOut: row.transactionHashOut,
                    isLong: commitType === CommitEnum.longMint || commitType === CommitEnum.longBurn,
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
                    },
                    tokenOut: {
                        address: row.tokenOutAddress,
                        name: row.tokenOutName,
                        symbol: row.tokenOutSymbol,
                        amount: formatBN(new BigNumber(row.tokenOutAmount), decimals),
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
