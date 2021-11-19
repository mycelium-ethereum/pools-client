import { DEFAULT_POOLSTATE } from '@libs/constants/pool';
import Pool from '@tracer-protocol/pools-js/entities/pool';
import { BigNumber } from 'bignumber.js';

const MAX_RETRY_COUNT = 5;

export type PoolInfo = {
    poolInstance: Pool;
    userBalances: {
        shortToken: TokenBalance;
        longToken: TokenBalance;
        quoteToken: TokenBalance;
    };
};

type TokenBalance = {
    approvedAmount: BigNumber;
    balance: BigNumber;
};

export type PoolState = {
    pools: Record<string, PoolInfo>;
    subscriptions: Record<string, boolean>;
    selectedPool: string | undefined;
    poolsInitialised: boolean;
    triggerUpdate: boolean;
    retryCount: number;
};

export const initialPoolState: PoolState = {
    pools: {},
    selectedPool: undefined,
    poolsInitialised: false,
    triggerUpdate: false,
    retryCount: 0,
    subscriptions: {},
};

export type PoolAction =
    | { type: 'setPool'; key: string; pool: Pool }
    | {
          type: 'setTokenBalances';
          pool: string;
          shortTokenBalance: BigNumber;
          quoteTokenBalance: BigNumber;
          longTokenBalance: BigNumber;
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
    // | { type: 'addToPending'; pool: string; commitType: CommitEnum; amount: BigNumber }
    | { type: 'resetPools' }
    | { type: 'triggerUpdate' }
    // | { type: 'setNextPoolBalances'; pool: string; nextLongBalance: BigNumber; nextShortBalance: BigNumber }
    | { type: 'setNextRebalance'; nextRebalance: number };

export const reducer: (state: PoolState, action: PoolAction) => PoolState = (state, action) => {
    switch (action.type) {
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
        // // case 'setNextPoolBalances':
        //     if (!state.pools[action.pool]) {
        //         return state;
        //     }
        //     return {
        //         ...state,
        //         pools: {
        //             ...state.pools,
        //             [action.pool]: {
        //                 ...state.pools[action.pool],
        //                 nextLongBalance: action.nextLongBalance,
        //                 nextShortBalance: action.nextShortBalance,
        //             },
        //         },
        //     };
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
        // case 'addToPending':
        //     const committer = state.pools[action.pool]?.committer;
        //     if (committer) {
        //         switch (action.commitType) {
        //             case CommitEnum.short_burn:
        //                 committer.pendingShort.burn = committer.pendingShort.burn.plus(action.amount);
        //                 break;
        //             case CommitEnum.short_mint:
        //                 committer.pendingShort.mint = committer.pendingShort.mint.plus(action.amount);
        //                 break;
        //             case CommitEnum.long_burn:
        //                 committer.pendingLong.burn = committer.pendingLong.burn.plus(action.amount);
        //                 break;
        //             case CommitEnum.long_mint:
        //                 committer.pendingLong.mint = committer.pendingLong.mint.plus(action.amount);
        //                 break;
        //             default:
        //                 break;
        //         }
        //         return {
        //             ...state,
        //             pools: {
        //                 ...state.pools,
        //                 [action.pool]: {
        //                     ...state.pools[action.pool],
        //                     committer: {
        //                         ...committer,
        //                     },
        //                 },
        //             },
        //         };
        //     } else {
        //         return state;
        //     }
        case 'setPoolsInitialised':
            return {
                ...state,
                poolsInitialised: action.value,
            };
        case 'triggerUpdate':
            return {
                ...state,
                triggerUpdate: !state.triggerUpdate,
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
