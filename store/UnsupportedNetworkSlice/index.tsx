import { StateSlice } from '~/store/types';
import { IUnsupportedNetworkSlice } from './types';
import { StoreState } from '..';

export const createUnsupportedNetwork: StateSlice<IUnsupportedNetworkSlice> = (set) => ({
    unsupportedNetworkPopupRef: undefined,
    setUnsupportedNetworkPopupRef: (unsupportedNetworkPopupRef) => {
        set({ unsupportedNetworkPopupRef });
    },
});

export const selectUnsupportedNetworkRef: (state: StoreState) => IUnsupportedNetworkSlice = (state) =>
    state.unsupportedNetworkSlice;
