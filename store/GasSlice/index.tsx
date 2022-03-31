import { StateSlice } from '@store/types';
import { ethers } from 'ethers';
import { StoreState } from '..';
import { IGasSlice } from './types';

export const createGasSlice: StateSlice<IGasSlice> = (set, get) => ({
    gasPrice: 0,
    fetchingGasPrice: false,
    getGasPrice: async (provider) => {
        if (get().fetchingGasPrice) {
            console.debug('Already fetching gas price');
            return;
        }
        set({ fetchingGasPrice: true });
        try {
            const gasPrice = await provider.getGasPrice();
            set({ gasPrice: parseFloat(ethers.utils.formatUnits(gasPrice, 'gwei')), fetchingGasPrice: false });
        } catch {
            set({ fetchingGasPrice: false });
        }
    },
});

export const selectGasSlice: (state: StoreState) => IGasSlice = (state) => state.gasSlice;
