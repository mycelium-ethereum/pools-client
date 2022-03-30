import { LogoTicker } from '@components/General';
import { MarketFilterEnum } from '~/types/filters';
import BigNumber from 'bignumber.js';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';

export enum DenotedInEnum {
    BASE = 'BASE',
    USD = 'USD',
}

export enum TokenType {
    Short = 0,
    Long = 1,
    Settlement = 2,
}

export type TokenRowProps = {
    poolAddress: string;
    address: string;
    name: string;
    decimals: number;
    symbol: string;
    side: number;
    holdings: BigNumber;
    price: BigNumber;
    deposits: BigNumber; // amount of USDC deposited
    oraclePrice: BigNumber;
};

export interface EscrowRowProps {
    poolName: string; // pool name
    poolAddress: string;
    marketTicker: LogoTicker;
    claimableLongTokens: ClaimablePoolToken;
    claimableShortTokens: ClaimablePoolToken;
    claimableSettlementTokens: ClaimableAsset;
    claimableSum: BigNumber;
    numClaimable: number;
    onClickCommitAction: (pool: string, side: SideEnum, action: CommitActionEnum) => void;
}

export type EntryPrice = {
    tokenPrice: BigNumber;
    basePrice: BigNumber;
};

export type ClaimableAsset = {
    symbol: string;
    balance: BigNumber;
    currentTokenPrice: BigNumber;
    type: TokenType;
    token: string;
    notionalValue: BigNumber;
};
export type ClaimablePoolToken = {
    entryPrice: EntryPrice;
    onClickCommitAction: (pool: string, side: SideEnum, action: CommitActionEnum) => void;
    poolAddress: string;
} & ClaimableAsset;

export interface PortfolioState {
    positionsDenotedIn: DenotedInEnum;
    escrowMarketFilter: MarketFilterEnum;
    escrowSearch: string;
}

export const initialPortfolioState = {
    escrowSearch: '',
    escrowMarketFilter: MarketFilterEnum.All,
    positionsDenotedIn: DenotedInEnum.BASE,
};

export type PortfolioAction =
    | { type: 'setEscrowSearch'; search: string }
    | { type: 'setEscrowMarketFilter'; market: MarketFilterEnum }
    | { type: 'setDenotation'; denotedIn: DenotedInEnum };

export const portfolioReducer: (state: PortfolioState, action: PortfolioAction) => PortfolioState = (state, action) => {
    switch (action.type) {
        case 'setEscrowSearch':
            return {
                ...state,
                search: action.search,
            };
        case 'setEscrowMarketFilter':
            return {
                ...state,
                escrowMarketFilter: action.market,
            };
        case 'setDenotation':
            return {
                ...state,
                positionsDenotedIn: action.denotedIn,
            };
        default:
            throw new Error('Unexpected action');
    }
};
