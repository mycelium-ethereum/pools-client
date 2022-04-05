import BigNumber from 'bignumber.js';
import { Pool } from '@tracer-protocol/pools-js';
import { AggregateBalances, PoolInfo } from '~/types/pools';

export interface IPoolsInstancesSlice {
    pools: Record<string, PoolInfo>;
    selectedPool: string | undefined;
    poolsInitialized: boolean;

    setPool: (pool: Pool) => void;
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
}
