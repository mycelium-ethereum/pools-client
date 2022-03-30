import create, { GetState, Mutate, SetState, StateCreator, StoreApi } from 'zustand';
import produce, { Draft } from 'immer';
import { withLenses, lens } from '@dhmk/zustand-lens';
import { createTransactionSlice } from './TransactionSlice';
import { createThemeSlice } from './ThemeSlice';
import { StoreState } from './types';
import { createPoolsSlice } from './PoolsSlice';
import { createWeb3Slice } from './Web3Slice';
import { ITransactionSlice } from './TransactionSlice/types';
import { IThemeSlice } from './ThemeSlice/types';
import { IPoolsSlice } from './PoolsSlice/types';
import { IWeb3Slice } from './Web3Slice/types';
import { subscribeWithSelector } from 'zustand/middleware';
// import {IGasSlice} from './GasSlice/types';
// import {createGasSlice} from './GasSlice';

// Turn the set method into an immer proxy
const immer =
    <
        T extends StoreState,
        CustomSetState extends SetState<T> = SetState<T>,
        CustomGetState extends GetState<T> = GetState<T>,
        CustomStoreApi extends StoreApi<T> = StoreApi<T>,
    >(
        config: StateCreator<
            T,
            (partial: ((draft: Draft<T>) => void) | T, replace?: boolean) => void,
            CustomGetState,
            CustomStoreApi
        >,
    ): StateCreator<T, CustomSetState, CustomGetState, CustomStoreApi> =>
    (set, get, api) =>
        config(
            (partial, replace) => {
                const nextState =
                    typeof partial === 'function' ? produce(partial as (state: Draft<T>) => T) : (partial as T);
                return set(nextState, replace);
            },
            get,
            api,
        );

// can lens each entry or leave as blank
export const useStore = create<
    StoreState,
    SetState<StoreState>,
    GetState<StoreState>,
    Mutate<StoreApi<StoreState>, [['zustand/subscribeWithSelector', never]]>
>(
    subscribeWithSelector(
        immer(
            withLenses(() => ({
                transactionSlice: lens<ITransactionSlice>(createTransactionSlice),
                themeSlice: lens<IThemeSlice>(createThemeSlice),
                poolsSlice: lens<IPoolsSlice>(createPoolsSlice),
                web3Slice: lens<IWeb3Slice>(createWeb3Slice),
                // gasSlice: lens<IGasSlice>(createGasSlice)
                // }
            })),
        ),
    ),
);
