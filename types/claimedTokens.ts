import BigNumber from 'bignumber.js';
import { OnClickCommit, OnClickStake, OverviewPoolToken } from './portfolio';

export type ClaimedRowActions = {
    onClickCommitAction: OnClickCommit;
    onClickStake: OnClickStake;
};

export type ClaimedTokenRowProps = Omit<OverviewPoolToken, 'type'> & {
    name: string;
    poolAddress: string;
    settlementTokenSymbol: string;
    oraclePrice: BigNumber;
    effectiveGain: number;
    stakedTokens: BigNumber;
};
