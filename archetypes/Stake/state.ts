export enum LeverageFilterEnum {
    All = 'All',
    One = '1',
    Three = '3',
}

export enum SideFilterEnum {
    Short = 'Short',
    Long = 'Long',
    All = 'All',
}

export enum SortByEnum {
    Name = 'Token',
    APY = 'APY',
    TotalValueLocked = 'TVL',
    MyStaked = 'My Staked',
    MyRewards = 'My Rewards',
}

export interface FarmTableRowData {
    farm: string;
    tokenSymbol: string;
    leverage: number;
    side: 'long' | 'short';
    apy: number;
    tvl: number;
    myStaked: number;
    myRewards: number;
}

export interface StakeState {
    search: string;
    leverage: LeverageFilterEnum;
    side: SideFilterEnum;
    sortBy: SortByEnum;
    stakeModalOpen: boolean;
    filterModalOpen: boolean;
    amount: number;
}

export type StakeAction =
    | { type: 'setSearch'; search: string }
    | { type: 'setLeverage'; leverage: LeverageFilterEnum }
    | { type: 'setSide'; side: SideFilterEnum }
    | { type: 'setFilterModalOpen'; open: boolean }
    | { type: 'setStakeModalOpen'; open: boolean }
    | { type: 'setSelectedFarm'; farm: FarmTableRowData }
    | { type: 'setAmount'; amount: number }
    | { type: 'setSortBy'; sortBy: SortByEnum };

export const stakeReducer: (state: StakeState, action: StakeAction) => StakeState = (state, action) => {
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
        case 'setFilterModalOpen':
            return {
                ...state,
                filterModalOpen: action.open,
            };
        case 'setStakeModalOpen':
            return {
                ...state,
                stakeModalOpen: action.open,
            };
        case 'setSelectedFarm':
            return {
                ...state,
                selectedFarm: action.farm,
            };
        case 'setAmount':
            return {
                ...state,
                amount: action.amount,
            };
        default:
            throw new Error('Unexpected action');
    }
};
