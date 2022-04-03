import { StaticPoolInfo } from '@tracer-protocol/pools-js';
import { StateSlice } from '~/store/types';
import { getAllPoolLists, flattenAllPoolLists } from '~/utils/poolLists';
import { IPoolsSlice } from './types';
import { StoreState } from '..';

export const createPoolsSlice: StateSlice<IPoolsSlice> = (set, get) => ({
    poolLists: {},
    setPoolLists: (network, lists) => {
        set((state) => void (state.poolLists[network] = lists));
    },
    importPool: (network, pool) => {
        if (get().poolLists[network]) {
            set((state) => void state.poolLists[network]?.Imported.pools.push({ address: pool }));
            // set(state => void (state.poolLists[network]?.All.push({ address: pool })))
        }
    },
    fetchPoolLists: async (network) => {
        // if list not already set for this network
        if (!get().poolLists[network]) {
            const poolLists = await getAllPoolLists(network).catch((err) => console.error(err));
            if (!poolLists) {
                console.error('Failed to initialise pools: poolsList undefined');
                return;
            }
            set((state) => void (state.poolLists[network] = poolLists));
        }
    },
});

export const selectAllPools: (state: StoreState) => StaticPoolInfo[] = (state) =>
    state.web3Slice.network ? flattenAllPoolLists(state.poolsSlice.poolLists[state.web3Slice.network]) : [];

export const selectImportedPools: (state: StoreState) => StaticPoolInfo[] = (state) =>
    state.web3Slice.network ? state.poolsSlice.poolLists[state.web3Slice.network]?.Imported?.pools ?? [] : [];

export const selectFetchPools: (state: StoreState) => IPoolsSlice['fetchPoolLists'] = (state) =>
    state.poolsSlice.fetchPoolLists;
export const selectImportPool: (state: StoreState) => IPoolsSlice['importPool'] = (state) =>
    state.poolsSlice.importPool;
