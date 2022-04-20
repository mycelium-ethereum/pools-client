import BigNumber from 'bignumber.js';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import { LogoTicker } from '~/components/General';
import { MarketFilterEnum } from '~/types/filters';

export enum DenotedInEnum {
    BASE = 'BASE',
    USD = 'USD',
}

export enum CommitTypeFilter {
    All = 'All',
    Mint = 'Mint',
    Burn = 'Burn',
    Flip = 'Flip',
}

export enum TokenType {
    Short = 'Short',
    Long = 'Long',
    Settlement = 'Settlement',
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
    notionalValue: BigNumber;
    deposits: BigNumber; // amount of USDC deposited
    oraclePrice: BigNumber;
    effectiveGain: number;
    acquisitionCost: BigNumber;
    pnl: BigNumber;
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

export type ClaimableAsset = {
    symbol: string;
    balance: BigNumber;
    currentTokenPrice: BigNumber;
    type: TokenType;
    notionalValue: BigNumber;
};
export type ClaimablePoolToken = {
    entryPrice: BigNumber;
    side: SideEnum;
} & ClaimableAsset;

export type ClaimablePoolTokenRowProps = ClaimablePoolToken & {
    poolAddress: EscrowRowProps['poolAddress'];
    onClickCommitAction: EscrowRowProps['onClickCommitAction'];
};

export interface PortfolioState {
    escrowSearch: string;
    escrowMarketFilter: MarketFilterEnum;
    queuedCommitsSearch: string;
    queuedCommitsFilter: CommitTypeFilter;
    historicCommitsSearch: string;
    historicCommitsFilter: CommitTypeFilter;
    positionsDenotedIn: DenotedInEnum;
    claimedTokensMarketFilter: MarketFilterEnum;
    claimedTokensSearch: string;
}

export const initialPortfolioState = {
    escrowSearch: '',
    escrowMarketFilter: MarketFilterEnum.All,
    queuedCommitsSearch: '',
    queuedCommitsFilter: CommitTypeFilter.All,
    historicCommitsSearch: '',
    historicCommitsFilter: CommitTypeFilter.All,
    claimedTokensSearch: '',
    claimedTokensMarketFilter: MarketFilterEnum.All,
    positionsDenotedIn: DenotedInEnum.USD,
};

export type PortfolioAction =
    | { type: 'setEscrowSearch'; search: string }
    | { type: 'setEscrowMarketFilter'; market: MarketFilterEnum }
    | { type: 'setQueuedCommitsSearch'; search: string }
    | { type: 'setQueuedCommitsFilter'; filter: CommitTypeFilter }
    | { type: 'setHistoricCommitsSearch'; search: string }
    | { type: 'setHistoricCommitsFilter'; filter: CommitTypeFilter }
    | { type: 'setClaimedTokensSearch'; search: string }
    | { type: 'setClaimedTokensMarketFilter'; market: MarketFilterEnum }
    | { type: 'setDenotation'; denotedIn: DenotedInEnum };

export const portfolioReducer: (state: PortfolioState, action: PortfolioAction) => PortfolioState = (state, action) => {
    switch (action.type) {
        case 'setEscrowSearch':
            return {
                ...state,
                escrowSearch: action.search,
            };
        case 'setEscrowMarketFilter':
            return {
                ...state,
                escrowMarketFilter: action.market,
            };
        case 'setQueuedCommitsSearch':
            return {
                ...state,
                queuedCommitsSearch: action.search,
            };
        case 'setQueuedCommitsFilter':
            return {
                ...state,
                queuedCommitsFilter: action.filter,
            };
        case 'setHistoricCommitsSearch':
            return {
                ...state,
                historicCommitsSearch: action.search,
            };
        case 'setHistoricCommitsFilter':
            return {
                ...state,
                historicCommitsFilter: action.filter,
            };
        case 'setClaimedTokensSearch':
            return {
                ...state,
                claimedTokensSearch: action.search,
            };
        case 'setClaimedTokensMarketFilter':
            return {
                ...state,
                claimedTokensMarketFilter: action.market,
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
