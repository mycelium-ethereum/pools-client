import { Pool } from '@libs/types/General';
import { BigNumber } from 'bignumber.js';

export type PoolState = {
    pools: Record<string, Pool>,
    selectedPool: string | undefined,
    poolsInitialised: boolean,
};

export const initialPoolState: PoolState = {
    pools: {},
    selectedPool: undefined,
    poolsInitialised: false
};

export type PoolAction =
    | { type: 'setPool'; key: string, pool: Pool }
    | { type: 'setSelectedPool'; pool: string }
    | { type: 'setTokenBalances'; 
        pool: string ,
        shortToken: BigNumber,
        quoteToken: BigNumber,
        longToken: BigNumber
    }
	| { type: 'setPoolsInitialised'; value: boolean}
    | { type: 'setNextRebalance'; nextRebalance: number };

export const reducer: (state: PoolState, action: PoolAction) => PoolState = (state, action) => {
    switch (action.type) {
        case 'setPool':
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.key]: action.pool
                }
            }
        case 'setTokenBalances':
            return {
                ...state,
                pools: {
                    ...state.pools,
                    [action.pool]: {
                        ...state.pools[action.pool],
                        shortToken: {
                            ...state.pools[action.pool].shortToken,
                            balance: action.shortToken
                        },
                        longToken: {
                            ...state.pools[action.pool].longToken,
                            balance: action.longToken
                        },
                        quoteToken: {
                            ...state.pools[action.pool].quoteToken,
                            balance: action.quoteToken
                        }
                    }
                }
            }
        case 'setPoolsInitialised':
            return {
                ...state,
                poolsInitialised: action.value
            }
        case 'setSelectedPool':
            return {
                ...state,
                selectedPool: action.pool
            }
        default:
            throw new Error('Unexpected action');
    }
};
