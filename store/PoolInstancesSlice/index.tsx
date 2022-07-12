import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { SMAOracle__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
import { getExpectedExecutionTimestamp } from '@tracer-protocol/pools-js';
import { balancerConfig } from '~/constants/balancer';
import { deprecatedPools } from '~/constants/deprecatedPools';
import { DEFAULT_POOLSTATE } from '~/constants/pools';
import { StateSlice } from '~/store/types';
import { PoolStatus } from '~/types/pools';
import { getBalancerPrices } from '~/utils/balancer';
import {
    buildDefaultNextPoolState,
    fetchAggregateBalance,
    fetchTokenApprovals,
    fetchTokenBalances,
    fetchTradeStats,
} from '~/utils/pools';
import { fetchPoolCommitStats, fetchNextPoolState } from '~/utils/tracerAPI';
import { IPoolsInstancesSlice } from './types';
import { StoreState } from '..';

export const createPoolsInstancesSlice: StateSlice<IPoolsInstancesSlice> = (set, get) => ({
    pools: {},
    selectedPool: undefined,
    poolsInitialized: false,
    poolsInitializationError: undefined,

    setPool: (pool, network) => {
        const now = Math.floor(Date.now() / 1000);
        const expectedExecution = getExpectedExecutionTimestamp(
            pool.frontRunningInterval.toNumber(),
            pool.updateInterval.toNumber(),
            pool.lastUpdate.toNumber(),
            now,
        );
        set((state) => {
            state.pools[pool.address] = {
                poolInstance: pool,
                poolStatus: deprecatedPools?.[network]?.[pool.address] ? PoolStatus.Deprecated : PoolStatus.Live,
                userBalances: DEFAULT_POOLSTATE.userBalances,
                upkeepInfo: {
                    expectedExecution: expectedExecution,
                    isWaitingForUpkeep: expectedExecution < now,
                },
                poolCommitStats: DEFAULT_POOLSTATE.poolCommitStats,
                balancerPrices: DEFAULT_POOLSTATE.balancerPrices,
                nextPoolState: buildDefaultNextPoolState(pool),
                oracleDetails: DEFAULT_POOLSTATE.oracleDetails,
            };
        });
    },
    setMultiplePools: (pools, network) => {
        const now = Math.floor(Date.now() / 1000);
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
                    poolStatus: deprecatedPools?.[network]?.[pool.address] ? PoolStatus.Deprecated : PoolStatus.Live,
                    userBalances: DEFAULT_POOLSTATE.userBalances,
                    upkeepInfo: {
                        expectedExecution: expectedExecution,
                        isWaitingForUpkeep: expectedExecution < now,
                    },
                    poolCommitStats: DEFAULT_POOLSTATE.poolCommitStats,
                    balancerPrices: DEFAULT_POOLSTATE.balancerPrices,
                    nextPoolState: buildDefaultNextPoolState(pool),
                    oracleDetails: DEFAULT_POOLSTATE.oracleDetails,
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
    setPoolsInitializationError: (error) => {
        set((state) => void (state.poolsInitializationError = error));
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
    setOracleDetails: (pool, oracleDetails) => {
        if (!get().pools[pool]) {
            return;
        }
        set((state) => {
            state.pools[pool].oracleDetails = oracleDetails;
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
    setNextPoolState: (pool, nextPoolState) => {
        if (!get().pools[pool]) {
            return;
        }
        set((state) => {
            state.pools[pool].nextPoolState = nextPoolState;
        });
    },
    setPoolCommitStats: (pool, commitStats) => {
        if (!get().pools[pool]) {
            return;
        }
        set((state) => {
            state.pools[pool].poolCommitStats = commitStats;
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
        get().updateNextPoolStates([pool], network);
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
    updateNextPoolStates: (pools_, network) => {
        pools_.forEach((pool_) => {
            const poolInfo = get().pools[pool_];

            if (!network || !poolInfo) {
                get().setNextPoolState(pool_, DEFAULT_POOLSTATE.nextPoolState);
                return;
            }
            fetchNextPoolState({ network, pool: pool_ })
                .then((nextPoolState) => {
                    get().setNextPoolState(pool_, { ...nextPoolState });
                })
                .catch(() => {
                    get().setNextPoolState(pool_, buildDefaultNextPoolState(poolInfo.poolInstance));
                });
        });
    },
    updatePoolCommitStats: (pools_, network) => {
        pools_.forEach((pool_) => {
            if (!network || !get().pools[pool_]) {
                get().setPoolCommitStats(pool_, DEFAULT_POOLSTATE.poolCommitStats);
                return;
            }
            const pool = get().pools[pool_].poolInstance;
            const decimals = pool.settlementToken.decimals;
            fetchPoolCommitStats(network, pool_, decimals)
                .then((poolCommitStats) => {
                    get().setPoolCommitStats(pool_, poolCommitStats);
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
    updatePoolBalancerPrices: async (pools_, network) => {
        if (!network) {
            console.error('Failed to update balancer prices');
            return;
        }
        const prices = await getBalancerPrices(balancerConfig[network]);

        set((state) => {
            pools_.forEach((pool) => {
                const poolInstance = state.pools[pool]?.poolInstance;
                // pool exists in store we can safely set balancerPrices
                if (poolInstance) {
                    state.pools[pool].balancerPrices = {
                        longToken: prices[poolInstance.longToken.address.toLowerCase()] ?? new BigNumber(0),
                        shortToken: prices[poolInstance.shortToken.address.toLowerCase()] ?? new BigNumber(0),
                    };
                }
            });
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
    updateOracleDetails(pools_) {
        pools_.forEach((pool_) => {
            const pool = get().pools[pool_];

            if (!pool || !pool.poolInstance._contract) {
                return;
            }

            pool.poolInstance._contract
                .oracleWrapper()
                .then((oracleAddress) => {
                    if (!pool.poolInstance.provider) {
                        throw new Error('cannot get oracle details, pool instance provider not available');
                    }
                    const oracle = SMAOracle__factory.connect(oracleAddress, pool.poolInstance.provider);
                    return Promise.all([oracle.numPeriods(), oracle.updateInterval()]);
                })
                .then(([numPeriods, updateInterval]) => {
                    set((state) => {
                        if (state.pools[pool_]) {
                            state.pools[pool_].oracleDetails = {
                                type: 'SMA',
                                numPeriods: numPeriods.toNumber(),
                                updateInterval: updateInterval.toNumber(),
                                isLoading: false,
                            };
                        }
                    });
                })
                .catch(() => {
                    // if error reading sma parameters, assume its a spot oracle
                    set((state) => {
                        if (state.pools[pool_]) {
                            state.pools[pool_].oracleDetails = {
                                type: 'Spot',
                                numPeriods: 0,
                                updateInterval: 0,
                                isLoading: false,
                            };
                        }
                    });
                });
        });
    },
    simulateUpdateAvgEntryPrices: (pool_) => {
        set((state) => {
            const pool = state.pools[pool_];
            if (!pool) {
                return state;
            }
            const {
                avgLongEntryPriceAggregate,
                avgLongEntryPriceWallet,
                avgShortEntryPriceWallet,
                avgShortEntryPriceAggregate,
            } = pool.userBalances.tradeStats;
            const newAvgLongPriceWallet = avgLongEntryPriceAggregate.plus(avgLongEntryPriceWallet).div(2);
            const newAvgShortPriceWallet = avgShortEntryPriceAggregate.plus(avgShortEntryPriceWallet).div(2);
            state.pools[pool_].userBalances.tradeStats = {
                ...state.pools[pool_].userBalances.tradeStats,
                avgLongEntryPriceAggregate: new BigNumber(0),
                avgShortEntryPriceAggregate: new BigNumber(0),
                avgLongEntryPriceWallet: newAvgLongPriceWallet,
                avgShortEntryPriceWallet: newAvgShortPriceWallet,
            };
        });
    },
});

export const selectSelectedPool: (state: StoreState) => IPoolsInstancesSlice['selectedPool'] = (state) =>
    state.poolsInstancesSlice.selectedPool;
export const selectPoolInstances: (state: StoreState) => IPoolsInstancesSlice['pools'] = (state) =>
    state.poolsInstancesSlice.pools;
export const selectPoolsInitialized: (state: StoreState) => IPoolsInstancesSlice['poolsInitialized'] = (state) =>
    state.poolsInstancesSlice.poolsInitialized;
export const selectPoolsInitializationError: (state: StoreState) => IPoolsInstancesSlice['poolsInitializationError'] = (
    state,
) => state.poolsInstancesSlice.poolsInitializationError;

export const selectPoolInstanceActions: (state: StoreState) => {
    setPool: IPoolsInstancesSlice['setPool'];
    setMultiplePools: IPoolsInstancesSlice['setMultiplePools'];
    resetPools: IPoolsInstancesSlice['resetPools'];
    setPoolsInitialized: IPoolsInstancesSlice['setPoolsInitialized'];
    setPoolsInitializationError: IPoolsInstancesSlice['setPoolsInitializationError'];
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
    setPoolsInitializationError: state.poolsInstancesSlice.setPoolsInitializationError,
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
    updateOracleDetails: IPoolsInstancesSlice['updateOracleDetails'];
    updateTradeStats: IPoolsInstancesSlice['updateTradeStats'];
    updateNextPoolStates: IPoolsInstancesSlice['updateNextPoolStates'];
    updatePoolCommitStats: IPoolsInstancesSlice['updatePoolCommitStats'];
    updatePoolBalancerPrices: IPoolsInstancesSlice['updatePoolBalancerPrices'];
    simulateUpdateAvgEntryPrices: IPoolsInstancesSlice['simulateUpdateAvgEntryPrices'];
} = (state) => ({
    handlePoolUpkeep: state.poolsInstancesSlice.handlePoolUpkeep,
    updatePoolBalances: state.poolsInstancesSlice.updatePoolBalances,
    updatePoolTokenBalances: state.poolsInstancesSlice.updatePoolTokenBalances,
    updateSettlementTokenBalances: state.poolsInstancesSlice.updateSettlementTokenBalances,
    updateTokenApprovals: state.poolsInstancesSlice.updateTokenApprovals,
    updateOracleDetails: state.poolsInstancesSlice.updateOracleDetails,
    updateTradeStats: state.poolsInstancesSlice.updateTradeStats,
    updateNextPoolStates: state.poolsInstancesSlice.updateNextPoolStates,
    updatePoolCommitStats: state.poolsInstancesSlice.updatePoolCommitStats,
    updatePoolBalancerPrices: state.poolsInstancesSlice.updatePoolBalancerPrices,
    simulateUpdateAvgEntryPrices: state.poolsInstancesSlice.simulateUpdateAvgEntryPrices,
});
