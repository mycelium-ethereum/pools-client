import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { ERC20__factory, AggregatorV3Interface__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
import { calcBptTokenSpotPrice, KnownNetwork, StaticPoolInfo } from '@tracer-protocol/pools-js';
import { balancerConfig as _balancerConfig, BALANCER_VAULT_ADDRESS } from '~/constants/balancer';
import { networkConfig as _networkConfig } from '~/constants/networks';
import { BalancerInfo, BalancerPoolAsset } from '~/types/balancer';
import { Vault__factory } from '~/types/staking/balancerV2Vault';
import { fetchPPTokenPrice } from '../farms';

export const getBalancerPrices: (balancerInfo?: BalancerInfo) => Promise<Record<string, BigNumber>> = async (
    balancerInfo,
) => {
    if (!balancerInfo) {
        return {};
    }

    const data = {
        query: `{
                leveragedPools: pools(where: {
                    address_in: ${JSON.stringify(balancerInfo.leveragedPools.map((pool) => pool.toLowerCase()))}
                }) {
                    id
                    address
                    swapFee
                    tokens {
                        address
                        balance
                        decimals
                        weight
                        symbol
                    }
                },
                nonLeveragedPools: pools(where: {
                    address_in: ${JSON.stringify(balancerInfo.pools.map((pool) => pool.toLowerCase()))}
                }) {
                    id
                    address
                    swapFee
                    tokens {
                        address
                        balance
                        decimals
                        weight
                        symbol
                    }
                },
                wPool: pools(where: {
                    address: "${balancerInfo.wPool}"
                }) {
                    id
                    address
                    swapFee
                    tokens {
                        address
                        balance
                        decimals
                        weight
                        symbol
                    }
                }

            }`,
    };

    const res = await fetch(balancerInfo.graphUri, {
        method: 'POST',
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .catch((err) => {
            console.error('Failed to fetch tokens from balancer graph', err);
            return {};
        });
    const tokenPrices: Record<string, BigNumber> = {};
    const getTokenPrices: (
        pools: {
            id: string;
            address: string;
            swapFee: string;
            tokens: {
                address: string;
                balance: string;
                decimals: string;
                weight: string; // decimal
                symbol: string;
            }[];
        }[],
        baseAssets: ('USDC' | 'WETH' | 'WBTC')[],
    ) => void = (pools, baseAssets) => {
        for (const pool of pools) {
            const baseAsset = pool.tokens.filter((token: any) => baseAssets.includes(token.symbol))[0];
            const poolTokens = pool.tokens.filter((token: any) => !baseAssets.includes(token.symbol));
            let baseBalance = new BigNumber(baseAsset.balance);
            if (baseAsset.symbol !== 'USDC') {
                baseBalance = baseBalance.times(tokenPrices[baseAsset.address]);
            }
            for (const token of poolTokens) {
                tokenPrices[token.address] = calcBptTokenSpotPrice(
                    {
                        balance: baseBalance,
                        weight: new BigNumber(baseAsset.weight),
                    },
                    {
                        balance: new BigNumber(token.balance),
                        weight: new BigNumber(token.weight),
                    },
                    new BigNumber(pool.swapFee),
                );
            }
        }
    };
    getTokenPrices(res.data.wPool, ['USDC']);
    getTokenPrices(res.data.nonLeveragedPools, ['USDC']);
    getTokenPrices(res.data.leveragedPools, ['USDC']);
    return tokenPrices;
};

export const constructBalancerLink: (token: string | undefined, network: KnownNetwork, isBuy: boolean) => string = (
    token,
    network,
    isBuy,
) => {
    const balancerInfo = _balancerConfig[network];
    return isBuy
        ? `${balancerInfo?.baseUri}/${balancerInfo?.recommendedSwapToken}/${token}`
        : `${balancerInfo?.baseUri}/${token}/${balancerInfo?.recommendedSwapToken}`;
};

export const fetchBPTPrice = async (
    pool: StaticPoolInfo,
    balancerPoolId: string,
    provider: ethers.providers.JsonRpcProvider,
    BPTSupply: BigNumber,
): Promise<BigNumber> => {
    const tokenLookup = await getBalancerPoolTokens(pool, balancerPoolId, provider);

    let totalBalancePoolValue = new BigNumber(0);

    for (const tokenAddress in tokenLookup) {
        const { reserves, usdcPrice } = tokenLookup[tokenAddress];

        totalBalancePoolValue = totalBalancePoolValue.plus(reserves.times(usdcPrice));
    }

    return totalBalancePoolValue.div(BPTSupply);
};

const getBalancerPoolTokens = async (
    pool: StaticPoolInfo,
    balancerPoolId: string,
    provider: ethers.providers.JsonRpcProvider,
): Promise<Record<string, BalancerPoolAsset>> => {
    const network = provider.network.chainId?.toString() as KnownNetwork;

    const balancerConfig = _balancerConfig[network];
    const networkConfig = _networkConfig[network];

    if (!balancerConfig || !networkConfig) {
        return {};
    }

    const balancerPool = Vault__factory.connect(BALANCER_VAULT_ADDRESS, provider);

    const [tokenAddresses, tokenBalances] = await balancerPool.getPoolTokens(balancerPoolId);

    const tokenLookup: Record<string, BalancerPoolAsset> = {};

    // populate token details and add to lookup
    await Promise.all(
        tokenAddresses.map(async (address, index) => {
            const tokenContract = ERC20__factory.connect(address, provider);

            const [decimals, symbol] = await Promise.all([tokenContract.decimals(), tokenContract.symbol()]);
            const tokenBalance = tokenBalances[index];

            let isPoolToken = false;

            let usdcPrice = new BigNumber(0);

            if (address.toLowerCase() === networkConfig.usdcAddress.toLowerCase()) {
                usdcPrice = new BigNumber(1);
            } else if (balancerConfig?.knownUSDCPriceFeeds?.[address]) {
                // fetch USDC price for known markets (BTC and ETH)
                // known market price feed addresses are configured in Web3Context.Config.ts
                const priceFeedAggregator = AggregatorV3Interface__factory.connect(
                    balancerConfig.knownUSDCPriceFeeds[address],
                    provider,
                );

                const [{ answer }, priceFeedDecimals] = await Promise.all([
                    priceFeedAggregator.latestRoundData(),
                    priceFeedAggregator.decimals(),
                ]);

                usdcPrice = new BigNumber(ethers.utils.formatUnits(answer, priceFeedDecimals));
            } else {
                // not usdc and not listed as a known non-pool token
                // assume it is a perpetual pools token

                // use a placeholder and then handle pool token pricing elsewhere where the pool store is accessible
                usdcPrice = await fetchPPTokenPrice(pool, address, provider);

                isPoolToken = true;
            }

            tokenLookup[symbol] = {
                address,
                symbol,
                isPoolToken,
                reserves: new BigNumber(ethers.utils.formatUnits(tokenBalance, decimals)),
                usdcPrice,
                decimals,
            };
        }),
    );

    return tokenLookup;
};
