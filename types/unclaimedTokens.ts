import BigNumber from 'bignumber.js';
import { LogoTicker } from '~/components/General';
import { OnClickCommit, OverviewAsset, OverviewPoolToken } from './portfolio';

/* Unclaimed tokens */
export type UnclaimedRowActions = {
    onClickCommitAction: OnClickCommit;
};
export type UnclaimedRowInfo = {
    poolName: string; // pool name
    poolAddress: string;
    marketTicker: LogoTicker;
    claimableLongTokens: OverviewPoolToken;
    claimableShortTokens: OverviewPoolToken;
    claimableSettlementTokens: OverviewAsset;
    claimableSum: BigNumber;
    numClaimable: number;
};

export type UnclaimedRowProps = UnclaimedRowInfo & UnclaimedRowActions;

export type UnclaimedPoolTokenRowProps = OverviewPoolToken &
    UnclaimedRowActions & {
        poolAddress: UnclaimedRowProps['poolAddress'];
        settlementTokenSymbol: string;
    };
