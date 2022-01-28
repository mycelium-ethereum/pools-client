import BigNumber from 'bignumber.js';
import { StakingRewards } from '@libs/staking/typechain/StakingRewards';
import { ERC20 } from '@tracer-protocol/perpetual-pools-contracts/types';

export type BalancerPoolAsset = {
    address: string;
    symbol: string;
    isPoolToken: boolean;
    reserves: BigNumber;
    usdPrice: BigNumber;
    decimals: number;
};

export type FarmTableDetails = {
    totalStaked: BigNumber;
    tvl: BigNumber;
    myStaked: BigNumber;
    myRewards: BigNumber;
    stakingTokenBalance: BigNumber;
    stakingTokenSupply: BigNumber;
    rewardsPerYear: BigNumber;
    rewardsEnded: boolean;
    rewardsTokenAddress: string;
    link?: string;
    linkText?: string;
    bptDetails?: {
        tokens: BalancerPoolAsset[];
    };
    poolDetails?: {
        poolTokenPrice: BigNumber;
    };
};

export type Farm = {
    name: string;
    address: string;
    contract: StakingRewards;
    stakingToken: ERC20;
    stakingTokenDecimals: number;
    stakingTokenAllowance: BigNumber;
} & FarmTableDetails;
