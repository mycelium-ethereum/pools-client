import BigNumber from 'bignumber.js';
import { LogoTicker } from '~/components/General';
import { PoolStatus } from './pools';
import { OnClickCommit, OverviewAsset, OverviewPoolToken } from './portfolio';

export type UnclaimedRowActions = {
    onClickCommitAction: OnClickCommit;
};
export type UnclaimedRowInfo = {
    poolName: string;
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
        poolStatus: PoolStatus;
        settlementTokenSymbol: string;
    };
