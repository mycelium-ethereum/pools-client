import BigNumber from 'bignumber.js';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import { TokenType } from '~/archetypes/Portfolio/state';

export type PortfolioOverview = {
    totalPortfolioValue: BigNumber;
};

export type OnClickStake = (token: string, action: 'stake' | 'unstake') => void;
export type OnClickCommit = (pool: string, side: SideEnum, action: CommitActionEnum, unclaimed?: boolean) => void;
export type OnClickV1BurnAll = (
    poolCommitter: string, 
    commitType: number, 
    amount: string,
    tokenName: string,
    tokenAddress: string,
    settlementTokenName: string
) => void;

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
