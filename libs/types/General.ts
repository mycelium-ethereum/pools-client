import React from 'react';
import { SHORT, LONG, MINT, BURN, LONG_BURN, LONG_MINT, SHORT_BURN, SHORT_MINT, BUYS, SELLS } from '@libs/constants';
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
export type SideType = typeof LONG | typeof SHORT;

export type TokenType = typeof MINT | typeof BURN;

export type CommitType = typeof SHORT_MINT | typeof SHORT_BURN | typeof LONG_MINT | typeof LONG_BURN;

export type CommitsFocus = typeof BUYS | typeof SELLS;

// TODO change this to known markets
export type MarketType = 'ETH/USDC' | 'ETH/TUSD' | 'BTC/USD' | undefined;

// TODO change this to known currencies
export type CurrencyType = 'DAI' | 'USDC';

export type LeverageType = number;

export type PoolType = {
    name: string;
    address: string;
};

export type Token = {
    address: string;
    name: string;
    symbol: string;
    balance: BigNumber;
    approved: boolean;
};

export type TokenBreakdown = PoolToken & {
    tokenPrice: BigNumber;
    pool: string;
};

export type PoolToken = Token & {
    side: SideType;
    supply: BigNumber;
};

export type Committer = {
    address: string;
    pendingLong: BigNumber;
    pendingShort: BigNumber;
    allUnexecutedCommits: CreatedCommitType[];
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
    leverage: BigNumber;
    longBalance: BigNumber;
    oraclePrice: BigNumber;
    quoteToken: Token;
    shortToken: PoolToken;
    longToken: PoolToken;
    committer: Committer;
    subscribed: boolean;
};

export type PendingCommitInfo = {
    pool: string;
    id: number;
    type: CommitType;
    amount: BigNumber;
    txnHash: string;
};

export type QueuedCommit = PendingCommitInfo & {
    token: PoolToken;
    spent: BigNumber;
    tokenPrice: BigNumber;
    nextRebalance: BigNumber;
};

// table heading initialiser
export type Heading = {
    text: string;
    width: string; // string width
};
