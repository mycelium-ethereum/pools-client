import type { BigNumber } from 'bignumber.js';

export type BalancerInfo = {
    graphUri: string;
    baseUri: string; // base link to balancer trading page
    recommendedSwapToken: string;
    pools: string[];
    leveragedPools: string[];
    wPool: string;
    knownUSDCPriceFeeds: Record<string, string>;
};

export type BalancerPoolAsset = {
    address: string;
    symbol: string;
    reserves: BigNumber;
    usdcPrice: BigNumber;
    decimals: number;
    isPoolToken: boolean;
};
