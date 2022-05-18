import { StateSlice } from '~/store/types';
import { IMarketSpotPricesSlice } from './types';
import { StoreState } from '..';

export const createMarketSpotPricesSlice: StateSlice<IMarketSpotPricesSlice> = (set) => ({
    marketSpotPrices: {},

    setMarketSpotPrices: (marketSpotPrices) => {
        set((state) => {
            state.marketSpotPrices = marketSpotPrices;
        });
    },
});

export const selectMarketSpotPrices: (state: StoreState) => IMarketSpotPricesSlice['marketSpotPrices'] = (state) =>
    state.marketSpotPricesSlice.marketSpotPrices;

export const selectMarketSpotPricesActions: (state: StoreState) => {
    setMarketSpotPrices: IMarketSpotPricesSlice['setMarketSpotPrices'];
} = (state) => ({
    setMarketSpotPrices: state.marketSpotPricesSlice.setMarketSpotPrices,
});
