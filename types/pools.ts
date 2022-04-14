import BigNumber from 'bignumber.js';
import { SideEnum, StaticPoolInfo, Pool } from '@tracer-protocol/pools-js';

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

export type PoolToken = Token & {
    side: SideEnum;
    supply: BigNumber;
};

export type PendingAmounts = {
    mint: BigNumber; // amount of USDC pending in commit
    burn: BigNumber; // amount of tokens burned in commits
};

export type AggregateBalances = {
    longTokens: BigNumber;
    shortTokens: BigNumber;
    settlementTokens: BigNumber;
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

export type AverageEntryPrices = {
    longPriceWallet: BigNumber;
    shortPriceWallet: BigNumber;
    longPriceAggregate: BigNumber;
    shortPriceAggregate: BigNumber;
};

export type PoolInfo = {
    poolInstance: Pool;
    userBalances: {
        shortToken: TokenBalance;
        longToken: TokenBalance;
        settlementToken: TokenBalance;
        aggregateBalances: AggregateBalances;
        averageEntryPrices: AverageEntryPrices;
    };
    upkeepInfo: {
        expectedExecution: number;
        isWaitingForUpkeep: boolean;
    };
};

export type AverageEntryPricesAPIResponse = {
    longPriceWallet: string;
    shortPriceWallet: string;
    longPriceAggregate: string;
    shortPriceAggregate: string;
};
