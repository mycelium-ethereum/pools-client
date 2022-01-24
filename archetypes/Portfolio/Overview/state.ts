import {LogoTicker} from '@components/General';
import { MarketFilterEnum } from '@libs/types/General';
import BigNumber from 'bignumber.js';


export enum DenotedInEnum {
    BASE = 'BASE',
    USD = 'USD',
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
    pool: string, // pool name
    marketTicker: LogoTicker;
    claimableAssets: ClaimableAsset[];
}

export type ClaimableAsset = {
    symbol: string;
    balance: number;
    price: number;
    token: string;
    notionalValue: number;
    unrealisedPNL: number;
}

export interface PortfolioState {
    positionsDenotedIn: DenotedInEnum;
    escrowMarketFilter: MarketFilterEnum;
    escrowSearch: string;
}

export const initialPortfolioState = {
    escrowSearch: "",
    escrowMarketFilter: MarketFilterEnum.All,
    positionsDenotedIn: DenotedInEnum.BASE
}

export type PortfolioAction =
    | { type: 'setEscrowSearch'; search: string }
    | { type: 'setEscrowMarketFilter'; market: MarketFilterEnum }
    | { type: 'setDenotion'; denotedIn: DenotedInEnum }

export const portfolioReducer: (state: PortfolioState, action: PortfolioAction) => PortfolioState= (state, action) => {
    switch (action.type) {
        case 'setEscrowSearch':
            return {
                ...state,
                search: action.search,
            };
        case 'setEscrowMarketFilter':
            return {
                ...state,
                marketFilter: action.market,
            };
        case 'setDenotion':
            return {
                ...state,
                positionsDenotedIn: action.denotedIn,
            };
        default:
            throw new Error('Unexpected action');
    }
};
