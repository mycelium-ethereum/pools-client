import { CommitEnum } from '@libs/constants';
import { PendingAmounts, Pool } from '@libs/types/General';
import { BigNumber } from 'bignumber.js';

const MAX_RETRY_COUNT = 5;

export type PoolState = {
    pools: Record<string, Pool>;
    subscriptions: Record<string, boolean>;
    selectedPool: string | undefined;
    poolsInitialised: boolean;
    retryCount: number;
};

export const initialPoolState: PoolState = {
    pools: {},
    selectedPool: undefined,
    poolsInitialised: false,
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
    | { type: 'setLastUpdate'; value: BigNumber; pool: string }
    | { type: 'setTokenApproved'; pool: string; token: 'quoteToken' | 'shortToken' | 'longToken'; value: BigNumber }
    | { type: 'setPendingAmounts'; pool: string; pendingLong: PendingAmounts; pendingShort: PendingAmounts }
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
        case 'setNextPoolBalances':
            if (!state.pools[action.pool]) {
                return state;
            }
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
            if (!state.pools[action.pool]) {
                return state;
            }
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.pool]: {
                        ...state.pools[action.pool],
                        shortToken: {
                            ...state.pools[action.pool].shortToken,
                            approvedAmount: action.shortTokenAmount,
                        },
                        longToken: {
                            ...state.pools[action.pool].longToken,
                            approvedAmount: action.longTokenAmount,
                        },
                        quoteToken: {
                            ...state.pools[action.pool].quoteToken,
                            approvedAmount: action.quoteTokenAmount,
                        },
                    },
                },
            };
        case 'setLastUpdate':
            if (!state.pools[action.pool]) {
                return state;
            }
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
            const committer = state.pools[action.pool]?.committer;
            if (committer) {
                switch (action.commitType) {
                    case CommitEnum.short_burn:
                        committer.pendingShort.burn = committer.pendingShort.burn.plus(action.amount);
                        break;
                    case CommitEnum.short_mint:
                        committer.pendingShort.mint = committer.pendingShort.mint.plus(action.amount);
                        break;
                    case CommitEnum.long_burn:
                        committer.pendingLong.burn = committer.pendingLong.burn.plus(action.amount);
                        break;
                    case CommitEnum.long_mint:
                        committer.pendingLong.mint = committer.pendingLong.mint.plus(action.amount);
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
            } else {
                return state;
            }
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
