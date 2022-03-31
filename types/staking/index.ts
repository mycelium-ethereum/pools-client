import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { ERC20 } from '@tracer-protocol/perpetual-pools-contracts/types';
import { StakingRewards } from './typechain/StakingRewards';

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
    bptFarms: FarmInfo[];
    balancerVaultAddress: string;
    // lookup from known token addresses to Chainink price feed address
    // https://docs.chain.link/docs/arbitrum-price-feeds/
    knownUSDCPriceFeeds: {
        [address: string]: string;
    };
    sushiRouterAddress: string;
    stakingRewardTokens?: {
        [key: string]: {
            address: string;
            decimals: number;
        };
    };
};
