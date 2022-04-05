import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { TypedEvent } from '@tracer-protocol/perpetual-pools-contracts/types/commons';
import { SideEnum, CommitEnum, StaticPoolInfo, Pool } from '@tracer-protocol/pools-js';

// name is in the form {leverage}-${asset}/${collateral}
export type PoolType = {
    name: string;
    address: string;
};

export type StaticTokenInfo = {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
};
export type Token = StaticTokenInfo & {
    balance: BigNumber;
    approvedAmount: BigNumber;
};

export type TokenBreakdown = PoolToken & {
    tokenPrice: BigNumber;
    pool: string;
};

export type PoolToken = Omit<Token, 'symbol'> & {
    side: SideEnum;
    supply: BigNumber;
    symbol: string;
};

export type PendingAmounts = {
    mint: BigNumber; // amount of USDC pending in commit
    burn: BigNumber; // amount of tokens burned in commits
};
export type Committer = {
    address: string;
    pendingLong: PendingAmounts;
    pendingShort: PendingAmounts;
    allUnexecutedCommits: CreatedCommitType[];
};

export type CreatedCommitType = TypedEvent<
    [ethers.BigNumber, ethers.BigNumber, number] & {
        commitID: ethers.BigNumber;
        amount: ethers.BigNumber;
        commitType: number;
    }
>;

export type AggregateBalances = {
    longTokens: BigNumber;
    shortTokens: BigNumber;
    settlementTokens: BigNumber;
};

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

export type QueuedCommit = PendingCommitInfo & {
    tokenIn: PoolToken;
    tokenOut: PoolToken;
    tokenPrice: BigNumber;
    settlementTokenSymbol: string;
    expectedExecution: number;
};

export type HistoricCommit = PendingCommitInfo & {
    token: PoolToken;
    tokenPrice: BigNumber;
    fee: BigNumber;
};

/*
 * PoolList interface. Every poolsList must conform to this
 *  structure
 */
export interface PoolList {
    name: string;
    timestamp: string;
    // readonly version: Version;
    pools: StaticPoolInfo[];
    keywords?: string[];
    logoURI?: string;
}

export interface PoolLists {
    All: PoolList[];
    Tracer: PoolList[];
    External: PoolList[];
}

export interface PoolListUris {
    All: string[];
    Tracer: string[];
    External: string[];
}

/**
 *
 * Pools store types
 */
type TokenBalance = {
    approvedAmount: BigNumber;
    balance: BigNumber;
};

export type PoolInfo = {
    poolInstance: Pool;
    userBalances: {
        shortToken: TokenBalance;
        longToken: TokenBalance;
        settlementToken: TokenBalance;
        aggregateBalances: AggregateBalances;
    };
    upkeepInfo: {
        expectedExecution: number;
        isWaitingForUpkeep: boolean;
    };
};
