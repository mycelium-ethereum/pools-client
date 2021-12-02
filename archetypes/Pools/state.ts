export enum MarketFilterEnum {
    All = 'All',
    ETH = 'Ethereum',
    BTC = 'Bitcoin',
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
}
export interface BrowseTableRowData {
    name: string;
    address: string;
    decimals: number;
    leverage: number;

    skew: number;
    nextSkew: number;

    tvl: number;
    nextTVL: number;

    shortToken: BrowseTableTokenData;
    longToken: BrowseTableTokenData;

    myHoldings: number;
    nextRebalance: number;
    frontRunning: number;
}

export interface BrowseState {
    search: string;
    marketFilter: MarketFilterEnum;
    rebalanceFocus: RebalanceEnum;
    sortBy: SortByEnum;
    filterModalOpen: boolean;
    mintBurnModalOpen: boolean;
}

export type BrowseAction =
    | { type: 'setSearch'; search: string }
    | { type: 'setRebalanceFocus'; focus: RebalanceEnum }
    | { type: 'setMarketFilter'; market: MarketFilterEnum }
    | { type: 'setFilterModalOpen'; open: boolean }
    | { type: 'setMintBurnModalOpen'; open: boolean }
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
        case 'setFilterModalOpen':
            return {
                ...state,
                filterModalOpen: action.open,
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
