import BigNumber from 'bignumber.js';
import { Upkeep } from '~/hooks/useUpkeeps';
import { MarketFilterEnum, LeverageFilterEnum, CollateralFilterEnum, SortByEnum } from '~/types/filters';

export enum DeltaEnum {
    Percentile = 0,
    Numeric = 1,
}

export enum RebalanceEnum {
    next = 0,
    last = 1,
    historic = 2,
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
    userHoldings: number;
}

export interface BrowseTableRowData {
    name: string;
    marketSymbol: string;
    address: string;
    decimals: number;
    settlementTokenSymbol: string;
    leverage: number;

    lastPrice: number;
    oraclePrice: number;

    skew: number;
    nextSkew: number;

    tvl: number;
    nextTVL: number;
    oneDayVolume: BigNumber;

    shortToken: BrowseTableTokenData;
    longToken: BrowseTableTokenData;

    myHoldings: number;

    isWaitingForUpkeep: boolean;
    expectedExecution: number;

    pastUpkeep: Upkeep;
    antecedentUpkeep: Upkeep;

    keeper: string;
    committer: string;
    collateralAsset: string;
    collateralAssetAddress: string;
}

export interface BrowseState {
    search: string;
    deltaDenotation: DeltaEnum;
    marketFilter: MarketFilterEnum;
    collateralFilter: CollateralFilterEnum;
    leverageFilter: LeverageFilterEnum;
    rebalanceFocus: RebalanceEnum;
    sortBy: SortByEnum;
    filtersOpen: boolean;
    mintBurnModalOpen: boolean;
    addAltPoolModalOpen: boolean;
}

export type BrowseAction =
    | { type: 'setSearch'; search: string }
    | { type: 'setRebalanceFocus'; focus: RebalanceEnum }
    | { type: 'setMarketFilter'; market: MarketFilterEnum }
    | { type: 'setCollateralFilter'; collateral: CollateralFilterEnum }
    | { type: 'setLeverageFilter'; leverage: LeverageFilterEnum }
    | { type: 'setMintBurnModalOpen'; open: boolean }
    | { type: 'setAddAltPoolModalOpen'; open: boolean }
    | { type: 'setDenotation'; denotation: DeltaEnum }
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
        case 'setDenotation':
            return {
                ...state,
                deltaDenotation: action.denotation,
            };
        case 'setMarketFilter':
            return {
                ...state,
                marketFilter: action.market,
            };
        case 'setCollateralFilter':
            return {
                ...state,
                collateralFilter: action.collateral,
            };
        case 'setLeverageFilter':
            return {
                ...state,
                leverageFilter: action.leverage,
            };
        case 'setSortBy':
            return {
                ...state,
                sortBy: action.sortBy,
            };
        case 'setMintBurnModalOpen':
            return {
                ...state,
                mintBurnModalOpen: action.open,
            };
        case 'setAddAltPoolModalOpen':
            return {
                ...state,
                addAltPoolModalOpen: action.open,
            };
        default:
            throw new Error('Unexpected action');
    }
};
