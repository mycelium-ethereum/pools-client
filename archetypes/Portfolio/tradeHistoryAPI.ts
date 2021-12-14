import { CommitEnum } from '@libs/constants';
import BigNumber from 'bignumber.js';

// Base API URL
const BASE_TRADE_HISTORY_API = 'https://api.tracer.finance/pools/tradeHistory';

// Raw API return types
type Result = {
    totalResults: number;
    page: number;
    pageSize: number;
    data: [
        {
            type: CommitEnum;
            source: 'tracer' | 'balancer';
            date: number;
            tokenAddress: string;
            tokenName: string;
            tokenAmount: BigNumber;
            collateralAmount: BigNumber;
            fee: BigNumber;
        },
    ];
};

// Parsed types
type TradeHistory = {
    totalResults: number;
    page: number;
    pageSize: number;
    data: [
        {
            type: CommitEnum;
            source: 'tracer' | 'balancer';
            date: number;
            tokenAddress: string;
            tokenName: string;
            tokenAmount: BigNumber;
            collateralAmount: BigNumber;
            fee: BigNumber;
        },
    ];
};

const fetchTradeHistory: (params: {
    page: number;
    pageSize: number;
    sort: Date;
    sortDirection: 'ASC' | 'DESC';
    network: string;
    poolAddress?: string;
}) => Promise<TradeHistory[]> = async () => {
    // TODO: Update the route to include the params
    const route = `${BASE_TRADE_HISTORY_API}`;
    const commits: TradeHistory[] = await fetch(route)
        .then((res) => res.json())
        .then((results) => {
            const parsedCommits: TradeHistory[] = [];
            results.forEach((result: Result) => {
                // Parse the raw results to the types you want,
                // which you can adjust in the TradeHistory type
                parsedCommits.push({
                    totalResults: result.totalResults,
                    page: result.page,
                    pageSize: result.pageSize,
                    data: result.data,
                });
            });
            return parsedCommits;
        })
        .catch((err) => {
            console.error('Failed to fetch trade history', err);
            return [];
        });
    return commits;
};

export default fetchTradeHistory;
