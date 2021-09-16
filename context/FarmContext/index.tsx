import React, { useCallback, useContext, useEffect, useState } from 'react';
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
}

export const FarmContext = React.createContext<ContextProps>({
    poolFarms: {},
    slpFarms: {},
    refreshFarm: () => console.error('default FarmContext.refreshFarm'),
});

/**
 * Wrapper store for the FarmContext.
 */
export const FarmStore: React.FC<Children> = ({ children }: Children) => {
    const { signer, config, account } = useWeb3();
    const [poolFarms, setPoolFarms] = useState<ContextProps['poolFarms']>({});
    const [slpFarms, setSlpFarms] = useState<ContextProps['slpFarms']>({});
    const [fetchingFarms, setFetchingFarms] = useState<boolean>(false);

    const refreshFarm = async (farmAddress: string) => {
        const farm = poolFarms[farmAddress] || slpFarms[farmAddress];
        const { stakingToken, isPoolToken, stakingTokenDecimals } = farm;
        if (account && farm) {
            const [stakingTokenBalance, stakingTokenAllowance, myStaked, myRewards] = await Promise.all([
                stakingToken.balanceOf(account),
                stakingToken.allowance(account, farmAddress),
                farm.contract.balanceOf(account),
                farm.contract.rewards(account),
            ]);

            const decimalMultiplier = 10 ** stakingTokenDecimals;

            if (isPoolToken) {
                setPoolFarms((previousPoolFarms) => ({
                    ...poolFarms,
                    [farmAddress]: {
                        ...previousPoolFarms[farmAddress],
                        stakingTokenBalance: new BigNumber(stakingTokenBalance.toString()).div(decimalMultiplier),
                        stakingTokenAllowance: new BigNumber(stakingTokenAllowance.toString()).div(decimalMultiplier),
                        myStaked: new BigNumber(myStaked.toString()).div(decimalMultiplier),
                        myRewards: new BigNumber(myRewards.toString()).div(decimalMultiplier),
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
                        myRewards: new BigNumber(myRewards.toString()).div(decimalMultiplier),
                    },
                }));
            }
        }
    };

    const fetchFarms = useCallback(async () => {
        if (signer && config && account) {
            setPoolFarms({});
            setSlpFarms({});
            setFetchingFarms(true);
            const poolFarms: FarmsLookup = {};
            const slpFarms: FarmsLookup = {};
            for (const { address, abi, isPoolToken } of config.farms) {
                const contract = new ethers.Contract(address, abi, signer) as StakingRewards;

                const [myStaked, stakingTokenAddress, rewardPerToken, myRewards, rewardsPerWeek, rewardsTokenAddress] =
                    await Promise.all([
                        contract.balanceOf(account),
                        contract.stakingToken(),
                        contract.rewardPerToken(),
                        contract.rewards(account),
                        contract.getRewardForDuration(),
                        contract.rewardsToken(),
                    ]);

                const stakingToken = new ethers.Contract(stakingTokenAddress, ERC20__factory.abi, signer) as ERC20;
                const rewardsToken = new ethers.Contract(rewardsTokenAddress, ERC20__factory.abi, signer) as ERC20;

                const [
                    stakingTokenName,
                    stakingTokenDecimals,
                    stakingTokenBalance,
                    stakingTokenAllowance,
                    totalStaked,
                    rewardsTokenDecimals,
                ] = await Promise.all([
                    stakingToken.name(),
                    stakingToken.decimals(),
                    stakingToken.balanceOf(account),
                    stakingToken.allowance(account, address),
                    stakingToken.totalSupply(),
                    rewardsToken.decimals(),
                ]);

                const stakingDecimalMultiplier = 10 ** stakingTokenDecimals;
                const rewardsDecimalMultiplier = 10 ** rewardsTokenDecimals;

                const updatedFarm = {
                    name: stakingTokenName,
                    address,
                    contract,
                    totalStaked: new BigNumber(ethers.utils.formatEther(totalStaked)),
                    stakingToken: stakingToken,
                    stakingTokenDecimals,
                    stakingTokenBalance: new BigNumber(stakingTokenBalance.toString()).div(stakingDecimalMultiplier),
                    stakingTokenAllowance: new BigNumber(stakingTokenAllowance.toString()).div(
                        stakingDecimalMultiplier,
                    ),
                    myStaked: new BigNumber(myStaked.toString()).div(stakingDecimalMultiplier),
                    myRewards: new BigNumber(myRewards.toString()).div(rewardsDecimalMultiplier),
                    apy: new BigNumber(rewardPerToken.toString()).div(rewardsDecimalMultiplier),
                    rewardsPerYear: new BigNumber(rewardsPerWeek.toString()).div(rewardsDecimalMultiplier).times(52),
                    isPoolToken,
                };

                if (isPoolToken) {
                    poolFarms[address] = updatedFarm;
                } else {
                    slpFarms[address] = updatedFarm;
                }
            }
            setPoolFarms(poolFarms);
            setSlpFarms(slpFarms);
        }
    }, [signer, config, account]);

    // fetch farms initially
    useEffect(() => {
        fetchFarms();
    }, []);

    // update farms on network change
    useEffect(() => {
        fetchFarms();
    }, [signer, config, account]);

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
