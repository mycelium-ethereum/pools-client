export enum LeverageFilterEnum {
    One = '1x',
    Two = '2x',
    Three = '3x',
    Four = '4x',
    Five = '5x',
    All = 'All',
}

export enum SideFilterEnum {
    Short = 'Short',
    Long = 'Long',
    All = 'All',
}

export enum SortByEnum {
    Name = 'Token',
    Price = 'Last Price',
    Change24Hours = '24h Change',
    RebalanceRate = 'Rebalance Rate',
    TotalValueLocked = 'TVL',
    MyHoldings = 'My Holdings',
}

export interface BrowseTableRowData {
    address: string;
    symbol: string;
    leverage: number;
    side: 'short' | 'long';
    lastPrice: number;
    change24Hours: number;
    rebalanceRate: number;
    totalValueLocked: number;
    myHoldings: number;
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
