import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { ERC20 } from '@tracer-protocol/perpetual-pools-contracts/types';
import { StakingRewards } from './typechain/StakingRewards';
import { PoolStatus } from '../pools';

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
    poolDetails: {
        poolTokenPrice: BigNumber;
        address: string;
        status: PoolStatus;
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

type FarmInfo = {
    address: string;
    abi: ethers.ContractInterface;
    pool: string;
    balancerPoolId?: string;
    link?: string;
    linkText?: string;
    rewardsEnded?: boolean;
};

export type FarmConfig = {
    poolFarms: FarmInfo[];
    sushiRouterAddress: string;
    stakingRewardTokens?: {
        [key: string]: {
            address: string;
            decimals: number;
        };
    };
};
