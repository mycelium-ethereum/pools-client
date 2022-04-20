import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { getExpectedExecutionTimestamp } from '@tracer-protocol/pools-js';
import { DEFAULT_POOLSTATE } from '~/constants/pools';
import { StateSlice } from '~/store/types';
import { fetchAggregateBalance, fetchTokenApprovals, fetchTokenBalances, fetchTradeStats } from '~/utils/pools';
import { IPoolsInstancesSlice } from './types';
import { StoreState } from '..';

export const createPoolsInstancesSlice: StateSlice<IPoolsInstancesSlice> = (set, get) => ({
    pools: {},
    selectedPool: undefined,
    poolsInitialized: false,

    setPool: (pool) => {
        const now = Date.now() / 1000;
        const expectedExecution = getExpectedExecutionTimestamp(
            pool.frontRunningInterval.toNumber(),
            pool.updateInterval.toNumber(),
            pool.lastUpdate.toNumber(),
            now,
        );
        set((state) => {
            state.pools[pool.address] = {
                poolInstance: pool,
                userBalances: DEFAULT_POOLSTATE.userBalances,
                upkeepInfo: {
                    expectedExecution: expectedExecution,
                    isWaitingForUpkeep: expectedExecution < now,
                },
            };
        });
    },
    setMultiplePools: (pools) => {
        const now = Date.now() / 1000;
        set((state) => {
            pools.forEach((pool) => {
                const expectedExecution = getExpectedExecutionTimestamp(
                    pool.frontRunningInterval.toNumber(),
                    pool.updateInterval.toNumber(),
                    pool.lastUpdate.toNumber(),
                    now,
                );
                state.pools[pool.address] = {
                    poolInstance: pool,
                    userBalances: DEFAULT_POOLSTATE.userBalances,
                    upkeepInfo: {
                        expectedExecution: expectedExecution,
                        isWaitingForUpkeep: expectedExecution < now,
                    },
                };
            });
        });
    },
    resetPools: () => {
        set((state) => void (state.pools = {}));
    },
    setPoolsInitialized: (initialized) => {
        set((state) => void (state.poolsInitialized = initialized));
    },
    setTokenBalances: (pool, balances) => {
        if (!get().pools[pool]) {
            return;
        }
        set((state) => {
            state.pools[pool].userBalances.shortToken.balance = balances.shortTokenBalance;
            state.pools[pool].userBalances.longToken.balance = balances.longTokenBalance;
            state.pools[pool].userBalances.settlementToken.balance = balances.settlementTokenBalance;
        });
    },
    setTokenApprovals: (pool, approvals) => {
        if (!get().pools[pool]) {
            return;
        }
        set((state) => {
            state.pools[pool].userBalances.shortToken.approvedAmount = approvals.shortTokenAmount;
            state.pools[pool].userBalances.longToken.approvedAmount = approvals.longTokenAmount;
            state.pools[pool].userBalances.settlementToken.approvedAmount = approvals.settlementTokenAmount;
        });
    },
    setAggregateBalances: (pool, aggregateBalances) => {
        if (!get().pools[pool]) {
            return;
        }
        set((state) => {
            state.pools[pool].userBalances.aggregateBalances = aggregateBalances;
        });
    },
    setTradeStats: (pool, tradeStats) => {
        if (!get().pools[pool]) {
            return;
        }
        set((state) => {
            state.pools[pool].userBalances.tradeStats = tradeStats;
        });
    },
    setUpdatedPoolBalances: (pool, updatedBalances) => {
        if (!get().pools[pool]) {
            return;
        }
        console.log('updating balances', updatedBalances);
        // set((state) => {
        // state.pools[pool]
        // })
        // return {
        // ...state,
        // pools: {
        // ...state.pools,
        // [action.pool]: {
        // ...state.pools[action.pool],
        // lastUpdate: action.lastUpdate,
        // lastPrice: action.lastPrice,
        // longBalance: action.longBalance,
        // shortBalance: action.shortBalance,
        // nextLongBalance: action.longBalance,
        // nextShortBalance: action.shortBalance,
        // oraclePrice: action.oraclePrice,
        // },
        // },
        // };
    },
    setPoolIsWaiting: (pool, isWaitingForUpkeep) => {
        if (!get().pools[pool]) {
            return;
        }
        set((state) => void (state.pools[pool].upkeepInfo.isWaitingForUpkeep = isWaitingForUpkeep));
    },
    setPoolExpectedExecution: (pool) => {
        if (!get().pools[pool]) {
            return;
        }
        set((state) => {
            const { frontRunningInterval, updateInterval, lastUpdate } = state.pools[pool].poolInstance;
            state.pools[pool].upkeepInfo.expectedExecution = getExpectedExecutionTimestamp(
                frontRunningInterval.toNumber(),
                updateInterval.toNumber(),
                lastUpdate.toNumber(),
                Math.floor(Date.now() / 1000),
            );
        });
    },
    setTokenApproved: (pool, token, approvedAmount) => {
        if (!get().pools[pool]) {
            return;
        }
        set((state) => void (state.pools[pool].userBalances[token].approvedAmount = approvedAmount));
    },

    handlePoolUpkeep: (pool, provider, account, network) => {
        get().setPoolIsWaiting(pool, false);
        get().updateTokenBalances(pool, provider, account);
        get().updateTradeStats(network, pool, account);
        get().updatePoolBalances(pool, provider);
    },

    updateTokenBalances: (pool_, provider, account) => {
        if (!provider || !account || !get().pools[pool_]) {
            return false;
        }
        const pool = get().pools[pool_].poolInstance;
        const tokens = [pool.shortToken.address, pool.longToken.address, pool.settlementToken.address];
        const decimals = pool.settlementToken.decimals;
        fetchTokenBalances(tokens, provider, account, pool.address)
            .then((balances) => {
                const shortTokenBalance = new BigNumber(ethers.utils.formatUnits(balances[0], decimals));
                const longTokenBalance = new BigNumber(ethers.utils.formatUnits(balances[1], decimals));
                const settlementTokenBalance = new BigNumber(ethers.utils.formatUnits(balances[2], decimals));

                console.debug('Balances', {
                    shortTokenBalance,
                    longTokenBalance,
                    settlementTokenBalance,
                });

                get().setTokenBalances(pool.address, {
                    shortTokenBalance,
                    longTokenBalance,
                    settlementTokenBalance,
                });
            })
            .catch((err) => {
                console.error('Failed to fetch token balances', err);
            });
        fetchAggregateBalance(provider, account, pool.committer.address, decimals)
            .then((balances) => {
                console.debug('Pending balances', {
                    longTokens: balances.longTokens.toNumber(),
                    shortTokens: balances.shortTokens.toNumber(),
                    settlementTokens: balances.settlementTokens.toNumber(),
                });
                get().setAggregateBalances(pool.address, balances);
            })
            .catch((err) => {
                console.error('Failed to fetch aggregate balance', err);
            });
    },
    updateTradeStats: (network, pool, account) => {
        if (!network || !pool || !account) {
            return DEFAULT_POOLSTATE.userBalances.tradeStats;
        }

        const poolState = get().pools[pool].poolInstance;

        const decimals = poolState.settlementToken.decimals;
        fetchTradeStats(network, pool, account, decimals)
            .then((tradeStats) => {
                get().setTradeStats(pool, tradeStats);
            })
            .catch((err) => {
                console.error('Failed to fetch aggregate balance', err);
            });
    },
    updatePoolBalances: (pool_, provider) => {
        if (!provider || !get().pools[pool_]) {
            console.debug(`Skipping pool balance update: Provider: ${provider}, pool: ${pool_}`);
            return;
        }
        const pool = get().pools[pool_].poolInstance;
        // set the provider
        pool.connect(provider);
        // fetch all updated values
        Promise.all([
            pool.fetchLastPriceTimestamp(),
            pool.fetchLastPrice(),
            pool.fetchOraclePrice(),
            pool.fetchPoolBalances(),
        ]).then((res) => {
            console.debug('Pool updated', res);
        });
    },
    updateTokenApprovals: (pool_, provider, account) => {
        // get and set approvals
        if (!provider || !account || !get().pools[pool_]) {
            return;
        }
        const pool = get().pools[pool_].poolInstance;
        const tokens = [pool.shortToken.address, pool.longToken.address, pool.settlementToken.address];
        const decimals = pool.settlementToken.decimals;
        fetchTokenApprovals(tokens, provider, account, pool_)
            .then((approvals) => {
                get().setTokenApprovals(pool.address, {
                    shortTokenAmount: new BigNumber(ethers.utils.formatUnits(approvals[0], decimals)),
                    longTokenAmount: new BigNumber(ethers.utils.formatUnits(approvals[1], decimals)),
                    settlementTokenAmount: new BigNumber(ethers.utils.formatUnits(approvals[2], decimals)),
                });
            })
            .catch((err) => {
                console.error('Failed to fetch token allowances', err);
            });
    },
});

export const selectSelectedPool: (state: StoreState) => IPoolsInstancesSlice['selectedPool'] = (state) =>
    state.poolsInstancesSlice.selectedPool;
export const selectPoolInstances: (state: StoreState) => IPoolsInstancesSlice['pools'] = (state) =>
    state.poolsInstancesSlice.pools;
export const selectPoolsInitialized: (state: StoreState) => IPoolsInstancesSlice['poolsInitialized'] = (state) =>
    state.poolsInstancesSlice.poolsInitialized;

export const selectPoolInstanceActions: (state: StoreState) => {
    setPool: IPoolsInstancesSlice['setPool'];
    setMultiplePools: IPoolsInstancesSlice['setMultiplePools'];
    resetPools: IPoolsInstancesSlice['resetPools'];
    setPoolsInitialized: IPoolsInstancesSlice['setPoolsInitialized'];
    setTokenBalances: IPoolsInstancesSlice['setTokenBalances'];
    setTokenApprovals: IPoolsInstancesSlice['setTokenApprovals'];
    setAggregateBalances: IPoolsInstancesSlice['setAggregateBalances'];
    setPoolIsWaiting: IPoolsInstancesSlice['setPoolIsWaiting'];
    setPoolExpectedExecution: IPoolsInstancesSlice['setPoolExpectedExecution'];
    setTokenApproved: IPoolsInstancesSlice['setTokenApproved'];
} = (state) => ({
    setPool: state.poolsInstancesSlice.setPool,
    setMultiplePools: state.poolsInstancesSlice.setMultiplePools,
    resetPools: state.poolsInstancesSlice.resetPools,
    setPoolsInitialized: state.poolsInstancesSlice.setPoolsInitialized,
    setTokenBalances: state.poolsInstancesSlice.setTokenBalances,
    setTokenApprovals: state.poolsInstancesSlice.setTokenApprovals,
    setAggregateBalances: state.poolsInstancesSlice.setAggregateBalances,
    setPoolIsWaiting: state.poolsInstancesSlice.setPoolIsWaiting,
    setPoolExpectedExecution: state.poolsInstancesSlice.setPoolExpectedExecution,
    setTokenApproved: state.poolsInstancesSlice.setTokenApproved,
});

export const selectPoolInstanceUpdateActions: (state: StoreState) => {
    handlePoolUpkeep: IPoolsInstancesSlice['handlePoolUpkeep'];
    updatePoolBalances: IPoolsInstancesSlice['updatePoolBalances'];
    updateTokenBalances: IPoolsInstancesSlice['updateTokenBalances'];
    updateTokenApprovals: IPoolsInstancesSlice['updateTokenApprovals'];
    updateTradeStats: IPoolsInstancesSlice['updateTradeStats'];
} = (state) => ({
    handlePoolUpkeep: state.poolsInstancesSlice.handlePoolUpkeep,
    updatePoolBalances: state.poolsInstancesSlice.updatePoolBalances,
    updateTokenBalances: state.poolsInstancesSlice.updateTokenBalances,
    updateTokenApprovals: state.poolsInstancesSlice.updateTokenApprovals,
    updateTradeStats: state.poolsInstancesSlice.updateTradeStats,
});
