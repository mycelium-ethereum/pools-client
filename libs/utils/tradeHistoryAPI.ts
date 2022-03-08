import { ARBITRUM, ARBITRUM_RINKEBY } from '@libs/constants';
import BigNumber from 'bignumber.js';

// Base API URL
const BASE_TRADE_HISTORY_API = process.env.NEXT_PUBLIC_TRADE_HISTORY_API;

type NetworkType = typeof ARBITRUM_RINKEBY | typeof ARBITRUM;

export const V2_API_COMMIT_TYPES = {
    LONG_MINT: 'LongMint',
    LONG_BURN: 'LongBurn',
    SHORT_MINT: 'ShortMint',
    SHORT_BURN: 'ShortBurn',
    LONG_BURN_SHORT_MINT: 'LongBurnShortMint',
    SHORT_BURN_LONG_MINT: 'ShortBurnLongMint',
} as const;

type V2_API_COMMIT_TYPE = typeof V2_API_COMMIT_TYPES[keyof typeof V2_API_COMMIT_TYPES];

// Raw API return types
type Result = {
    date: number;
    type: V2_API_COMMIT_TYPE;
    tokenDecimals: number;
    tokenInAddress: string;
    tokenInSymbol: string;
    tokenInName: string;
    tokenInAmount: string;
    price: string;
    fee: string;
    tokenOutAddress: string;
    tokenOutSymbol: string;
    tokenOutName: string;
    tokenOutAmount: string;
    transactionHashIn: string;
    transactionHashOut: string;
    priceTokenAddress: string;
    priceTokenName: string;
    priceTokenSymbol: string;
};

// Parsed types
export type TradeHistory = {
    date: number;
    type: V2_API_COMMIT_TYPE;
    tokenDecimals: number;
    tokenInAddress: string;
    tokenInSymbol: string;
    tokenInName: string;
    tokenInAmount: BigNumber;
    price: BigNumber;
    fee: BigNumber;
    tokenOutAddress: string;
    tokenOutSymbol: string;
    tokenOutName: string;
    tokenOutAmount: BigNumber;
    transactionHashIn: string;
    transactionHashOut: string;
    priceTokenAddress: string;
    priceTokenName: string;
    priceTokenSymbol: string;
};

const fetchTradeHistory: (params: {
    network?: NetworkType;
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
    let route = `${BASE_TRADE_HISTORY_API}?page=${page}&pageSize=${pageSize}&network=${
        network ?? ARBITRUM
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
            results.rows.forEach((row: Result) => {
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

export default fetchTradeHistory;
