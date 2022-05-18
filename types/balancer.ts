export type BalancerInfo = {
    graphUri: string;
    baseUri: string; // base link to balancer trading page
    recommendedSwapToken: string;
    pools: string[];
    leveragedPools: string[];
    wPool: string;
};
