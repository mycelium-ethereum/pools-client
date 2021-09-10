import { SideEnum } from '@libs/constants';
import { CreatedCommitType, Pool } from '@libs/types/General';
import { BigNumber } from 'bignumber.js';

export type PoolState = {
    pools: Record<string, Pool>;
    selectedPool: string | undefined;
    poolsInitialised: boolean;
};

export const initialPoolState: PoolState = {
    pools: {},
    selectedPool: undefined,
    poolsInitialised: false,
};

type Balance = {
    approved: boolean;
    balance: BigNumber;
};

export type PoolAction =
    | { type: 'setPool'; key: string; pool: Pool }
    | { type: 'setSelectedPool'; pool: string }
    | { type: 'setTokenBalances'; pool: string; shortToken: Balance; quoteToken: Balance; longToken: Balance }
    | { type: 'setPoolsInitialised'; value: boolean }
    | { type: 'setLastUpdate'; value: BigNumber; pool: string }
    | { type: 'setSubscribed'; pool: string; value: boolean }
    | { type: 'setUnexecutedCommits'; pool: string; commits: CreatedCommitType[] }
    | { type: 'setTokenApproved'; pool: string; token: 'quoteToken' | 'shortToken' | 'longToken'; value: boolean }
    | { type: 'addToPending'; pool: string; side: SideEnum; amount: BigNumber }
    | { type: 'resetPools' }
    | { type: 'resetCommits' }
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
                            ...action.shortToken,
                        },
                        longToken: {
                            ...state.pools[action.pool].longToken,
                            ...action.longToken,
                        },
                        quoteToken: {
                            ...state.pools[action.pool].quoteToken,
                            ...action.quoteToken,
                        },
                    },
                },
            };
        case 'setSubscribed':
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.pool]: {
                        ...state.pools[action.pool],
                        subscribed: action.value,
                    },
                },
            };
        case 'setUnexecutedCommits':
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.pool]: {
                        ...state.pools[action.pool],
                        committer: {
                            ...state.pools[action.pool].committer,
                            allUnexecutedCommits: action.commits,
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
        case 'addToPending':
            const committer = state.pools[action.pool].committer;
            if (action.side === SideEnum.short) {
                committer.pendingShort = committer.pendingShort.plus(action.amount);
            } else {
                committer.pendingLong = committer.pendingLong.plus(action.amount);
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
                            approved: action.value,
                        },
                    },
                },
            };
        case 'setSelectedPool':
            return {
                ...state,
                selectedPool: action.pool,
            };
        default:
            throw new Error('Unexpected action');
    }
};
