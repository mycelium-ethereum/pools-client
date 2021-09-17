import React, { useContext, useEffect, useState } from 'react';
import { Children } from 'libs/types/General';
import { useWeb3 } from '../Web3Context/Web3Context';
import { ethers } from 'ethers';
import { Farm } from '@libs/types/Staking';
import { StakingRewards } from '@libs/staking/typechain';
import { ERC20, ERC20__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
import BigNumber from 'bignumber.js';

type FarmsLookup = { [address: string]: Farm };
interface ContextProps {
    poolFarms: FarmsLookup;
    slpFarms: FarmsLookup;
    refreshFarm: (farmAddress: string) => void;
    fetchingFarms: boolean;
}

export const FarmContext = React.createContext<ContextProps>({
    poolFarms: {},
    slpFarms: {},
    refreshFarm: () => console.error('default FarmContext.refreshFarm'),
    fetchingFarms: false,
});

/**
 * Wrapper store for the FarmContext.
 */
export const FarmStore: React.FC<Children> = ({ children }: Children) => {
    const { signer, config, account, provider } = useWeb3();
    const [poolFarms, setPoolFarms] = useState<ContextProps['poolFarms']>({});
    const [slpFarms, setSlpFarms] = useState<ContextProps['slpFarms']>({});
    const [fetchingFarms, setFetchingFarms] = useState<boolean>(false);
    const [farmsInitialised, setFarmsInitialised] = useState(false);

    const refreshFarm = async (farmAddress: string) => {
        const farm = poolFarms[farmAddress] || slpFarms[farmAddress];
        if (account && farm) {
            const { stakingToken, isPoolToken, stakingTokenDecimals } = farm;
            const [stakingTokenBalance, stakingTokenAllowance, myStaked, myRewards, rewardsTokenAddress] =
                await Promise.all([
                    stakingToken.balanceOf(account),
                    stakingToken.allowance(account, farmAddress),
                    farm.contract.balanceOf(account),
                    farm.contract.rewards(account),
                    farm.contract.rewardsToken(),
                ]);

            const rewardsToken = new ethers.Contract(rewardsTokenAddress, ERC20__factory.abi, signer) as ERC20;

            const rewardsTokenDecimals = await rewardsToken.decimals();

            const decimalMultiplier = 10 ** stakingTokenDecimals;
            if (isPoolToken) {
                setPoolFarms((previousPoolFarms) => ({
                    ...previousPoolFarms,
                    [farmAddress]: {
                        ...previousPoolFarms[farmAddress],
                        stakingTokenBalance: new BigNumber(stakingTokenBalance.toString()).div(decimalMultiplier),
                        stakingTokenAllowance: new BigNumber(stakingTokenAllowance.toString()).div(decimalMultiplier),
                        myStaked: new BigNumber(myStaked.toString()).div(decimalMultiplier),
                        myRewards: new BigNumber(myRewards.toString()).div(10 ** rewardsTokenDecimals),
                    },
                }));
            } else {
                setSlpFarms((previousSlpFarms) => ({
                    ...previousSlpFarms,
                    [farmAddress]: {
                        ...previousSlpFarms[farmAddress],
                        stakingTokenBalance: new BigNumber(stakingTokenBalance.toString()).div(decimalMultiplier),
                        stakingTokenAllowance: new BigNumber(stakingTokenAllowance.toString()).div(decimalMultiplier),
                        myStaked: new BigNumber(myStaked.toString()).div(decimalMultiplier),
                        myRewards: new BigNumber(myRewards.toString()).div(10 ** rewardsTokenDecimals),
                    },
                }));
            }
        }
    };

    const fetchFarms = async () => {
        if (config && provider) {
            const poolFarms: FarmsLookup = {};
            const slpFarms: FarmsLookup = {};
            for (const { address, abi, isPoolToken } of config.farms) {
                try {
                    const contract = new ethers.Contract(address, abi, provider) as StakingRewards;

                    const myStaked = ethers.BigNumber.from(0);
                    const myRewards = ethers.BigNumber.from(0);
                    // if (account) {
                    //     const res = await Promise.all([contract.balanceOf(account), contract.earned(account)]);
                    //     myStaked = res[0];
                    //     myRewards = res[1];
                    // }

                    const [stakingTokenAddress, rewardPerToken, rewardsPerWeek, rewardsTokenAddress] =
                        await Promise.all([
                            contract.stakingToken(),
                            contract.rewardPerToken(),
                            contract.getRewardForDuration(),
                            contract.rewardsToken(),
                        ]);

                    const stakingToken = new ethers.Contract(
                        stakingTokenAddress,
                        ERC20__factory.abi,
                        provider,
                    ) as ERC20;

                    const rewardsToken = new ethers.Contract(
                        rewardsTokenAddress,
                        ERC20__factory.abi,
                        provider,
                    ) as ERC20;

                    let stakingTokenAllowance = ethers.BigNumber.from(0);
                    let stakingTokenBalance = ethers.BigNumber.from(0);
                    if (account) {
                        [stakingTokenBalance, stakingTokenAllowance] = await Promise.all([
                            stakingToken.balanceOf(account),
                            stakingToken.allowance(account, address),
                        ]);
                    }

                    const [stakingTokenName, stakingTokenDecimals, totalStaked, rewardsTokenDecimals] =
                        await Promise.all([
                            stakingToken.name(),
                            stakingToken.decimals(),
                            contract.totalSupply(),
                            rewardsToken.decimals(),
                        ]);

                    const stakingDecimalMultiplier = 10 ** stakingTokenDecimals;
                    const rewardsDecimalMultiplier = 10 ** rewardsTokenDecimals;
                    // totalEmittedTokensPerYear x priceOfRewardsTokens) / (totalSupply x priceOfStakingTokens
                    const updatedFarm = {
                        name: stakingTokenName,
                        address,
                        contract,
                        totalStaked: new BigNumber(ethers.utils.formatUnits(totalStaked, stakingTokenDecimals)),
                        stakingToken: stakingToken,
                        stakingTokenDecimals,
                        stakingTokenBalance: new BigNumber(stakingTokenBalance.toString()).div(
                            stakingDecimalMultiplier,
                        ),
                        stakingTokenAllowance: new BigNumber(stakingTokenAllowance.toString()).div(
                            stakingDecimalMultiplier,
                        ),
                        myStaked: new BigNumber(myStaked.toString()).div(stakingDecimalMultiplier),
                        myRewards: new BigNumber(myRewards.toString()).div(rewardsDecimalMultiplier),
                        apr: new BigNumber(rewardPerToken.toString()).div(rewardsDecimalMultiplier),
                        rewardsPerYear: new BigNumber(rewardsPerWeek.toString())
                            .div(rewardsDecimalMultiplier)
                            .times(52),
                        isPoolToken,
                    };

                    if (isPoolToken) {
                        poolFarms[address] = updatedFarm;
                    } else {
                        slpFarms[address] = updatedFarm;
                    }
                } catch (error) {
                    console.error(`Failed fetching farm with address: ${address}`, error);
                }
            }
            if (!farmsInitialised) {
                console.debug('Setting Farms');
                setPoolFarms(poolFarms);
                setSlpFarms(slpFarms);
                setFetchingFarms(false);
                setFarmsInitialised(true);
            }
        }
    };

    // if config changes reset farms
    // config will change on network change
    useEffect(() => {
        console.debug('Resetting all farms');
        setPoolFarms({});
        setSlpFarms({});
        setFetchingFarms(true);
        setFarmsInitialised(false);
    }, [config]);

    // fetch farms if provider changes
    // only fetch if farms have not been initialised farmsIntialised
    // and we are in fetching mode
    useEffect(() => {
        if (!farmsInitialised && fetchingFarms) {
            console.debug('Fetching all farms');
            fetchFarms();
        }
    }, [config, provider]);

    // fetch farms on account change
    // or after the farms have been initiliased
    useEffect(() => {
        if (config && farmsInitialised) {
            for (const { address } of config.farms) {
                console.log('Refreshing farm', address);
                refreshFarm(address);
            }
        }
    }, [config, account, farmsInitialised]);

    return (
        <FarmContext.Provider
            value={{
                poolFarms,
                slpFarms,
                refreshFarm,
                fetchingFarms,
            }}
        >
            {children}
        </FarmContext.Provider>
    );
};

export const useFarms: () => ContextProps = () => {
    const context = useContext(FarmContext);
    if (context === undefined) {
        throw new Error(`useFarms must be called within FarmContext`);
    }
    return context;
};
