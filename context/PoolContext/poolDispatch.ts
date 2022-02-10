import { DEFAULT_POOLSTATE } from '@libs/constants/pool';
import { AggregateBalances } from '@libs/types/General';
import { BigNumber } from 'bignumber.js';
import Pool from '@tracer-protocol/pools-js/entities/pool';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { PoolLists } from '@libs/services/poolList';

const MAX_RETRY_COUNT = 5;

export type PoolInfo = {
    poolInstance: Pool;
    userBalances: {
        shortToken: TokenBalance;
        longToken: TokenBalance;
        quoteToken: TokenBalance;
        aggregateBalances: AggregateBalances;
    };
};

type TokenBalance = {
    approvedAmount: BigNumber;
    balance: BigNumber;
};

export type PoolState = {
    poolsLists: Partial<Record<KnownNetwork, PoolLists>>;
    pools: Record<string, PoolInfo>;
    subscriptions: Record<string, boolean>;
    selectedPool: string | undefined;
    poolsInitialised: boolean;
    retryCount: number;
};

export const initialPoolState: PoolState = {
    pools: {},
    poolsLists: {},
    selectedPool: undefined,
    poolsInitialised: false,
    retryCount: 0,
    subscriptions: {},
};

export type PoolAction =
    | { type: 'setPool'; key: string; pool: Pool }
    | { type: 'setPoolLists'; network: KnownNetwork; lists: PoolLists }
    | {
          type: 'setTokenBalances';
          pool: string;
          shortTokenBalance: BigNumber;
          quoteTokenBalance: BigNumber;
          longTokenBalance: BigNumber;
      }
    | {
          type: 'setAggregateBalances';
          pool: string;
          aggregateBalances: AggregateBalances;
      }
    | {
          type: 'setTokenApprovals';
          pool: string;
          shortTokenAmount: BigNumber;
          quoteTokenAmount: BigNumber;
          longTokenAmount: BigNumber;
      }
    | { type: 'setPoolsInitialised'; value: boolean }
    | { type: 'incrementRetryCount' }
    | { type: 'setTokenApproved'; pool: string; token: 'quoteToken' | 'shortToken' | 'longToken'; value: BigNumber }
    | { type: 'resetPools' }
    | {
          type: 'setUpdatedPoolBalances';
          pool: string;
          lastPrice: BigNumber;
          oraclePrice: BigNumber;
          longBalance: BigNumber;
          shortBalance: BigNumber;
          lastUpdate: BigNumber;
      }
    | { type: 'setNextRebalance'; nextRebalance: number };

export const reducer: (state: PoolState, action: PoolAction) => PoolState = (state, action) => {
    switch (action.type) {
        case 'setPoolLists':
            return {
                ...state,
                poolsLists: {
                    ...state.poolsLists,
                    [action.network]: action.lists,
                },
            };
        case 'setPool':
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.key]: {
                        poolInstance: action.pool,
                        userBalances: DEFAULT_POOLSTATE.userBalances,
                    },
                },
            };
        case 'incrementRetryCount': {
            if (state.retryCount >= MAX_RETRY_COUNT) {
                return state;
            } else {
                return {
                    ...state,
                    retryCount: state.retryCount + 1,
                };
            }
        }
        case 'resetPools':
            return {
                ...state,
                pools: {},
                poolsInitialised: false,
                subscriptions: {},
                retryInit: false,
            };
        case 'setUpdatedPoolBalances':
            if (!state.pools[action.pool]) {
                return state;
            }
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.pool]: {
                        ...state.pools[action.pool],
                        lastUpdate: action.lastUpdate,
                        lastPrice: action.lastPrice,
                        longBalance: action.longBalance,
                        shortBalance: action.shortBalance,
                        nextLongBalance: action.longBalance,
                        nextShortBalance: action.shortBalance,
                        oraclePrice: action.oraclePrice,
                    },
                },
            };
        case 'setTokenBalances':
            if (!state.pools[action.pool]) {
                return state;
            }
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.pool]: {
                        ...state.pools[action.pool],
                        userBalances: {
                            ...state.pools[action.pool].userBalances,
                            shortToken: {
                                ...state.pools[action.pool].userBalances.shortToken,
                                balance: action.shortTokenBalance,
                            },
                            longToken: {
                                ...state.pools[action.pool].userBalances.longToken,
                                balance: action.longTokenBalance,
                            },
                            quoteToken: {
                                ...state.pools[action.pool].userBalances.quoteToken,
                                balance: action.quoteTokenBalance,
                            },
                        },
                    },
                },
            };
        case 'setAggregateBalances':
            if (!state.pools[action.pool]) {
                return state;
            }
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.pool]: {
                        ...state.pools[action.pool],
                        userBalances: {
                            ...state.pools[action.pool].userBalances,
                            aggregateBalances: action.aggregateBalances,
                        },
                    },
                },
            };
        case 'setTokenApprovals':
            if (!state.pools[action.pool]) {
                return state;
            }
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.pool]: {
                        ...state.pools[action.pool],
                        userBalances: {
                            ...state.pools[action.pool].userBalances,
                            shortToken: {
                                ...state.pools[action.pool].userBalances.shortToken,
                                approvedAmount: action.shortTokenAmount,
                            },
                            longToken: {
                                ...state.pools[action.pool].userBalances.longToken,
                                approvedAmount: action.longTokenAmount,
                            },
                            quoteToken: {
                                ...state.pools[action.pool].userBalances.quoteToken,
                                approvedAmount: action.quoteTokenAmount,
                            },
                        },
                    },
                },
            };
        case 'setPoolsInitialised':
            return {
                ...state,
                poolsInitialised: action.value,
            };
        case 'setTokenApproved':
            if (!state.pools[action.pool]) {
                return state;
            }
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.pool]: {
                        ...state.pools[action.pool],
                        userBalances: {
                            ...state.pools[action.pool].userBalances,
                            [action.token]: {
                                ...state.pools[action.pool].userBalances[action.token],
                                approvedAmount: action.value,
                            },
                        },
                    },
                },
            };
        default:
            throw new Error('Unexpected action');
    }
};
