import { withLenses, lens } from '@dhmk/zustand-lens';
import produce, { Draft } from 'immer';
import create, { GetState, Mutate, SetState, StateCreator, StoreApi } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { createENSSlice } from './ENSSlice';
import { IENSSlice } from './ENSSlice/types';
import { createGasSlice } from './GasSlice';
import { IGasSlice } from './GasSlice/types';
import { createMarketSpotPricesSlice } from './MarketSpotPricesSlice';
import { IMarketSpotPricesSlice } from './MarketSpotPricesSlice/types';
import { createPendingCommitSlice } from './PendingCommitSlice';
import { IPendingCommitSlice } from './PendingCommitSlice/types';
import { createPoolsInstancesSlice } from './PoolInstancesSlice';
import { IPoolsInstancesSlice } from './PoolInstancesSlice/types';
import { createPoolsSlice } from './PoolsSlice';
import { IPoolsSlice } from './PoolsSlice/types';
import { createThemeSlice } from './ThemeSlice';
import { IThemeSlice } from './ThemeSlice/types';
import { createTransactionSlice } from './TransactionSlice';
import { ITransactionSlice } from './TransactionSlice/types';
import { StoreState } from './types';
import { createUnsupportedNetwork } from './UnsupportedNetworkSlice';
import { IUnsupportedNetworkSlice } from './UnsupportedNetworkSlice/types';
import { createWeb3Slice } from './Web3Slice';
import { IWeb3Slice } from './Web3Slice/types';

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
                poolsInstancesSlice: lens<IPoolsInstancesSlice>(createPoolsInstancesSlice),
                web3Slice: lens<IWeb3Slice>(createWeb3Slice),
                gasSlice: lens<IGasSlice>(createGasSlice),
                unsupportedNetworkSlice: lens<IUnsupportedNetworkSlice>(createUnsupportedNetwork),
                pendingCommitSlice: lens<IPendingCommitSlice>(createPendingCommitSlice),
                ensSlice: lens<IENSSlice>(createENSSlice),
                marketSpotPricesSlice: lens<IMarketSpotPricesSlice>(createMarketSpotPricesSlice),
            })),
        ),
    ),
);
