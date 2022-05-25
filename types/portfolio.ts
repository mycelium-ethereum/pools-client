import BigNumber from 'bignumber.js';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import { TokenType } from '~/archetypes/Portfolio/state';

export type PortfolioOverview = {
    totalPortfolioValue: BigNumber;
    unrealisedProfit: BigNumber;
    realisedProfit: BigNumber;
    portfolioDelta: number; //percentage change
};

export type OnClickStake = (token: string) => void;
export type OnClickCommit = (pool: string, side: SideEnum, action: CommitActionEnum, unclaimed?: boolean) => void;

/* General Overview types */
export type OverviewAsset = {
    symbol: string;
    balance: BigNumber;
    address: string;
    decimals: number;
    currentTokenPrice: BigNumber;
    type: TokenType;
    leveragedNotionalValue: BigNumber;
};

export type OverviewPoolToken = {
    entryPrice: BigNumber;
    side: SideEnum;
} & OverviewAsset;
