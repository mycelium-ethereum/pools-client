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
            if (balances.settlementTokenBalance) {
                state.pools[pool].userBalances.settlementToken.balance = balances.settlementTokenBalance;
            }
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
        get().updatePoolTokenBalances([pool], provider, account);
        get().updateSettlementTokenBalances([pool], provider, account);
        get().updateTradeStats([pool], network, account);
        get().updatePoolBalances(pool, provider);
    },

    updateSettlementTokenBalances: (pools_, provider, account) => {
        if (!provider || !account) {
            return false;
        }

        const allPools = get().pools;

        // gets all settlementTokens and maps them to their relevant pools
        const uniqueSettlementTokensMap: Record<string, string[]> = Object.values(allPools).reduce(
            (o, { poolInstance }) => {
                const tokenAddress = poolInstance.settlementToken.address;
                const address = poolInstance.address;
                o[tokenAddress] = o[tokenAddress] || [];
                o[tokenAddress].push(address);
                return o;
            },
            {} as Record<string, string[]>,
        );

        // array of settlementTokens relevant to inputted pools
        //  used with the above to fetch all relevant pools for each settlementToken
        const relevantSettlementTokens: string[] = Array.from(
            pools_
                .reduce((o, pool) => {
                    const settlementToken = allPools[pool]?.poolInstance?.settlementToken?.address;
                    settlementToken && o.set(settlementToken, true);
                    return o;
                }, new Map<string, boolean>())
                .keys(),
        );

        // fetches tokenBalances for each settlementToken relevant to inputted pools_
        fetchTokenBalances(relevantSettlementTokens, provider, account)
            .then((balances) => {
                console.count('Fetched settlement token balances');
                set((state) => {
                    balances.forEach((settlementTokenBalance_, index) => {
                        const pools = uniqueSettlementTokensMap[relevantSettlementTokens[index]];
                        // pool[0] must exist otherwise the entry would not exist in uniqueSettlementTokens
                        const decimals = state.pools[pools[0]].poolInstance.settlementToken.decimals;
                        const settlementTokenBalance = new BigNumber(
                            ethers.utils.formatUnits(settlementTokenBalance_, decimals),
                        );
                        uniqueSettlementTokensMap[relevantSettlementTokens[index]].map((pool) => {
                            state.pools[pool].userBalances.settlementToken.balance = settlementTokenBalance;
                        });
                    });
                });
            })
            .catch((err) => {
                console.error('Failed to fetch settlementToken balances', err);
            });
    },
    updatePoolTokenBalances: (pools_, provider, account) => {
        pools_.forEach((pool_) => {
            if (!get().pools[pool_] || !provider || !account) {
                get().setAggregateBalances(pool_, DEFAULT_POOLSTATE.userBalances.aggregateBalances);
                get().setTokenBalances(pool_, {
                    shortTokenBalance: DEFAULT_POOLSTATE.userBalances.shortToken.balance,
                    longTokenBalance: DEFAULT_POOLSTATE.userBalances.longToken.balance,
                });
                return;
            }
            const pool = get().pools[pool_].poolInstance;
            const tokens = [pool.shortToken.address, pool.longToken.address];
            const decimals = pool.settlementToken.decimals;
            fetchTokenBalances(tokens, provider, account)
                .then((balances) => {
                    const shortTokenBalance = new BigNumber(ethers.utils.formatUnits(balances[0], decimals));
                    const longTokenBalance = new BigNumber(ethers.utils.formatUnits(balances[1], decimals));

                    console.debug('Balances', {
                        shortTokenBalance,
                        longTokenBalance,
                    });
                    get().setTokenBalances(pool.address, {
                        shortTokenBalance,
                        longTokenBalance,
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
        });
    },
    updateTradeStats: (pools_, network, account) => {
        pools_.forEach((pool_) => {
            if (!network || !get().pools[pool_] || !account) {
                get().setTradeStats(pool_, DEFAULT_POOLSTATE.userBalances.tradeStats);
                return;
            }
            const pool = get().pools[pool_].poolInstance;
            const decimals = pool.settlementToken.decimals;
            fetchTradeStats(network, pool_, account, decimals)
                .then((tradeStats) => {
                    get().setTradeStats(pool_, tradeStats);
                })
                .catch((err) => {
                    console.error('Failed to fetch aggregate balance', err);
                });
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
    updateTokenApprovals: (pools_, provider, account) => {
        // get and set approvals
        if (!provider || !account) {
            return;
        }
        pools_.forEach((pool_) => {
            if (!get().pools[pool_]) {
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
    updatePoolTokenBalances: IPoolsInstancesSlice['updatePoolTokenBalances'];
    updateSettlementTokenBalances: IPoolsInstancesSlice['updateSettlementTokenBalances'];
    updateTokenApprovals: IPoolsInstancesSlice['updateTokenApprovals'];
    updateTradeStats: IPoolsInstancesSlice['updateTradeStats'];
} = (state) => ({
    handlePoolUpkeep: state.poolsInstancesSlice.handlePoolUpkeep,
    updatePoolBalances: state.poolsInstancesSlice.updatePoolBalances,
    updatePoolTokenBalances: state.poolsInstancesSlice.updatePoolTokenBalances,
    updateSettlementTokenBalances: state.poolsInstancesSlice.updateSettlementTokenBalances,
    updateTokenApprovals: state.poolsInstancesSlice.updateTokenApprovals,
    updateTradeStats: state.poolsInstancesSlice.updateTradeStats,
});
