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

    const refreshFarm = async (farmAddress: string) => {
        console.log('REFRESHING FARM', farmAddress);

        const farm = poolFarms[farmAddress] || slpFarms[farmAddress];
        const { stakingToken, isPoolToken, stakingTokenDecimals } = farm;
        if (account && farm) {
            const [stakingTokenBalance, stakingTokenAllowance] = await Promise.all([
                stakingToken.balanceOf(account),
                stakingToken.allowance(account, farmAddress),
            ]);

            const decimalMultiplier = 10 ** stakingTokenDecimals;

            if (isPoolToken) {
                setPoolFarms((previousPoolFarms) => ({
                    ...previousPoolFarms,
                    [farmAddress]: {
                        ...previousPoolFarms[farmAddress],
                        stakingTokenBalance: new BigNumber(stakingTokenBalance.toString()).div(decimalMultiplier),
                        stakingTokenAllowance: new BigNumber(stakingTokenAllowance.toString()).div(decimalMultiplier),
                    },
                }));
            } else {
                setSlpFarms((previousSlpFarms) => ({
                    ...previousSlpFarms,
                    [farmAddress]: {
                        ...previousSlpFarms[farmAddress],
                        stakingTokenBalance: new BigNumber(stakingTokenBalance.toString()).div(decimalMultiplier),
                        stakingTokenAllowance: new BigNumber(stakingTokenAllowance.toString()).div(decimalMultiplier),
                    },
                }));
            }
        }
    };

    const fetchFarms = useCallback(async () => {
        if (signer && config && account) {
            for (const { address, abi, isPoolToken } of config.farms) {
                const contract = new ethers.Contract(address, abi, signer) as StakingRewards;

                const [myStaked, stakingToken, rewardPerToken, myRewards] = await Promise.all([
                    contract.balanceOf(account),
                    contract.stakingToken(),
                    contract.rewardPerToken(),
                    contract.rewards(account),
                ]);

                const stakingTokenContract = new ethers.Contract(stakingToken, ERC20__factory.abi, signer) as ERC20;

                const [stakingTokenName, stakingTokenDecimals, stakingTokenBalance, stakingTokenAllowance] =
                    await Promise.all([
                        stakingTokenContract.name(),
                        stakingTokenContract.decimals(),
                        stakingTokenContract.balanceOf(account),
                        stakingTokenContract.allowance(account, address),
                    ]);

                console.log('got the staking token name', stakingTokenName);

                const decimalMultiplier = 10 ** stakingTokenDecimals;

                const updatedFarm = {
                    name: stakingTokenName,
                    address,
                    contract,
                    stakingToken: stakingTokenContract,
                    stakingTokenDecimals,
                    stakingTokenBalance: new BigNumber(stakingTokenBalance.toString()).div(decimalMultiplier),
                    stakingTokenAllowance: new BigNumber(stakingTokenAllowance.toString()).div(decimalMultiplier),
                    myStaked: new BigNumber(myStaked.toString()).div(decimalMultiplier),
                    myRewards: new BigNumber(myRewards.toString()).div(decimalMultiplier),
                    apy: new BigNumber(rewardPerToken.toString()).div(decimalMultiplier),
                    tvl: new BigNumber(0),
                    isPoolToken,
                };

                if (isPoolToken) {
                    setPoolFarms((previousPoolFarms) => ({
                        ...previousPoolFarms,
                        [address]: updatedFarm,
                    }));
                } else {
                    setSlpFarms((previousSlpFarms) => ({
                        ...previousSlpFarms,
                        [address]: updatedFarm,
                    }));
                }
            }
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
