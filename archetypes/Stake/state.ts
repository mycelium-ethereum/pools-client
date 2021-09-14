import { ethers } from 'ethers';
import { Farm } from '@libs/types/Staking';

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
    availableToStake: ethers.BigNumber;
}

export interface StakeState {
    search: string;
    leverage: LeverageFilterEnum;
    side: SideFilterEnum;
    sortBy: SortByEnum;
    stakeModalOpen: boolean;
    filterModalOpen: boolean;
    amount: number;
    selectedFarm: Farm;
    invalidAmount: { isInvalid: boolean; message?: string };
}

export type StakeAction =
    | { type: 'setSearch'; search: string }
    | { type: 'setLeverage'; leverage: LeverageFilterEnum }
    | { type: 'setSide'; side: SideFilterEnum }
    | { type: 'setFilterModalOpen'; open: boolean }
    | { type: 'setStakeModalOpen'; open: boolean }
    | { type: 'setSelectedFarm'; farm: Farm }
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
        case 'setStakeModalOpen':
            return {
                ...state,
                stakeModalOpen: action.open,
            };
        case 'setSelectedFarm':
            console.log('SETTING SELECTED FARM', action.farm);
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
