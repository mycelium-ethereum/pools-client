import { ARBITRUM, ARBITRUM_RINKEBY, CommitEnum, CommitTypeMap } from '@libs/constants';
import BigNumber from 'bignumber.js';

// Base API URL
const BASE_TRADE_HISTORY_API = process.env.NEXT_PUBLIC_TRADE_HISTORY_API;

type NetworkType = typeof ARBITRUM_RINKEBY | typeof ARBITRUM;

// Raw API return types
type Result = {
    collateralAmount: string;
    date: number;
    tokenAddress: string;
    tokenAmount: string;
    tokenName: string;
    tokenPrice: string;
    tokenSymbol: string;
    type: 'LongBurn' | 'LongMint' | 'ShortMint' | 'ShortBurn';
    userAddress: string;
};

// Parsed types
export type TradeHistory = {
    date: number;
    type: CommitEnum;
    tokenName: string;
    collateralAmount: BigNumber;
    tokenAmount: BigNumber;
    tokenPrice: BigNumber;
    tokenSymbol: string;
};

const fetchTradeHistory: (params: { network?: NetworkType; account: string }) => Promise<TradeHistory[]> = async ({
    network,
    account,
}) => {
    const route = `${BASE_TRADE_HISTORY_API}?network=${network ?? ARBITRUM}&userAddress=${account}`;
    const fetchedTradeHistory: TradeHistory[] = await fetch(route)
        .then((res) => res.json())
        .then((results) => {
            const parsedResults: TradeHistory[] = [];
            results.rows.forEach((row: Result) => {
                // Parse the raw results to the types you want,
                // which you can adjust in the TradeHistory type
                parsedResults.push({
                    date: row.date,
                    type: CommitTypeMap[row.type],
                    tokenName: row.tokenName,
                    collateralAmount: new BigNumber(row.collateralAmount),
                    tokenAmount: new BigNumber(row.tokenAmount),
                    tokenPrice: new BigNumber(row.tokenPrice),
                    tokenSymbol: row.tokenSymbol,
                });
            });
            return parsedResults;
        })
        .catch((err) => {
            console.error('Failed to fetch trade history', err);
            return [];
        });
    return fetchedTradeHistory;
};

export default fetchTradeHistory;
