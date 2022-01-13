import { ARBITRUM, ARBITRUM_RINKEBY } from '@libs/constants';
import BigNumber from 'bignumber.js';

// Base API URL
const BASE_TRADE_HISTORY_API = process.env.NEXT_PUBLIC_TRADE_HISTORY_API;

type NetworkType = typeof ARBITRUM_RINKEBY | typeof ARBITRUM;

type CommitType = 'LongBurn' | 'LongMint' | 'ShortMint' | 'ShortBurn';

// Raw API return types
type Result = {
    collateralAmount: string;
    date: number;
    tokenAddress: string;
    tokenAmount: string;
    tokenName: string;
    tokenPrice: string;
    tokenSymbol: string;
    type: CommitType;
    userAddress: string;
    tokenDecimals: number;
};

// Parsed types
export type TradeHistory = {
    date: number;
    type: CommitType;
    tokenName: string;
    collateralAmount: BigNumber;
    tokenAmount: BigNumber;
    tokenPrice: BigNumber;
    tokenSymbol: string;
    tokenAddress: string;
    tokenDecimals: number;
};

const fetchTradeHistory: (params: {
    network?: NetworkType;
    account: string;
    type: 'mint' | 'burn';
    page: number;
    pageSize: number;
}) => Promise<{ results: TradeHistory[]; totalRecords: number }> = async ({
    network,
    account,
    type,
    page,
    pageSize,
}) => {
    let route = `${BASE_TRADE_HISTORY_API}?page=${page}&pageSize=${pageSize}&network=${
        network ?? ARBITRUM
    }&userAddress=${account}`;
    // }&userAddress=0xFBA206E73709F614E5a85afF27A98692d4F3c579`;
    if (type === 'burn') {
        route += '&types=LongBurn&types=ShortBurn';
    } else {
        route += '&types=LongMint&types=ShortMint';
    }
    const fetchedTradeHistory: { results: TradeHistory[]; totalRecords: number } = await fetch(route)
        .then((res) => res.json())
        .then((results) => {
            const parsedResults: TradeHistory[] = [];
            results.rows.forEach((row: Result) => {
                // Parse the raw results to the types you want,
                // which you can adjust in the TradeHistory type
                parsedResults.push({
                    date: row.date,
                    type: row.type,
                    tokenName: row.tokenName,
                    collateralAmount: new BigNumber(row.collateralAmount),
                    tokenAmount: new BigNumber(row.tokenAmount),
                    tokenPrice: new BigNumber(row.tokenPrice),
                    tokenSymbol: row.tokenSymbol,
                    tokenAddress: row.tokenAddress,
                    tokenDecimals: row.tokenDecimals,
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

export default fetchTradeHistory;
