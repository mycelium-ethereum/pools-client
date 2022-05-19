import BigNumber from 'bignumber.js';
import { SideEnum } from '@tracer-protocol/pools-js';
import {
    CollateralFilterEnum,
    LeverageFilterEnum,
    MarketFilterEnum,
    SideFilterEnum,
    StakeSortByEnum,
} from '~/types/filters';
import { FarmTableDetails } from '~/types/staking';

export type FarmTableRowData = {
    farm: string;
    tokenAddress: string;
    name: string;
    leverage?: number;
    side?: SideEnum;
} & FarmTableDetails;

export interface StakeState {
    searchFilter: string;
    leverageFilter: LeverageFilterEnum;
    sideFilter: SideFilterEnum;
    marketFilter: MarketFilterEnum;
    collateralFilter: CollateralFilterEnum;

    sortBy: StakeSortByEnum;
    stakeModalState: 'stake' | 'unstake' | 'claim' | 'closed';
    amount: BigNumber;
    selectedFarm: string;
    invalidAmount: { isInvalid: boolean; message?: string };
    stakeModalBalance: BigNumber;
    maxDecimals: number;
}

export type StakeAction =
    | { type: 'setSearchFilter'; search: string }
    | { type: 'setLeverageFilter'; leverage: LeverageFilterEnum }
    | { type: 'setCollateralFilter'; collateral: CollateralFilterEnum }
    | { type: 'setMarketFilter'; market: MarketFilterEnum }
    | { type: 'setSideFilter'; side: SideFilterEnum }
    | { type: 'setStakeModalState'; state: StakeState['stakeModalState'] }
    | { type: 'setStakeModalBalance'; balance: StakeState['stakeModalBalance'] }
    | { type: 'setSelectedFarm'; farm: string }
    | { type: 'setAmount'; amount: BigNumber }
    | { type: 'setInvalidAmount'; value: { isInvalid: boolean; message?: string } }
    | { type: 'setSortBy'; sortBy: StakeSortByEnum }
    | { type: 'setMaxDecimals'; value: number }
    | { type: 'reset' };

export const stakeReducer: (state: StakeState, action: StakeAction) => StakeState = (state, action) => {
    switch (action.type) {
        case 'setLeverageFilter':
            return {
                ...state,
                leverageFilter: action.leverage,
            };
        case 'setSearchFilter':
            return {
                ...state,
                searchFilter: action.search,
            };
        case 'setSideFilter':
            return {
                ...state,
                sideFilter: action.side,
            };
        case 'setCollateralFilter':
            return {
                ...state,
                collateralFilter: action.collateral,
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
        case 'setMaxDecimals':
            return {
                ...state,
                maxDecimals: action.value,
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
