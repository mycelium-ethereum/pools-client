import BigNumber from 'bignumber.js';
import { calcBptTokenSpotPrice, KnownNetwork } from '@tracer-protocol/pools-js';
import { balancerConfig } from '~/constants/balancer';
import { BalancerInfo } from '~/types/balancer';

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
    const balancerInfo = balancerConfig[network];
    return isBuy
        ? `${balancerInfo?.baseUri}/${balancerInfo?.recommendedSwapToken}/${token}`
        : `${balancerInfo?.baseUri}/${token}/${balancerInfo?.recommendedSwapToken}`;
};
