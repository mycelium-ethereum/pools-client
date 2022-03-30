import { StateSlice } from '@store/types';
import { IGasSlice } from './types';

export const createGasSlice: StateSlice<IGasSlice> = (_set, get) => ({
    gasPrice: 0,
    fetchingGasPrice: false,
    getGasPrice: async () => {
        if (get().fetchingGasPrice) {
            return;
        }
    },
});
