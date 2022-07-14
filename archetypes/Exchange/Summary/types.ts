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
    showTokenImage?: boolean;
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
    mintingFee: BigNumber;
    burningFee: BigNumber;
    annualFeePercent: string;
} & SharedProps;

export type MintSummaryProps = {
    isLong: SummaryProps['isLong'];
    pool: {
        name: string;
        oraclePrice: BigNumber;
        leverage: number;
        settlementTokenSymbol: string;
    };
    mintingFee: BigNumber;
    burningFee: BigNumber;
    annualFeePercent: string;
} & SharedProps;

export type BurnSummaryProps = {
    pool: {
        settlementTokenSymbol: string;
    };
    burningFee: BigNumber;
} & SharedProps;

export type BaseSection = {
    showTransactionDetails: boolean;
};
