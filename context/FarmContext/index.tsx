import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Children } from 'libs/types/General';
import { useWeb3 } from '../Web3Context/Web3Context';
import { ethers } from 'ethers';
import { StakingRewards } from '@libs/staking/typechain';
import { ERC20, ERC20__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
import {
    UniswapV2Router02,
    UniswapV2Router02__factory,
    IUniswapV2Pair,
    IUniswapV2Pair__factory,
} from '@libs/staking/uniswapRouterV2';

import BigNumber from 'bignumber.js';
import { fetchTokenPrice } from './helpers';

type SlpPairTokenDetails = {
    address: string;
    name: string;
    isPoolToken: boolean;
    reserves: BigNumber;
    usdcPrice: BigNumber;
    decimals: number;
};

export type FarmTableDetails = {
    totalStaked: BigNumber;
    myStaked: BigNumber;
    myRewards: BigNumber;
    stakingTokenBalance: BigNumber;
    stakingTokenSupply: BigNumber;
    rewardsPerYear: BigNumber;
    slpDetails?: {
        token0: SlpPairTokenDetails;
        token1: SlpPairTokenDetails;
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

type FarmsLookup = { [address: string]: Farm };
interface ContextProps {
    farms: FarmsLookup;
    refreshFarm: (farmAddress: string) => void;
    fetchingFarms: boolean;
}

export const FarmContext = React.createContext<ContextProps>({
    farms: {},
    refreshFarm: () => console.error('default FarmContext.refreshFarm'),
    fetchingFarms: false,
});

export type FarmContexts = 'slpFarms' | 'poolFarms';

/**
 * Wrapper store for the FarmContext.
 */
export const FarmStore: React.FC<
    {
        farmContext: FarmContexts;
    } & Children
> = ({ farmContext, children }) => {
    const { signer, config, account, provider } = useWeb3();
    const [farms, setFarms] = useState<ContextProps['farms']>({});
    const [fetchingFarms, setFetchingFarms] = useState<boolean>(false);

    // used to fetch details of tokens on both sides of a sushi pool
    const getSlpDetails = async (
        slpPairAddress: string,
        pool: string,
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
            const [token0USDCPrice, token1USDCPrice] = await fetchTokenPrice(
                pool,
                [token0Address, token1Address],
                provider,
            );
            return {
                token0: {
                    reserves: token0Reserves.div(10 ** token0Decimals),
                    decimals: token0Decimals,
                    name: token0Name,
                    usdcPrice: token0USDCPrice, // currently only applies to tokens that are not pool tokens
                    isPoolToken: token0IsPoolToken,
                    address: token0Address,
                },
                token1: {
                    reserves: token1Reserves.div(10 ** token1Decimals),
                    decimals: token1Decimals,
                    name: token1Name,
                    usdcPrice: token1USDCPrice, // currently only applies to tokens that are not pool tokens
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
        const poolTokenUSDCPrice = await fetchTokenPrice(
            pool,
            [token0IsPoolToken ? token0Address : token1Address],
            provider,
        );

        // pool tokens get a hardcoded price of 0 USDC
        // this is because we can't use useTokenPrice hooks from within this context
        // pool token USDC prices must be calculated elsewhere where useTokenPrice is available
        return {
            token0: {
                reserves: token0Reserves.div(10 ** token0Decimals),
                decimals: token0Decimals,
                name: token0Name,
                usdcPrice: token0IsPoolToken ? poolTokenUSDCPrice[0] : nonPoolTokenUSDCPrice,
                isPoolToken: token0IsPoolToken,
                address: token0Address,
            },
            token1: {
                reserves: token1Reserves.div(10 ** token1Decimals),
                decimals: token1Decimals,
                name: token1Name,
                usdcPrice: token1IsPoolToken ? poolTokenUSDCPrice[0] : nonPoolTokenUSDCPrice,
                isPoolToken: token1IsPoolToken,
                address: token1Address,
            },
        };
    };

    const refreshFarm = async (farmAddress: string) => {
        const farm = farms[farmAddress];
        const { stakingToken, stakingTokenDecimals } = farm;
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

            setFarms((previousFarms) => ({
                ...previousFarms,
                [farmAddress]: {
                    ...previousFarms[farmAddress],
                    stakingTokenBalance: new BigNumber(stakingTokenBalance.toString()).div(decimalMultiplier),
                    stakingTokenAllowance: new BigNumber(stakingTokenAllowance.toString()).div(decimalMultiplier),
                    myStaked: new BigNumber(myStaked.toString()).div(decimalMultiplier),
                    myRewards: new BigNumber(myRewards.toString()).div(10 ** rewardsTokenDecimals),
                },
            }));
        }
    };

    const fetchFarms = useCallback(
        async ({ reset }: { reset: boolean }) => {
            if (signer && config && account) {
                if (reset) {
                    setFarms({});
                    setFetchingFarms(true);
                }
                Promise.all(
                    config[farmContext].map(async ({ address, abi, token1IsPoolToken, token0IsPoolToken, pool }) => {
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

                            const totalStaked = new BigNumber(
                                ethers.utils.formatUnits(_totalStaked, stakingTokenDecimals),
                            );

                            const isPoolTokenFarm = farmContext === 'poolFarms';

                            const slpDetails =
                                isPoolTokenFarm && !token1IsPoolToken
                                    ? undefined
                                    : await getSlpDetails(
                                          stakingTokenAddress,
                                          pool,
                                          Boolean(token1IsPoolToken),
                                          Boolean(token0IsPoolToken),
                                      );

                            const poolDetails = isPoolTokenFarm
                                ? {
                                      poolTokenPrice: (await fetchTokenPrice(pool, [stakingTokenAddress], provider))[0],
                                  }
                                : undefined;

                            const stakingDecimalMultiplier = 10 ** stakingTokenDecimals;
                            const rewardsDecimalMultiplier = 10 ** rewardsTokenDecimals;
                            // totalEmittedTokensPerYear x priceOfRewardsTokens) / (totalSupply x priceOfStakingTokens
                            const stakingTokenSupply = new BigNumber(_stakingTokenSupply.toString()).div(
                                stakingDecimalMultiplier,
                            );

                            return {
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
                                poolDetails: poolDetails,
                            };
                        } catch (error) {
                            console.error('failed fetching farm with address: ', address, error);
                            return;
                        }
                    }),
                ).then((farms_) => {
                    const farms: FarmsLookup = {};
                    farms_.forEach((farm: Farm | undefined) => {
                        if (farm) {
                            farms[farm.address] = farm;
                        }
                    });
                    setFarms(farms);
                    setFetchingFarms(false);
                });
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
                farms,
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
