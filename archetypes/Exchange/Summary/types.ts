import { BigNumber } from 'bignumber.js';
import { PoolInfo } from '@context/PoolContext/poolDispatch';
import { CommitActionEnum } from '@libs/constants';
import { PoolToken } from '@tracer-protocol/pools-js';

export type SummaryWrapProps = {
    showBreakdown: boolean;
    open: boolean;
    receiveIn: number;
    commitAction: CommitActionEnum;
};

export type SummaryProps = {
    pool: PoolInfo['poolInstance'];
    showBreakdown: boolean;
    amount: BigNumber;
    isLong: boolean;
    commitAction: CommitActionEnum;
    receiveIn: number;
    inputAmount: number;
    gasFee?: string;
};

type SharedProps = {
    inputAmount: SummaryProps['inputAmount'];
    amount: SummaryProps['amount'];

    tokenPrice: BigNumber;
    token: PoolToken;
    gasFee?: string;
};

export type FlipSummaryProps = {
    isLong: SummaryProps['isLong'];
    pool: SummaryProps['pool'];
} & SharedProps;

export type MintSummaryProps = {
    pool: {
        name: string;
        oraclePrice: BigNumber;
        leverage: number;
    };
} & SharedProps;

export type BurnSummaryProps = {
    pool: {
        quoteTokenSymbol: string;
    };
} & SharedProps;
