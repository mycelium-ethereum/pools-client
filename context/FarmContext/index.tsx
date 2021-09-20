import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Children } from 'libs/types/General';
import { useWeb3 } from '../Web3Context/Web3Context';
import { ethers } from 'ethers';
import { Farm } from '@libs/types/Staking';
import { StakingRewards } from '@libs/staking/typechain';
import { ERC20, ERC20__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
import {
    UniswapV2Router02,
    UniswapV2Router02__factory,
    IUniswapV2Pair,
    IUniswapV2Pair__factory,
} from '@libs/staking/uniswapRouterV2';
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

    // used to fetch details of tokens on both sides of a sushi pool
    const getSlpDetails = async (
        slpPairAddress: string,
        token1IsPoolToken: boolean,
        token0IsPoolToken: boolean,
    ): Promise<Farm['slpDetails']> => {
        if (!config) {
            return undefined;
        }

        const pair = new ethers.Contract(slpPairAddress, IUniswapV2Pair__factory.abi, provider) as IUniswapV2Pair;

        const [token0Address, token1Address, [_token0Reserves, _token1Reserves]] = await Promise.all([
            await pair.token0(),
            await pair.token1(),
            await pair.getReserves(),
        ]);

        const token0Reserves = new BigNumber(_token0Reserves.toString());
        const token1Reserves = new BigNumber(_token1Reserves.toString());

        const token0Contract = new ethers.Contract(token0Address, ERC20__factory.abi, provider) as ERC20;
        const token1Contract = new ethers.Contract(token1Address, ERC20__factory.abi, provider) as ERC20;

        const [token0Decimals, token1Decimals, token0Name, token1Name] = await Promise.all([
            token0Contract.decimals(),
            token1Contract.decimals(),
            token0Contract.name(),
            token1Contract.name(),
        ]);

        // if both sides of the pool are pool tokens, we don't need to consult the sushi price oracle
        if (token1IsPoolToken && token0IsPoolToken) {
            return {
                token0: {
                    reserves: token0Reserves.div(10 ** token0Decimals),
                    decimals: token0Decimals,
                    name: token0Name,
                    usdcPrice: new BigNumber(0), // currently only applies to tokens that are not pool tokens
                    isPoolToken: token0IsPoolToken,
                    address: token0Address,
                },
                token1: {
                    reserves: token1Reserves.div(10 ** token1Decimals),
                    decimals: token1Decimals,
                    name: token1Name,
                    usdcPrice: new BigNumber(0), // currently only applies to tokens that are not pool tokens
                    isPoolToken: token1IsPoolToken,
                    address: token1Address,
                },
            };
        }

        // only side will be a non pool token
        const nonPoolTokenAddress = token0IsPoolToken ? token1Address : token0Address;
        const nonPoolTokenDecimals = token0IsPoolToken ? token1Decimals : token0Decimals;

        const sushiRouter = new ethers.Contract(
            config.sushiRouterAddress,
            UniswapV2Router02__factory.abi,
            provider,
        ) as UniswapV2Router02;

        const oneNonPoolToken = new BigNumber('1').times(10 ** nonPoolTokenDecimals);

        if (!config?.knownNonPoolTokenPricePaths?.[nonPoolTokenAddress]) {
            const nonPoolTokenName = token0IsPoolToken ? token1Name : token0Name;
            throw new Error(`No known USDC price path for non-pool token ${nonPoolTokenAddress} (${nonPoolTokenName})`);
        }

        const nonPoolTokenUSDCPath = config.knownNonPoolTokenPricePaths[nonPoolTokenAddress];

        const [_nonPoolTokenUSDCPrice] = await sushiRouter.getAmountsIn(
            oneNonPoolToken.toFixed(),
            nonPoolTokenUSDCPath,
        );

        const nonPoolTokenUSDCPrice = new BigNumber(_nonPoolTokenUSDCPrice.toString());

        // pool tokens get a hardcoded price of 0 USDC
        // this is because we can't use useTokenPrice hooks from within this context
        // pool token USDC prices must be calculated elsewhere where useTokenPrice is available
        return {
            token0: {
                reserves: token0Reserves.div(10 ** token0Decimals),
                decimals: token0Decimals,
                name: token0Name,
                usdcPrice: token0IsPoolToken ? new BigNumber(0) : nonPoolTokenUSDCPrice,
                isPoolToken: token0IsPoolToken,
                address: token0Address,
            },
            token1: {
                reserves: token1Reserves.div(10 ** token1Decimals),
                decimals: token1Decimals,
                name: token1Name,
                usdcPrice: token1IsPoolToken ? new BigNumber(0) : nonPoolTokenUSDCPrice,
                isPoolToken: token1IsPoolToken,
                address: token1Address,
            },
        };
    };

    const refreshFarm = async (farmAddress: string) => {
        const farm = poolFarms[farmAddress] || slpFarms[farmAddress];
        const { stakingToken, isPoolTokenFarm, stakingTokenDecimals } = farm;
        if (account && farm) {
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

            if (isPoolTokenFarm) {
                setPoolFarms((previousPoolFarms) => ({
                    ...poolFarms,
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

    const fetchFarms = useCallback(
        async ({ reset }: { reset: boolean }) => {
            if (signer && config && account) {
                if (reset) {
                    setPoolFarms({});
                    setSlpFarms({});
                    setFetchingFarms(true);
                }
                const poolFarms: FarmsLookup = {};
                const slpFarms: FarmsLookup = {};
                for (const { address, abi, isPoolTokenFarm, token1IsPoolToken, token0IsPoolToken } of config.farms) {
                    try {
                        const contract = new ethers.Contract(address, abi, signer) as StakingRewards;

                        const [myStaked, stakingTokenAddress, myRewards, rewardsPerWeek, rewardsTokenAddress] =
                            await Promise.all([
                                contract.balanceOf(account),
                                contract.stakingToken(),
                                contract.earned(account),
                                contract.getRewardForDuration(),
                                contract.rewardsToken(),
                            ]);

                        const stakingToken = new ethers.Contract(
                            stakingTokenAddress,
                            ERC20__factory.abi,
                            signer,
                        ) as ERC20;
                        const rewardsToken = new ethers.Contract(
                            rewardsTokenAddress,
                            ERC20__factory.abi,
                            signer,
                        ) as ERC20;

                        const [
                            stakingTokenName,
                            stakingTokenDecimals,
                            stakingTokenBalance,
                            stakingTokenAllowance,
                            _totalStaked,
                            rewardsTokenDecimals,
                            _stakingTokenSupply,
                        ] = await Promise.all([
                            stakingToken.name(),
                            stakingToken.decimals(),
                            stakingToken.balanceOf(account),
                            stakingToken.allowance(account, address),
                            contract.totalSupply(),
                            rewardsToken.decimals(),
                            stakingToken.totalSupply(),
                        ]);

                        const totalStaked = new BigNumber(ethers.utils.formatUnits(_totalStaked, stakingTokenDecimals));

                        const slpDetails =
                            isPoolTokenFarm && !token1IsPoolToken
                                ? undefined
                                : await getSlpDetails(
                                      stakingTokenAddress,
                                      Boolean(token1IsPoolToken),
                                      Boolean(token0IsPoolToken),
                                  );

                        const stakingDecimalMultiplier = 10 ** stakingTokenDecimals;
                        const rewardsDecimalMultiplier = 10 ** rewardsTokenDecimals;
                        // totalEmittedTokensPerYear x priceOfRewardsTokens) / (totalSupply x priceOfStakingTokens
                        const stakingTokenSupply = new BigNumber(_stakingTokenSupply.toString()).div(
                            stakingDecimalMultiplier,
                        );

                        const updatedFarm = {
                            name: isPoolTokenFarm
                                ? stakingTokenName
                                : `${slpDetails?.token0.name}, ${slpDetails?.token1.name}`,
                            address,
                            contract,
                            totalStaked,
                            stakingToken: stakingToken,
                            stakingTokenDecimals,
                            stakingTokenBalance: new BigNumber(stakingTokenBalance.toString()).div(
                                stakingDecimalMultiplier,
                            ),
                            stakingTokenAllowance: new BigNumber(stakingTokenAllowance.toString()).div(
                                stakingDecimalMultiplier,
                            ),
                            stakingTokenSupply,
                            myStaked: new BigNumber(myStaked.toString()).div(stakingDecimalMultiplier),
                            myRewards: new BigNumber(myRewards.toString()).div(rewardsDecimalMultiplier),
                            rewardsPerYear: new BigNumber(rewardsPerWeek.toString())
                                .div(rewardsDecimalMultiplier)
                                .times(52),
                            isPoolTokenFarm,
                            slpDetails,
                        };

                        if (isPoolTokenFarm) {
                            poolFarms[address] = updatedFarm;
                        } else {
                            slpFarms[address] = updatedFarm;
                        }
                    } catch (error) {
                        console.error('failed fetching farm with address: ', address, error);
                    }
                }
                setPoolFarms(poolFarms);
                setSlpFarms(slpFarms);
                setFetchingFarms(false);
            }
        },
        [signer, config, account],
    );

    // fetch farms initially
    useEffect(() => {
        fetchFarms({ reset: false });
    }, []);

    // update farms on network change
    useEffect(() => {
        fetchFarms({ reset: true });
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
