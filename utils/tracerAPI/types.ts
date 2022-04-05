import BigNumber from 'bignumber.js';
import { CommitEnum, NETWORKS } from '@tracer-protocol/pools-js';

export type V2_SUPPORTED_NETWORKS = typeof NETWORKS.ARBITRUM_RINKEBY | typeof NETWORKS.ARBITRUM;
export type V2_API_COMMIT_TYPE = typeof V2_API_COMMIT_TYPES[keyof typeof V2_API_COMMIT_TYPES];

export const V2_API_COMMIT_TYPES = {
    LONG_MINT: 'LongMint',
    LONG_BURN: 'LongBurn',
    SHORT_MINT: 'ShortMint',
    SHORT_BURN: 'ShortBurn',
    LONG_BURN_SHORT_MINT: 'LongBurnShortMint',
    SHORT_BURN_LONG_MINT: 'ShortBurnLongMint',
} as const;

// Raw API return types
export type PendingCommitsResult = {
    amount: string; // unparsed,
    // this gets returned as the enum integer from the contracts which is the same as the enum imported here
    commitType: CommitEnum;
    txnHash: string;
    timestamp: number;
    from: string;
    commitID: string;
    pool: string;
    updateIntervalId: number;
};

export type TradeHistoryResult = {
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
export type PendingCommits = {
    amount: string; // unparsed amount
    commitType: CommitEnum;
    txnHash: string;
    timestamp: number; // seconds
    from: string;
    commitID: string;
    pool: string; // pool address
    updateIntervalId: number;
};

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

type GraphCommitType = 'ShortMint' | 'ShortBurn' | 'LongMint' | 'LongBurn' | 'LongBurnShortMint' | 'ShortBurnLongMint';

export type GraphCommit = {
    id: string;
    type: GraphCommitType;
    amount: string;
    pool: string;
    trader: string;
    created: string;
    txnHash: string;
    updateIntervalId: string;
};
