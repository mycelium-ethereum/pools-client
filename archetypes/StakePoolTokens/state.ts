export enum LeverageFilterEnum {
    One = '1x',
    Three = '3x',
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

export enum MarketFilterEnum {
    BTCUSDC = 'BTC/USDC',
    ETHUSDC = 'ETH/USDC',
    All = 'All',
}

export interface BrowseTableRowData {
    //address: Key | null | undefined;
    // address: Key | null | undefined;
    farm: string;
    APY: number;
    TVL: number;
    myStaked: number;
    myRewards: number;
    // lastPrice: number;
    // change24Hours: number;
    // rebalanceRate: number;
    // totalValueLocked: number;
    // myHoldings: number;
}

export interface BrowseState {
    search: string;
    market: MarketFilterEnum;
    leverage: LeverageFilterEnum;
    side: SideFilterEnum;
    sortBy: SortByEnum;
    filterModalOpen: boolean;
}

export type BrowseAction =
    | { type: 'setSearch'; search: string }
    | { type: 'setLeverage'; leverage: LeverageFilterEnum }
    | { type: 'setMarket'; market: MarketFilterEnum }
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
        case 'setMarket':
            return {
                ...state,
                market: action.market,
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
