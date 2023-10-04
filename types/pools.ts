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
export type TokenBalance = {
    approvedAmount: BigNumber;
    balance: BigNumber;
};

export type OracleDetails = {
    type: 'SMA' | 'Spot';
    numPeriods: number;
    updateInterval: number;
    isLoading: boolean;
};

export type TradeStats = {
    avgLongEntryPriceWallet: BigNumber;
    avgShortEntryPriceWallet: BigNumber;
    avgLongEntryPriceAggregate: BigNumber;
    avgShortEntryPriceAggregate: BigNumber;
    avgLongExitPriceWallet: BigNumber;
    avgShortExitPriceWallet: BigNumber;
    avgLongExitPriceAggregate: BigNumber;
    avgShortExitPriceAggregate: BigNumber;
    totalLongTokensMinted: BigNumber;
    totalLongMintSpend: BigNumber;
    totalShortTokensMinted: BigNumber;
    totalShortMintSpend: BigNumber;
    totalLongTokensBurned: BigNumber;
    totalLongBurnReceived: BigNumber;
    totalShortTokensBurned: BigNumber;
    totalShortBurnReceived: BigNumber;
    totalLongBurns: number;
    totalLongMints: number;
    totalShortBurns: number;
    totalShortMints: number;
};

export type NextPoolState = {
    currentSkew: BigNumber;
    currentLongBalance: BigNumber;
    currentLongSupply: BigNumber;
    currentShortBalance: BigNumber;
    currentShortSupply: BigNumber;
    currentLongTokenPrice: BigNumber;
    currentShortTokenPrice: BigNumber;
    currentPendingLongTokenBurn: BigNumber;
    currentPendingShortTokenBurn: BigNumber;
    expectedSkew: BigNumber;
    expectedLongBalance: BigNumber;
    expectedLongSupply: BigNumber;
    expectedShortBalance: BigNumber;
    expectedShortSupply: BigNumber;
    expectedLongTokenPrice: BigNumber;
    expectedShortTokenPrice: BigNumber;
    expectedPendingLongTokenBurn: BigNumber;
    expectedPendingShortTokenBurn: BigNumber;
    lastOraclePrice: BigNumber;
    expectedOraclePrice: BigNumber;
    // front running
    expectedFrontRunningSkew: BigNumber;
    expectedFrontRunningLongBalance: BigNumber;
    expectedFrontRunningLongSupply: BigNumber;
    expectedFrontRunningShortBalance: BigNumber;
    expectedFrontRunningShortSupply: BigNumber;
    totalNetFrontRunningPendingLong: BigNumber;
    totalNetFrontRunningPendingShort: BigNumber;
    expectedFrontRunningLongTokenPrice: BigNumber;
    expectedFrontRunningShortTokenPrice: BigNumber;
    expectedFrontRunningPendingLongTokenBurn: BigNumber;
    expectedFrontRunningPendingShortTokenBurn: BigNumber;
    expectedFrontRunningOraclePrice: BigNumber;
};

export type PoolInfo = {
    poolInstance: Pool;
    poolStatus: PoolStatus;
    userBalances: {
        shortToken: TokenBalance;
        longToken: TokenBalance;
        settlementToken: TokenBalance;
        aggregateBalances: AggregateBalances;
        tradeStats: TradeStats;
    };
    upkeepInfo: {
        expectedExecution: number;
        isWaitingForUpkeep: boolean;
    };
    poolCommitStats: PoolCommitStats;
    balancerPrices: {
        longToken: BigNumber; // in settlementToken
        shortToken: BigNumber; // in settlementToken
        // TODO
        // settlementToken: BigNumber; // in some stable coin of our choosing
    };
    nextPoolState: NextPoolState;
    oracleDetails: OracleDetails;
};

export type TradeStatsAPIResponse = {
    avgLongEntryPriceWallet: string;
    avgShortEntryPriceWallet: string;
    avgLongEntryPriceAggregate: string;
    avgShortEntryPriceAggregate: string;
    avgLongExitPriceWallet: string;
    avgShortExitPriceWallet: string;
    avgLongExitPriceAggregate: string;
    avgShortExitPriceAggregate: string;
    totalLongTokensMinted: string;
    totalLongMintSpend: string;
    totalShortTokensMinted: string;
    totalShortMintSpend: string;
    totalLongTokensBurned: string;
    totalLongBurnReceived: string;
    totalShortTokensBurned: string;
    totalShortBurnReceived: string;
    totalLongBurns: number;
    totalLongMints: number;
    totalShortBurns: number;
    totalShortMints: number;
};

export type NextPoolStateAPIResponse = {
    currentSkew: string;
    currentLongBalance: string;
    currentLongSupply: string;
    currentShortBalance: string;
    currentShortSupply: string;
    currentLongTokenPrice: string;
    currentShortTokenPrice: string;
    currentPendingLongTokenBurn: string;
    currentPendingShortTokenBurn: string;
    expectedSkew: string;
    expectedLongBalance: string;
    expectedLongSupply: string;
    expectedShortBalance: string;
    expectedShortSupply: string;
    expectedLongTokenPrice: string;
    expectedShortTokenPrice: string;
    expectedPendingLongTokenBurn: string;
    expectedPendingShortTokenBurn: string;
    totalNetPendingLong: string;
    totalNetPendingShort: string;
    lastOraclePrice: string;
    expectedOraclePrice: string;
    expectedFrontRunningSkew: string;
    expectedFrontRunningLongBalance: string;
    expectedFrontRunningLongSupply: string;
    expectedFrontRunningShortBalance: string;
    expectedFrontRunningShortSupply: string;
    totalNetFrontRunningPendingLong: string;
    totalNetFrontRunningPendingShort: string;
    expectedFrontRunningLongTokenPrice: string;
    expectedFrontRunningShortTokenPrice: string;
    expectedFrontRunningPendingLongTokenBurn: string;
    expectedFrontRunningPendingShortTokenBurn: string;
    expectedFrontRunningOraclePrice: string;
};

export type PoolCommitStatsAPIResponse = {
    uniqueWalletAddresses: number;
    totalLongMints: number;
    totalLongBurns: number;
    totalShortMints: number;
    totalShortBurns: number;
    totalShortBurnLongMints: number;
    totalLongBurnShortMints: number;
    totalVolumeUSD: string;
    primaryMarketVolume: {
        [tokenAddress: string]: {
            tokenSymbol: string;
            tokenDecimals: number;
            mint: string; // total mint volume denoted in this token
            burn: string; // total burn volume denoted in this token
            total: string;
            mintUSD: string;
            burnUSD: string;
            totalUSD: string;
        };
    };
};

export type PoolCommitStats = {
    oneDayVolume: BigNumber;
};

export enum PoolStatus {
    Live,
    Deprecated,
    V1
}
