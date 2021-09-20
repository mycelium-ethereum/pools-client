import BigNumber from 'bignumber.js';
import { StakingRewards } from '@libs/staking/typechain/StakingRewards';
import { ERC20 } from '@tracer-protocol/perpetual-pools-contracts/types';

type SlpPairTokenDetails = {
    address: string;
    name: string;
    isPoolToken: boolean;
    reserves: BigNumber;
    usdcPrice: BigNumber;
    decimals: number;
};

export type Farm = {
    name: string;
    address: string;
    contract: StakingRewards;
    stakingToken: ERC20;
    stakingTokenDecimals: number;
    totalStaked: BigNumber;
    // tvl: BigNumber;
    myStaked: BigNumber;
    myRewards: BigNumber;
    stakingTokenBalance: BigNumber;
    stakingTokenAllowance: BigNumber;
    stakingTokenSupply: BigNumber;
    rewardsPerYear: BigNumber;
    isPoolTokenFarm: boolean;
    slpDetails?: {
        token0: SlpPairTokenDetails;
        token1: SlpPairTokenDetails;
    };
};
