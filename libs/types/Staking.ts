import { ethers } from 'ethers';
import { StakingRewards } from '@libs/staking/typechain/StakingRewards';
import { ERC20 } from '@tracer-protocol/perpetual-pools-contracts/types';

export type Farm = {
    name: string;
    address: string;
    contract: StakingRewards;
    stakingToken: ERC20;
    apy: ethers.BigNumber;
    tvl: ethers.BigNumber;
    myStaked: ethers.BigNumber;
    myRewards: ethers.BigNumber;
};
