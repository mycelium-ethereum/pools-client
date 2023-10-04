import BigNumber from 'bignumber.js';
import { KnownNetwork } from '@tracer-protocol/pools-js/types';
import { PoolStatus } from './pools';
import { OnClickV1BurnAll, OverviewPoolToken } from './portfolio';

export type PoolsV1TokenRowActions = {
    onClickV1BurnAll: OnClickV1BurnAll;
};

export type PoolsV1TokenRowProps = Omit<OverviewPoolToken, 'type'> & {
    network?: KnownNetwork | undefined;
    name: string;
    poolAddress: string;
    poolCommitterAddress: string;
    commitType: number,
    settlementTokenSymbol: string;
    oraclePrice: BigNumber;
    effectiveGain: number;
    stakedTokens: BigNumber;
    poolStatus: PoolStatus;
    expectedExecution: number;
    tokenName: string;
    settlementTokenName: string;
};
