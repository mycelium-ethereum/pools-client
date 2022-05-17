import { LogoTicker } from '~/components/General';
import {
    CollateralFilterEnum,
    LeverageFilterEnum,
    MarketFilterEnum,
    SideFilterEnum,
    SortByEnum,
    StakeSortByEnum,
} from '~/types/filters';

export const MARKET_FILTER_OPTIONS = Object.keys(MarketFilterEnum).map((key) => ({
    key: (MarketFilterEnum as any)[key],
    ticker: (key !== 'All' ? key : '') as LogoTicker,
}));

export const COLLATERAL_FILTER_OPTIONS = Object.keys(CollateralFilterEnum).map((key) => ({
    key: (CollateralFilterEnum as any)[key],
}));

export const LEVERAGE_FILTER_OPTIONS = Object.keys(LeverageFilterEnum).map((key) => ({
    key: (LeverageFilterEnum as any)[key],
}));

export const SIDE_OPTIONS = Object.values(SideFilterEnum).map((key) => ({ key: key }));

export const SORT_BY_OPTIONS = Object.values(SortByEnum).map((key) => ({ key: key }));

export const STAKE_SORT_BY_OPTIONS = Object.values(StakeSortByEnum).map((key) => ({ key: key }));
