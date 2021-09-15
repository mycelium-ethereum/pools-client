import BigNumber from 'bignumber.js';
import { StakingRewards } from '@libs/staking/typechain/StakingRewards';
import { ERC20 } from '@tracer-protocol/perpetual-pools-contracts/types';

export type Farm = {
    name: string;
    address: string;
    contract: StakingRewards;
    stakingToken: ERC20;
    stakingTokenDecimals: number;
    apy: BigNumber;
    tvl: BigNumber;
    myStaked: BigNumber;
    myRewards: BigNumber;
    stakingTokenBalance: BigNumber;
    stakingTokenAllowance: BigNumber;
    isPoolToken: boolean;
};
