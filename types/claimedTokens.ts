import BigNumber from 'bignumber.js';
import { KnownNetwork } from '@tracer-protocol/pools-js/types';
import { PoolStatus } from './pools';
import { OnClickCommit, OnClickStake, OverviewPoolToken } from './portfolio';

export type ClaimedRowActions = {
    onClickCommitAction: OnClickCommit;
    onClickStake: OnClickStake;
};

export type ClaimedTokenRowProps = Omit<OverviewPoolToken, 'type'> & {
    network?: KnownNetwork | undefined;
    name: string;
    poolAddress: string;
    settlementTokenSymbol: string;
    oraclePrice: BigNumber;
    effectiveGain: number;
    stakedTokens: BigNumber;
    poolStatus: PoolStatus;
    expectedExecution: number;
};
