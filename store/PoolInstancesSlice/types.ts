import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { Pool, KnownNetwork } from '@tracer-protocol/pools-js';
import { AggregateBalances, TradeStats, PoolInfo, PoolCommitStats, NextPoolState } from '~/types/pools';

export enum KnownPoolsInitialisationErrors {
    ProviderNotReady = 'Provider not ready',
    NetworkNotSupported = 'Network not supported',
    NoPools = 'No pools found',
}

export interface IPoolsInstancesSlice {
    pools: Record<string, PoolInfo>;
    selectedPool: string | undefined;
    poolsInitialized: boolean;
    poolsInitializationError: any | undefined;

    setPool: (pool: Pool, network: string) => void;
    setMultiplePools: (pool: Pool[], network: string) => void;
    resetPools: () => void;
    setPoolsInitialized: (initialized: boolean) => void;
    setPoolsInitializationError: (error: any) => void;

    setTokenBalances: (
        pool: string,
        balances: { shortTokenBalance: BigNumber; longTokenBalance: BigNumber; settlementTokenBalance?: BigNumber },
    ) => void;
    setTokenApprovals: (
        pool: string,
        approvals: { shortTokenAmount: BigNumber; longTokenAmount: BigNumber; settlementTokenAmount: BigNumber },
    ) => void;
    setAggregateBalances: (pool: string, aggregateBalances: AggregateBalances) => void;
    setTradeStats: (pool: string, aggregateBalances: TradeStats) => void;
    setNextPoolState: (pool: string, nextPoolState: NextPoolState) => void;
    setPoolCommitStats: (pool: string, commitStats: PoolCommitStats) => void;
    setPoolIsWaiting: (pool: string, isWaitingForUpkeep: boolean) => void;
    setPoolExpectedExecution: (pool: string) => void;
    setTokenApproved: (pool: string, token: 'settlementToken' | 'shortToken' | 'longToken', value: BigNumber) => void;

    handlePoolUpkeep: (
        pool: string,
        provider: ethers.providers.JsonRpcProvider | undefined,
        account: string | undefined,
        network: KnownNetwork | undefined,
    ) => void;
    updatePoolTokenBalances: (
        pools: string[],
        provider: ethers.providers.JsonRpcProvider | undefined,
        account: string | undefined,
    ) => void;
    updateSettlementTokenBalances: (
        pools: string[],
        provider: ethers.providers.JsonRpcProvider | undefined,
        account: string | undefined,
    ) => void;
    updateTradeStats: (pools: string[], network: KnownNetwork | undefined, account: string | undefined) => void;
    updateNextPoolStates: (pools: string[], network: KnownNetwork | undefined) => void;
    updatePoolCommitStats: (pools: string[], network: KnownNetwork | undefined) => void;
    updateTokenApprovals: (
        pools: string[],
        provider: ethers.providers.JsonRpcProvider | undefined,
        account: string | undefined,
    ) => void;
    updatePoolBalances: (pool: string, provider: ethers.providers.JsonRpcProvider | undefined) => void;
    updatePoolBalancerPrices: (pool: string[], network: KnownNetwork | undefined) => void;
    simulateUpdateAvgEntryPrices: (pool: string) => void;
}
