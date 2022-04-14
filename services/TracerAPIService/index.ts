import BigNumber from 'bignumber.js';
import { CommitEnum, NETWORKS } from '@tracer-protocol/pools-js';
import { CommitTypeMap } from '~/constants/commits';
import { useStore } from '~/store/main';
import { PendingCommits, GraphCommit, TradeHistoryResult, TradeHistory } from '~/types/commits';
import { AverageEntryPricesAPIResponse } from '~/types/pools';
import { formatBN } from '~/utils/converters';
import { pendingCommitsQuery, subgraphUrlByNetwork } from './subgraph';

// Base API URL
const TRACER_API = process.env.NEXT_PUBLIC_TRACER_API;
const V2_GRAPH_URI_TESTNET = subgraphUrlByNetwork['421611'];

class TracerAPIService {
    async fetchPendingCommits({
        pool,
        account,
    }: {
        pool?: string;
        from?: number;
        to?: number;
        account?: string;
    }): Promise<PendingCommits[]> {
        // TODO uncomment when swapping back to api
        // const pendingCommits =
        // `${TRACER_API}/poolsv2/pendingCommits?network=${this.network}` +
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
    }

    async fetchCommitHistory({
        account,
        type,
        page,
        pageSize,
    }: {
        account: string;
        type: 'mint' | 'burn' | 'flip';
        page: number;
        pageSize: number;
    }): Promise<{ results: TradeHistory[]; totalRecords: number }> {
        const network = useStore.getState().web3Slice.network;
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
                            price: formatBN(new BigNumber(row.priceIn), decimals),
                        },
                        tokenOut: {
                            address: row.tokenOutAddress,
                            name: row.tokenOutName,
                            symbol: row.tokenOutSymbol,
                            amount: formatBN(new BigNumber(row.tokenOutAmount), decimals),
                            price: formatBN(new BigNumber(row.priceOut), decimals),
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
    }

    async fetchAverageEntryPrices(pool: string, account: string): Promise<AverageEntryPricesAPIResponse> {
        const network = useStore.getState().web3Slice.network;
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
    }
}

export const tracerAPIService = new TracerAPIService();
