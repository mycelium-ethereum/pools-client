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

export enum SortByEnum {
    Name = 'Token',
    Price = 'Price',
    RebalanceRate = 'Rebalancing Rate',
    TotalValueLocked = 'TVL',
    MyHoldings = 'My Holdings',
}

export interface BrowseTableRowData {
    address: string;
    decimals: number;
    pool: string;
    symbol: string;
    leverage: number;
    side: 'short' | 'long';
    lastPrice: number;
    rebalanceRate: number;
    totalValueLocked: number;
    myHoldings: number;
    nextRebalance: number;
}

export interface BrowseState {
    search: string;
    leverage: LeverageFilterEnum;
    side: SideFilterEnum;
    sortBy: SortByEnum;
    filterModalOpen: boolean;
}

export type BrowseAction =
    | { type: 'setSearch'; search: string }
    | { type: 'setLeverage'; leverage: LeverageFilterEnum }
    | { type: 'setSide'; side: SideFilterEnum }
    | { type: 'setModalOpen'; open: boolean }
    | { type: 'setSortBy'; sortBy: SortByEnum };

export const browseReducer: (state: BrowseState, action: BrowseAction) => BrowseState = (state, action) => {
    switch (action.type) {
        case 'setLeverage':
            return {
                ...state,
                leverage: action.leverage,
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
        case 'setModalOpen':
            return {
                ...state,
                filterModalOpen: action.open,
            };
        default:
            throw new Error('Unexpected action');
    }
};
