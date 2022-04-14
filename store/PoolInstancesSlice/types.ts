import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
<<<<<<< HEAD
import { Pool } from '@tracer-protocol/pools-js';
=======
import { Pool, KnownNetwork } from '@tracer-protocol/pools-js';
>>>>>>> 8969e78d0bbc9bc11c128c40b9b5e4fa2d48e03a
import { AggregateBalances, AverageEntryPrices, PoolInfo } from '~/types/pools';

export interface IPoolsInstancesSlice {
    pools: Record<string, PoolInfo>;
    selectedPool: string | undefined;
    poolsInitialized: boolean;

    setPool: (pool: Pool) => void;
    setMultiplePools: (pool: Pool[]) => void;
    resetPools: () => void;
    setPoolsInitialized: (initialized: boolean) => void;

    setTokenBalances: (
        pool: string,
        balances: { shortTokenBalance: BigNumber; longTokenBalance: BigNumber; settlementTokenBalance: BigNumber },
    ) => void;
    setTokenApprovals: (
        pool: string,
        approvals: { shortTokenAmount: BigNumber; longTokenAmount: BigNumber; settlementTokenAmount: BigNumber },
    ) => void;
    setAggregateBalances: (pool: string, aggregateBalances: AggregateBalances) => void;
    setAverageEntryPrices: (pool: string, aggregateBalances: AverageEntryPrices) => void;
    setUpdatedPoolBalances: (
        pool: string,
        updatedbalances: {
            lastPrice: BigNumber;
            oraclePrice: BigNumber;
            longBalance: BigNumber;
            shortBalance: BigNumber;
            lastUpdate: BigNumber;
        },
    ) => void;
    setPoolIsWaiting: (pool: string, isWaitingForUpkeep: boolean) => void;
    setPoolExpectedExecution: (pool: string) => void;
    setTokenApproved: (pool: string, token: 'settlementToken' | 'shortToken' | 'longToken', value: BigNumber) => void;

    handlePoolUpkeep: (
        pool: string,
        provider: ethers.providers.JsonRpcProvider | undefined,
        account: string | undefined,
        network: KnownNetwork | undefined,
    ) => void;
    updateTokenBalances: (
        pool: string,
        provider: ethers.providers.JsonRpcProvider | undefined,
        account: string | undefined,
    ) => void;
<<<<<<< HEAD
    updateAverageEntryPrices: (pool: string | undefined, account: string | undefined) => void;
=======
    updateAverageEntryPrices: (
        network: KnownNetwork | undefined,
        pool: string | undefined,
        account: string | undefined,
    ) => void;
>>>>>>> 8969e78d0bbc9bc11c128c40b9b5e4fa2d48e03a
    updateTokenApprovals: (
        pool: string,
        provider: ethers.providers.JsonRpcProvider | undefined,
        account: string | undefined,
    ) => void;
    updatePoolBalances: (pool: string, provider: ethers.providers.JsonRpcProvider | undefined) => void;
}
