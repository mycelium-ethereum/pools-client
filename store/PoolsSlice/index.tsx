import { StateSlice, StoreState } from '@store/types';
import { IPoolsSlice } from './types';

export const createPoolsSlice: StateSlice<IPoolsSlice> = (set: any) => ({
    imported: [],
    handleImport: (val: string) => {
        set((prev) => ({
            imported: [...prev.imported, { address: val }],
        }));
    },
});

export const selectHandleImport: (state: StoreState) => IPoolsSlice['handleImport'] = (state) =>
    state.poolsSlice.handleImport;
export const selectImported: (state: StoreState) => IPoolsSlice['imported'] = (state) => state.poolsSlice.imported;
