import { KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';
import {
    CollateralFilterEnum,
    LeverageFilterEnum,
    MarketFilterEnum,
    SideFilterEnum,
    SortByEnum,
    StakeSortByEnum,
} from '~/types/filters';

export const MARKET_FILTERS: Partial<Record<KnownNetwork, MarketFilterEnum[]>> = {
    [NETWORKS.ARBITRUM]: [
        MarketFilterEnum.All,
        MarketFilterEnum.ETH,
        MarketFilterEnum.BTC,
        MarketFilterEnum.WTI,
        MarketFilterEnum.TRUFLATION,
    ],
    [NETWORKS.ARBITRUM_RINKEBY]: [MarketFilterEnum.All, MarketFilterEnum.ETH, MarketFilterEnum.BTC],
};

export const COLLATERAL_FILTERS: Partial<Record<KnownNetwork, CollateralFilterEnum[]>> = {
    [NETWORKS.ARBITRUM]: [CollateralFilterEnum.All, CollateralFilterEnum.USDC],
    [NETWORKS.ARBITRUM_RINKEBY]: [CollateralFilterEnum.All, CollateralFilterEnum.PPUSD],
};

export const LEVERAGE_FILTERS: Partial<Record<KnownNetwork, LeverageFilterEnum[]>> = {
    [NETWORKS.ARBITRUM]: [LeverageFilterEnum.All, LeverageFilterEnum.Three],
    [NETWORKS.ARBITRUM_RINKEBY]: [LeverageFilterEnum.All, LeverageFilterEnum.Three],
};

export const SIDE_OPTIONS = Object.values(SideFilterEnum).map((key) => ({ key: key }));

export const SORT_BY_OPTIONS = Object.values(SortByEnum).map((key) => ({ key: key }));

export const STAKE_SORT_BY_OPTIONS = Object.values(StakeSortByEnum).map((key) => ({ key: key }));
