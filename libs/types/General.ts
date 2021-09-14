import React from 'react';
import { CommitEnum, SideEnum } from '@libs/constants';
import BigNumber from 'bignumber.js';
import { TypedEvent } from '@tracer-protocol/perpetual-pools-contracts/types/commons';
import { ethers } from 'ethers';

/**
 * Can be used when component passes down children
 */
export type Children = {
    children?: React.ReactNode;
};

/**
 * Universal result object
 */
export type Result = {
    status: 'error' | 'success';
    message?: string;
    error?: string;
};

export type APIResult = {
    status: 'error' | 'success';
    message: string;
    data: any;
};

// name is in the form {leverage}-${asset}/${collateral}
export type PoolType = {
    name: string;
    address: string;
};

export type Token = {
    address: string;
    name: string;
    symbol: string;
    balance: BigNumber;
    approvedAmount: BigNumber;
    decimals: number;
};

export type TokenBreakdown = PoolToken & {
    tokenPrice: BigNumber;
    pool: string;
};

export type PoolToken = Token & {
    side: SideEnum;
    supply: BigNumber;
};

export type Committer = {
    address: string;
    pendingLong: BigNumber;
    pendingShort: BigNumber;
    allUnexecutedCommits: CreatedCommitType[];
    minimumCommitSize: BigNumber;
};

export type CreatedCommitType = TypedEvent<
    [ethers.BigNumber, ethers.BigNumber, number] & {
        commitID: ethers.BigNumber;
        amount: ethers.BigNumber;
        commitType: number;
    }
>;

export type Pool = {
    address: string;
    name: string;
    updateInterval: BigNumber;
    frontRunningInterval: BigNumber;
    lastUpdate: BigNumber;
    lastPrice: BigNumber;
    shortBalance: BigNumber;
    leverage: number;
    longBalance: BigNumber;
    oraclePrice: BigNumber;
    quoteToken: Token;
    shortToken: PoolToken;
    longToken: PoolToken;
    committer: Committer;
    keeper: string;
    subscribed: boolean;
};

// for mint the amount is the amount of collateral spent
// for burn the amount is the amount of tokens
export type PendingCommitInfo = {
    pool: string;
    id: number;
    type: CommitEnum;
    amount: BigNumber;
    txnHash: string;
    from: string; // user who sent txn
};

export type QueuedCommit = PendingCommitInfo & {
    token: PoolToken;
    tokenPrice: BigNumber;
    nextRebalance: BigNumber;
    frontRunningInterval: BigNumber;
    updateInterval: BigNumber;
};

// table heading initialiser
export type Heading = {
    text: string;
    width: string; // string width
};
