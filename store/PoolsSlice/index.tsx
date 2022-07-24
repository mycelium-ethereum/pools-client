import { StaticPoolInfo } from '@tracer-protocol/pools-js';
import { StateSlice } from '~/store/types';
import { getAllPoolLists } from '~/utils/poolLists';
import { IPoolsSlice } from './types';
import { StoreState } from '..';

export const createPoolsSlice: StateSlice<IPoolsSlice> = (set, get) => ({
    poolLists: {},
    setPoolLists: (network, lists) => {
        set((state) => void (state.poolLists[network] = lists));
    },
    importPool: (network, poolAddress) => {
        if (get().poolLists[network]) {
            set((state) => void state.poolLists[network]?.Imported.pools.push({ address: poolAddress }));
        }
    },
    removePool: (network, poolAddress) => {
        if (get().poolLists[network]) {
            const poolIndex = get().poolLists[network]?.Imported.pools.findIndex((v) => v.address === poolAddress);
            if (typeof poolIndex === 'number' && poolIndex >= 0) {
                set((state) => void state.poolLists[network]?.Imported.pools.splice(poolIndex, 1));
            }
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
    getExistingPoolLists: (network) => {
        return get().poolLists[network];
    },
});

export const selectImportedPools: (state: StoreState) => StaticPoolInfo[] = (state) =>
    state.web3Slice.network ? state.poolsSlice.poolLists[state.web3Slice.network]?.Imported?.pools ?? [] : [];
export const selectFetchPools: (state: StoreState) => IPoolsSlice['fetchPoolLists'] = (state) =>
    state.poolsSlice.fetchPoolLists;
export const selectGetPools: (state: StoreState) => IPoolsSlice['getExistingPoolLists'] = (state) =>
    state.poolsSlice.getExistingPoolLists;
export const selectRemovePool: (state: StoreState) => IPoolsSlice['removePool'] = (state) =>
    state.poolsSlice.removePool;
export const selectImportPool: (state: StoreState) => IPoolsSlice['importPool'] = (state) =>
    state.poolsSlice.importPool;
