export enum LeverageFilterEnum {
    All = 'All',
    One = '1',
    Three = '3',
}

export enum SideFilterEnum {
    All = 'All',
    Short = 'Short',
    Long = 'Long',
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

    rebalanceRate: number;
    nextRebalanceRate: number;

    myHoldings: number;
    nextRebalance: number;
    frontRunning: number;
}

export interface BrowseState {
    search: string;
    leverage: LeverageFilterEnum;
    side: SideFilterEnum;
    rebalanceFocus: RebalanceEnum;
    sortBy: SortByEnum;
    filterModalOpen: boolean;
    mintBurnModalOpen: boolean;
}

export type BrowseAction =
    | { type: 'setSearch'; search: string }
    | { type: 'setLeverage'; leverage: LeverageFilterEnum }
    | { type: 'setRebalanceFocus'; focus: RebalanceEnum }
    | { type: 'setSide'; side: SideFilterEnum }
    | { type: 'setFilterModalOpen'; open: boolean }
    | { type: 'setMintBurnModalOpen'; open: boolean }
    | { type: 'setSortBy'; sortBy: SortByEnum };

export const browseReducer: (state: BrowseState, action: BrowseAction) => BrowseState = (state, action) => {
    switch (action.type) {
        case 'setLeverage':
            return {
                ...state,
                leverage: action.leverage,
            };
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
        case 'setSide':
            return {
                ...state,
                side: action.side,
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
