import { StateSlice, StoreState } from '@store/types';
import { IPoolsSlice, Imported } from './types';

export const createPoolsSlice: StateSlice<IPoolsSlice, IPoolsSlice> = (set: any) => ({
    imported: [],
    handleImport: (val: Imported) => {
        set((prev: IPoolsSlice) => ({
            imported: [...prev.imported, val],
        }));
    },
});

export const selectHandleImport: (state: StoreState) => IPoolsSlice['handleImport'] = (state) =>
    state.poolsSlice.handleImport;
export const selectImported: (state: StoreState) => IPoolsSlice['imported'] = (state) => state.poolsSlice.imported;
