import { MarketSpotPriceLookup } from '~/types/marketSpotPrices';

export interface IMarketSpotPricesSlice {
    marketSpotPrices: MarketSpotPriceLookup;
    setMarketSpotPrices: (marketSpotPrices: MarketSpotPriceLookup) => void;
}
