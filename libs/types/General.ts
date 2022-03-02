import React from 'react';
import { SideEnum } from '@libs/constants';
import BigNumber from 'bignumber.js';
import { TypedEvent } from '@tracer-protocol/perpetual-pools-contracts/types/commons';
import { ethers } from 'ethers';
import { LogoTicker } from '@components/General';
import { CommitEnum } from '@tracer-protocol/pools-js';

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
    quoteTokens: BigNumber;
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
    created: number; // created timestamp of the given commit
};

export type QueuedCommit = PendingCommitInfo & {
    tokenIn: PoolToken;
    tokenOut: PoolToken;
    tokenPrice: BigNumber;
    nextRebalance: BigNumber;
    frontRunningInterval: BigNumber;
    updateInterval: BigNumber;
    quoteTokenSymbol: string;
};

export type HistoricCommit = PendingCommitInfo & {
    token: PoolToken;
    tokenPrice: BigNumber;
    fee: BigNumber;
};

// table heading initialiser
export type Heading = {
    text: string;
    width: string; // string width
};

export type BridgeableAsset = {
    name: string;
    symbol: LogoTicker;
    address: string | null;
    decimals: number;
    displayDecimals: number;
};

export type BridgeableBalance = {
    balance: BigNumber;
    allowance: BigNumber;
    spender: string; // address that allowance corresponds to
};

export type BridgeableBalances = { [network: string]: { [account: string]: { [symbol: string]: BridgeableBalance } } };

export type BridgeProviders = { [network: string]: ethers.providers.JsonRpcProvider };

export enum MarketFilterEnum {
    All = 'All',
    ETH = 'Ethereum',
    BTC = 'Bitcoin',
    TOKE = 'Tokemak',
    LINK = 'Chainlink',
    EUR = 'Euro',
    AAVE = 'Aave',
}
