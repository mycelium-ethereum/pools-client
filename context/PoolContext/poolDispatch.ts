import { CommitEnum } from '@libs/constants';
import { Committer, PendingAmounts, Pool } from '@libs/types/General';
import { BigNumber } from 'bignumber.js';

export type PoolState = {
    pools: Record<string, Pool>;
    subscriptions: Record<string, boolean>;
    selectedPool: string | undefined;
    poolsInitialised: boolean;
};

export const initialPoolState: PoolState = {
    pools: {},
    selectedPool: undefined,
    poolsInitialised: false,
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
    | { type: 'setLastUpdate'; value: BigNumber; pool: string }
    | { type: 'setTokenApproved'; pool: string; token: 'quoteToken' | 'shortToken' | 'longToken'; value: BigNumber }
    | { type: 'setPendingAmounts'; pool: string; pendingLong: PendingAmounts; pendingShort: PendingAmounts }
    | { type: 'setUserCommits'; pool: string; commitAmounts: Committer['user'] }
    | { type: 'addToPending'; pool: string; commitType: CommitEnum; amount: BigNumber }
    | { type: 'resetPools' }
    | { type: 'setNextPoolBalances'; pool: string; nextLongBalance: BigNumber; nextShortBalance: BigNumber }
    | { type: 'setNextRebalance'; nextRebalance: number };

export const reducer: (state: PoolState, action: PoolAction) => PoolState = (state, action) => {
    switch (action.type) {
        case 'setPool':
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.key]: action.pool,
                },
            };
        case 'resetPools':
            return {
                ...state,
                pools: {},
                poolsInitialised: false,
                subscriptions: {},
            };
        case 'setNextPoolBalances':
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.pool]: {
                        ...state.pools[action.pool],
                        nextLongBalance: action.nextLongBalance,
                        nextShortBalance: action.nextShortBalance,
                    },
                },
            };
        case 'setUserCommits':
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.pool]: {
                        ...state.pools[action.pool],
                        committer: {
                            ...state.pools[action.pool].committer,
                            user: action.commitAmounts
                        }
                    },
                },
            };
        case 'setTokenBalances':
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.pool]: {
                        ...state.pools[action.pool],
                        shortToken: {
                            ...state.pools[action.pool].shortToken,
                            balance: action.shortTokenBalance,
                        },
                        longToken: {
                            ...state.pools[action.pool].longToken,
                            balance: action.longTokenBalance,
                        },
                        quoteToken: {
                            ...state.pools[action.pool].quoteToken,
                            balance: action.quoteTokenBalance,
                        },
                    },
                },
            };
        case 'setTokenApprovals':
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.pool]: {
                        ...state.pools[action.pool],
                        shortToken: {
                            ...state.pools[action.pool].shortToken,
                            approvedAmount: action.shortTokenAmount,
                            // .gte(state.pools[action.pool].shortToken.balance),
                        },
                        longToken: {
                            ...state.pools[action.pool].longToken,
                            approvedAmount: action.longTokenAmount,
                            // gte(state.pools[action.pool].longToken.balance),
                        },
                        quoteToken: {
                            ...state.pools[action.pool].quoteToken,
                            approvedAmount: action.quoteTokenAmount,
                            // .gte(state.pools[action.pool].quoteToken.balance),
                        },
                    },
                },
            };
        case 'setLastUpdate':
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.pool]: {
                        ...state.pools[action.pool],
                        lastUpdate: action.value,
                    },
                },
            };
        case 'setPendingAmounts':
            console.debug(`Setting pending amounts on ${action.pool}`, state.pools);
            const currentCommitter = state.pools[action.pool]?.committer;
            if (currentCommitter) {
                return {
                    ...state,
                    pools: {
                        ...state.pools,
                        [action.pool]: {
                            ...state.pools[action.pool],
                            committer: {
                                ...currentCommitter,
                                pendingLong: action.pendingLong,
                                pendingShort: action.pendingShort,
                            },
                        },
                    },
                };
            } else {
                return state;
            }
        case 'addToPending':
            const committer = state.pools[action.pool].committer;
            switch (action.commitType) {
                case CommitEnum.short_burn:
                    committer.global.pendingShort.burn = committer.global.pendingShort.burn.plus(action.amount);
                    break;
                case CommitEnum.short_mint:
                    committer.global.pendingShort.mint = committer.global.pendingShort.mint.plus(action.amount);
                    break;
                case CommitEnum.long_burn:
                    committer.global.pendingLong.burn = committer.global.pendingLong.burn.plus(action.amount);
                    break;
                case CommitEnum.long_mint:
                    committer.global.pendingLong.mint = committer.global.pendingLong.mint.plus(action.amount);
                    break;
                default:
                    break;
            }
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.pool]: {
                        ...state.pools[action.pool],
                        committer: {
                            ...committer,
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
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.pool]: {
                        ...state.pools[action.pool],
                        [action.token]: {
                            ...state.pools[action.pool][action.token],
                            approvedAmount: action.value,
                        },
                    },
                },
            };
        default:
            throw new Error('Unexpected action');
    }
};
