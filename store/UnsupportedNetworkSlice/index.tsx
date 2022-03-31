import { StateSlice } from '@store/types';
import { StoreState } from '..';
import { IUnsupportedNetworkSlice } from './types';

export const createUnsupportedNetwork: StateSlice<IUnsupportedNetworkSlice> = (set) => ({
    unsupportedNetworkPopupRef: undefined,
    setUnsupportedNetworkPopupRef: (unsupportedNetworkPopupRef) => {
        set({ unsupportedNetworkPopupRef });
    },
});

export const selectUnsupportedNetworkRef: (state: StoreState) => IUnsupportedNetworkSlice = (state) =>
    state.unsupportedNetworkSlice;
