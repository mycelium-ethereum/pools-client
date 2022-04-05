import { BigNumber } from 'bignumber.js';
import { CommitActionEnum, PoolToken } from '@tracer-protocol/pools-js';
import { PoolInfo } from '~/types/pools';

export type SummaryProps = {
    pool: PoolInfo['poolInstance'];
    showBreakdown: boolean;
    amount: BigNumber;
    isLong: boolean;
    commitAction: CommitActionEnum;
    receiveIn: number;
    gasFee: BigNumber;
};

type SharedProps = {
    amount: SummaryProps['amount'];
    gasFee: SummaryProps['gasFee'];

    nextTokenPrice: BigNumber;
    token: PoolToken;
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
        settlementTokenSymbol: string;
    };
} & SharedProps;

export type BaseSection = {
    showTransactionDetails: boolean;
};
