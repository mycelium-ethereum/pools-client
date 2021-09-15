import BigNumber from 'bignumber.js';

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
    name: string;
    leverage: number;
    side: 'long' | 'short';
    apy: number;
    tvl: number;
    myStaked: number;
    myRewards: number;
    stakingTokenBalance: BigNumber;
}

export interface StakeState {
    search: string;
    leverage: LeverageFilterEnum;
    side: SideFilterEnum;
    sortBy: SortByEnum;
    stakeModalState: 'stake' | 'unstake' | 'claim' | 'closed';
    filterModalOpen: boolean;
    amount: number;
    selectedFarm: string;
    invalidAmount: { isInvalid: boolean; message?: string };
}

export type StakeAction =
    | { type: 'setSearch'; search: string }
    | { type: 'setLeverage'; leverage: LeverageFilterEnum }
    | { type: 'setSide'; side: SideFilterEnum }
    | { type: 'setFilterModalOpen'; open: boolean }
    | { type: 'setStakeModalState'; state: StakeState['stakeModalState'] }
    | { type: 'setSelectedFarm'; farm: string }
    | { type: 'setAmount'; amount: number }
    | { type: 'setInvalidAmount'; value: { isInvalid: boolean; message?: string } }
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
        case 'setStakeModalState':
            return {
                ...state,
                stakeModalState: action.state,
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
        case 'setInvalidAmount':
            return {
                ...state,
                invalidAmount: action.value,
            };
        default:
            throw new Error('Unexpected action');
    }
};
