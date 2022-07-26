import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { providers } from '@0xsequence/multicall';
import { ERC20, ERC20__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
import { KnownNetwork, StaticPoolInfo } from '@tracer-protocol/pools-js';
import { deprecatedPools } from '~/constants/deprecatedPools';
import { PoolStatus } from '~/types/pools';
import { FarmConfig, Farm } from '~/types/staking';
import { StakingRewards } from '~/types/staking/typechain';
import { fetchBPTPrice } from '~/utils/balancer';
import { fetchPPTokenPrice } from '~/utils/farms';

export interface FixedLengthArray<L extends number, T> extends ArrayLike<T> {
    length: L;
}

// Chunk an array into n elements
export const chunk = function* <T>(arr: T[], n: number): Generator<T[], void, unknown> {
    for (let i = 0; i < arr.length; i += n) {
        yield arr.slice(i, i + n);
    }
};

export type StakingRewardsInfo = {
    userStaked: ethers.BigNumber;
    stakingTokenAddr: string;
    userRewards: ethers.BigNumber;
    rewardsPerWeek: ethers.BigNumber;
    rewardTokenAddr: string;
    totalStaked: ethers.BigNumber;
    contract: StakingRewards;
};

// Get staking rewards info using multicall + transform results into hashtable
export const getStakingRewardsInfo = async (
    farmInfo: FarmConfig['poolFarms'],
    account: string,
    multicallProvider: providers.MulticallProvider,
): Promise<Record<string, StakingRewardsInfo>> => {
    const callArray: Promise<ethers.BigNumber | string | number>[] = [];
    const numberOfCalls = 6;

    for (const farm of farmInfo) {
        const { address, abi } = farm;

        const contract = new ethers.Contract(address, abi, multicallProvider) as StakingRewards;
        const calls: FixedLengthArray<typeof numberOfCalls, Promise<ethers.BigNumber | string | number>> = [
            contract.balanceOf(account),
            contract.stakingToken(),
            contract.earned(account),
            contract.getRewardForDuration(),
            contract.rewardsToken(),
            contract.totalSupply(),
        ] as const;

        callArray.push(...(calls as typeof callArray));
    }

    const stakingRewardsResponses = await Promise.all(callArray);
    const chunkedStakingRewardsResponses = [...chunk(stakingRewardsResponses, numberOfCalls)] as [
        ethers.BigNumber,
        string, // staking token
        ethers.BigNumber,
        ethers.BigNumber,
        string, //reward token
        ethers.BigNumber,
    ][]; //Same length as numberOfCalls;

    return chunkedStakingRewardsResponses.reduce(
        (a, e, i) => ({
            ...a,
            [farmInfo[i].address]: {
                userStaked: e[0],
                stakingTokenAddr: e[1],
                userRewards: e[2],
                rewardsPerWeek: e[3],
                rewardTokenAddr: e[4],
                totalStaked: e[5],
                contract: new ethers.Contract(
                    farmInfo[i].address,
                    farmInfo[i].abi,
                    multicallProvider,
                ) as StakingRewards,
            },
        }),
        {} as Record<string, StakingRewardsInfo>,
    );
};

export type TokenCallsInfo = {
    stakingSymbol: string;
    stakingDecimals: number;
    stakingBalance: ethers.BigNumber;
    stakingAllowance: ethers.BigNumber;
    rewardDecimals: number;
    stakingSupply: ethers.BigNumber;
    stakingToken: ERC20;
};

export const getTokenCallsInfo = async (
    stakingRewardsLookup: Record<string, StakingRewardsInfo>,
    farmInfo: FarmConfig['poolFarms'],
    account: string,
    multicallProvider: providers.MulticallProvider,
): Promise<Record<string, TokenCallsInfo>> => {
    const callArray: Promise<ethers.BigNumber | string | number>[] = [];
    const numberOfTokenCalls = 6;
    for (const farm of farmInfo) {
        const { address } = farm;
        const stakingRewards = stakingRewardsLookup[address];

        if (!stakingRewards) {
            continue;
        }
        const { stakingTokenAddr, rewardTokenAddr } = stakingRewards;

        const stakingToken = ERC20__factory.connect(stakingTokenAddr, multicallProvider as ethers.providers.Provider);
        const rewardsToken = ERC20__factory.connect(rewardTokenAddr, multicallProvider as ethers.providers.Provider);

        const tokenCalls: FixedLengthArray<typeof numberOfTokenCalls, Promise<ethers.BigNumber | string | number>> = [
            stakingToken.symbol(),
            stakingToken.decimals(),
            stakingToken.balanceOf(account),
            stakingToken.allowance(account, address),
            rewardsToken.decimals(),
            stakingToken.totalSupply(),
        ] as const;

        callArray.push(...(tokenCalls as typeof callArray));
    }

    const tokenCallResponses = await Promise.all(callArray);
    const chunkedTokenCallResponses = [...chunk(tokenCallResponses, numberOfTokenCalls)] as [
        string,
        number,
        ethers.BigNumber,
        ethers.BigNumber,
        number,
        ethers.BigNumber,
    ][]; //Same length as numberOfTokenCalls

    return chunkedTokenCallResponses.reduce(
        (a, e, i) => ({
            ...a,
            [farmInfo[i].address]: {
                stakingSymbol: e[0],
                stakingDecimals: e[1],
                stakingBalance: e[2],
                stakingAllowance: e[3],
                rewardDecimals: e[4],
                stakingSupply: e[5],
                stakingToken: ERC20__factory.connect(
                    stakingRewardsLookup[farmInfo[i].address].stakingTokenAddr,
                    multicallProvider as ethers.providers.Provider,
                ),
            },
        }),
        {} as Record<string, TokenCallsInfo>,
    );
};

export const aggregateInfo = async (
    stakingRewardsLookup: Record<string, StakingRewardsInfo>,
    tokenCallsLookup: Record<string, TokenCallsInfo>,
    farmInfo: FarmConfig['poolFarms'],
    network: KnownNetwork | undefined,
    staticPoolInfo: StaticPoolInfo[],
    multicallProvider: providers.MulticallProvider,
): Promise<Record<string, Farm>> => {
    const farmLookup: Record<string, Farm> = {};

    for (const farm of farmInfo) {
        const { address, pool, name, isBPTFarm } = farm;
        const stakingRewards = stakingRewardsLookup[address];
        const tokenCalls = tokenCallsLookup[address];

        if (!stakingRewards || !tokenCalls) {
            continue;
        }

        const poolInfo = staticPoolInfo.find((poolInfo) => poolInfo.address === pool);

        const totalStaked = new BigNumber(
            ethers.utils.formatUnits(stakingRewards.totalStaked, tokenCalls.stakingDecimals),
        );

        const poolAddress = poolInfo?.address || pool;

        const poolDetails = {
            name: name || poolInfo?.name || poolInfo?.address || poolAddress,
            address: poolAddress,
            status: network && deprecatedPools?.[network]?.[poolAddress] ? PoolStatus.Deprecated : PoolStatus.Live,
        };

        const stakingDecimalMultiplier = 10 ** tokenCalls.stakingDecimals;
        const rewardsDecimalMultiplier = 10 ** tokenCalls.rewardDecimals;

        // totalEmittedTokensPerYear x priceOfRewardsTokens) / (totalSupply x priceOfStakingTokens
        const stakingTokenSupply = new BigNumber(tokenCalls.stakingSupply.toString()).div(stakingDecimalMultiplier);

        let stakingTokenPrice = new BigNumber(0);
        let tvl = new BigNumber(0);

        if (poolInfo) {
            const { balancerPoolId } = farm;
            stakingTokenPrice =
                isBPTFarm && balancerPoolId
                    ? await fetchBPTPrice(poolInfo, balancerPoolId, multicallProvider, stakingTokenSupply)
                    : await fetchPPTokenPrice(poolInfo, stakingRewards.stakingTokenAddr, multicallProvider);

            tvl = stakingTokenPrice.times(totalStaked);
        }

        const { rewardsEnded, link, linkText } = farm;
        farmLookup[address] = {
            name: isBPTFarm ? `${name || poolInfo?.name || poolAddress} Balancer LP` : name || tokenCalls.stakingSymbol,
            address,
            contract: stakingRewards.contract,
            totalStaked,
            stakingToken: tokenCalls.stakingToken,
            stakingTokenSymbol: tokenCalls.stakingSymbol,
            stakingTokenDecimals: tokenCalls.stakingDecimals,
            stakingTokenBalance: new BigNumber(tokenCalls.stakingBalance.toString()).div(stakingDecimalMultiplier),
            stakingTokenAllowance: new BigNumber(tokenCalls.stakingAllowance.toString()).div(stakingDecimalMultiplier),
            stakingTokenSupply,
            stakingTokenPrice,
            myStaked: new BigNumber(stakingRewards.userStaked.toString()).div(stakingDecimalMultiplier),
            myRewards: new BigNumber(stakingRewards.userRewards.toString()).div(rewardsDecimalMultiplier),
            rewardsPerYear: new BigNumber(stakingRewards.rewardsPerWeek.toString())
                .div(rewardsDecimalMultiplier)
                .times(52),
            poolDetails,
            tvl,
            link,
            linkText,
            rewardsEnded: Boolean(rewardsEnded),
            rewardsTokenAddress: stakingRewards.rewardTokenAddr,
            isBPTFarm: Boolean(isBPTFarm),
        };
    }

    return farmLookup;
};
