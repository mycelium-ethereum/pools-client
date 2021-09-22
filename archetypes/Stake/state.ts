import { FarmTableDetails } from '@libs/types/Staking';
import { SideEnum } from '@libs/constants';
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
    // apr = 'apr',
    TotalValueLocked = 'TVL',
    MyStaked = 'My Staked',
    MyRewards = 'My Rewards',
}

export type FarmTableRowData = {
    farm: string;
    tokenAddress: string;
    name: string;
    leverage?: number;
    side?: SideEnum;
} & FarmTableDetails;

export interface StakeState {
    search: string;
    leverage: LeverageFilterEnum;
    side: SideFilterEnum;
    sortBy: SortByEnum;
    stakeModalState: 'stake' | 'unstake' | 'claim' | 'closed';
    filterModalOpen: boolean;
    amount: BigNumber;
    selectedFarm: string;
    invalidAmount: { isInvalid: boolean; message?: string };
    stakeModalBalance: BigNumber;
}

export type StakeAction =
    | { type: 'setSearch'; search: string }
    | { type: 'setLeverage'; leverage: LeverageFilterEnum }
    | { type: 'setSide'; side: SideFilterEnum }
    | { type: 'setFilterModalOpen'; open: boolean }
    | { type: 'setStakeModalState'; state: StakeState['stakeModalState'] }
    | { type: 'setStakeModalBalance'; balance: StakeState['stakeModalBalance'] }
    | { type: 'setSelectedFarm'; farm: string }
    | { type: 'setAmount'; amount: BigNumber }
    | { type: 'setInvalidAmount'; value: { isInvalid: boolean; message?: string } }
    | { type: 'setSortBy'; sortBy: SortByEnum }
    | { type: 'reset' };

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
        case 'setStakeModalBalance':
            return {
                ...state,
                stakeModalBalance: action.balance,
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
        case 'reset':
            return {
                ...state,
                invalidAmount: {
                    message: undefined,
                    isInvalid: false,
                },
                amount: new BigNumber(0),
                stakeModalState: 'closed',
            };
        default:
            throw new Error('Unexpected action');
    }
};
