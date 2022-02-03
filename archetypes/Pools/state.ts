import { Upkeep } from '@libs/hooks/useUpkeeps';

export enum MarketFilterEnum {
    All = 'All',
    ETH = 'Ethereum',
    BTC = 'Bitcoin',
    TOKE = 'Tokemak',
    LINK = 'Chainlink',
    EUR = 'Euro',
    AAVE = 'Aave',
}

export enum DeltaEnum {
    Percentile = 0,
    Numeric = 1,
}

export enum RebalanceEnum {
    next = 0,
    last = 1,
}

export enum SortByEnum {
    Name = 'Token',
    Price = 'Price',
    EffectiveGain = 'Effective Gain',
    TotalValueLocked = 'TVL',
    MyHoldings = 'My Holdings',
}

interface BrowseTableTokenData {
    address: string;
    symbol: string;
    effectiveGain: number;
    lastTCRPrice: number;
    nextTCRPrice: number;
    balancerPrice: number;
    tvl: number;
    nextTvl: number;
    userHoldings: number;
}

export interface BrowseTableRowData {
    name: string;
    market: string;
    address: string;
    decimals: number;
    quoteTokenSymbol: string;
    leverage: number;

    lastPrice: number;
    oraclePrice: number;

    skew: number;
    nextSkew: number;

    tvl: number;
    nextTVL: number;

    shortToken: BrowseTableTokenData;
    longToken: BrowseTableTokenData;

    myHoldings: number;
    nextRebalance: number;
    frontRunning: number;

    pastUpkeep: Upkeep;
    antecedentUpkeep: Upkeep;

    keeper: string;
    committer: string;
    collateralAsset: string;
    collateralAssetAddress: string;
}

export interface BrowseState {
    search: string;
    deltaDenotion: DeltaEnum;
    marketFilter: MarketFilterEnum;
    rebalanceFocus: RebalanceEnum;
    sortBy: SortByEnum;
    filtersOpen: boolean;
    mintBurnModalOpen: boolean;
}

export type BrowseAction =
    | { type: 'setSearch'; search: string }
    | { type: 'setRebalanceFocus'; focus: RebalanceEnum }
    | { type: 'setMarketFilter'; market: MarketFilterEnum }
    | { type: 'setFiltersOpen'; open: boolean }
    | { type: 'setMintBurnModalOpen'; open: boolean }
    | { type: 'setDenotion'; denotion: DeltaEnum }
    | { type: 'setSortBy'; sortBy: SortByEnum };

export const browseReducer: (state: BrowseState, action: BrowseAction) => BrowseState = (state, action) => {
    switch (action.type) {
        case 'setRebalanceFocus':
            return {
                ...state,
                rebalanceFocus: action.focus,
            };
        case 'setSearch':
            return {
                ...state,
                search: action.search,
            };
        case 'setDenotion':
            return {
                ...state,
                deltaDenotion: action.denotion,
            };
        case 'setMarketFilter':
            return {
                ...state,
                marketFilter: action.market,
            };
        case 'setSortBy':
            return {
                ...state,
                sortBy: action.sortBy,
            };
        case 'setFiltersOpen':
            return {
                ...state,
                filtersOpen: action.open,
            };
        case 'setMintBurnModalOpen':
            return {
                ...state,
                mintBurnModalOpen: action.open,
            };
        default:
            throw new Error('Unexpected action');
    }
};
