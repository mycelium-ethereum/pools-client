import BigNumber from 'bignumber.js';
import { CommitEnum, StaticTokenInfo } from '@tracer-protocol/pools-js';

// for mint the amount is the amount of collateral spent
// for burn the amount is the amount of tokens
export type PendingCommitInfo = {
    pool: string;
    id: string;
    type: CommitEnum;
    amount: BigNumber;
    txnHash: string;
    from: string; // user who sent txn
    created: number; // created timestamp of the given commit
    appropriateIntervalId: number; // updateInterval when commit will get executed
};

export type ExtraTokenInfo = {
    amount: BigNumber;
    price: BigNumber;
    isLong?: boolean;
};

export type QueuedCommit = PendingCommitInfo & {
    tokenIn: StaticTokenInfo & ExtraTokenInfo;
    tokenOut: StaticTokenInfo & ExtraTokenInfo;
    settlementTokenSymbol: string;
    expectedExecution: number;
};

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

export type TradeHistoryResult = {
    date: number;
    type: V2_API_COMMIT_TYPE;
    tokenDecimals: number;
    tokenInAddress: string;
    tokenInSymbol: string;
    tokenInName: string;
    tokenInAmount: string;
    priceIn: string;
    priceOut: string;
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

export type TradeHistory = {
    timestamp: number;
    dateString: string;
    timeString: string;
    commitType: CommitEnum;
    fee: BigNumber;
    txnHashIn: string;
    txnHashOut: string;
    settlementToken: StaticTokenInfo;
    tokenIn: Omit<StaticTokenInfo, 'decimals'> & ExtraTokenInfo;
    tokenOut: Omit<StaticTokenInfo, 'decimals'> & ExtraTokenInfo;
};

// TRACER_API
export type V2_API_COMMIT_TYPE = typeof V2_API_COMMIT_TYPES[keyof typeof V2_API_COMMIT_TYPES];

export const V2_API_COMMIT_TYPES = {
    LONG_MINT: 'LongMint',
    LONG_BURN: 'LongBurn',
    SHORT_MINT: 'ShortMint',
    SHORT_BURN: 'ShortBurn',
    LONG_BURN_SHORT_MINT: 'LongBurnShortMint',
    SHORT_BURN_LONG_MINT: 'ShortBurnLongMint',
} as const;

// GRAPH COMMIT
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

export type CommitTypeString = keyof typeof CommitEnum;
export type PendingCommitAmounts = { [key in CommitTypeString]: BigNumber };
