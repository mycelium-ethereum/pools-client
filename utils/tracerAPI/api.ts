import BigNumber from 'bignumber.js';
import { NETWORKS } from '@tracer-protocol/pools-js';
import { CommitTypeMap } from '~/constants/commits';
import { pendingCommitsQuery, subgraphUrlByNetwork } from './subgraph';
import { TradeHistoryResult, PendingCommits, TradeHistory, V2_SUPPORTED_NETWORKS, GraphCommit } from './types';

// Base API URL
const TRACER_API = process.env.NEXT_PUBLIC_TRACER_API;
const V2_GRAPH_URI_TESTNET = subgraphUrlByNetwork['421611']

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
                // Parse the raw results to the types you want,
                // which you can adjust in the TradeHistory type
                parsedResults.push({
                    date: row.date,
                    type: row.type,
                    tokenDecimals: row.tokenDecimals,
                    tokenInAddress: row.tokenInAddress,
                    tokenInSymbol: row.tokenInSymbol,
                    tokenInName: row.tokenInName,
                    tokenInAmount: new BigNumber(row.tokenInAmount),
                    price: new BigNumber(row.price),
                    fee: new BigNumber(row.fee),
                    tokenOutAddress: row.tokenOutAddress,
                    tokenOutSymbol: row.tokenOutSymbol,
                    tokenOutName: row.tokenOutName,
                    tokenOutAmount: new BigNumber(row.tokenOutAmount),
                    transactionHashIn: row.transactionHashIn,
                    transactionHashOut: row.transactionHashOut,
                    priceTokenAddress: row.priceTokenAddress,
                    priceTokenName: row.priceTokenName,
                    priceTokenSymbol: row.priceTokenSymbol,
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
