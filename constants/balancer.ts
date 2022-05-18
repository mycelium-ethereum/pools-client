import { KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';
import { BalancerInfo } from '~/types/balancer';

export const balancerConfig: Partial<Record<KnownNetwork, BalancerInfo>> = {
    [NETWORKS.ARBITRUM]: {
        graphUri: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-arbitrum-v2',
        baseUri: 'https://arbitrum.balancer.fi/#/trade',
        pools: [],
        // USDC
        recommendedSwapToken: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
        leveragedPools: [
            // 3-BTC/USD
            '0x0d9fEC3a621387A3ceC87DA24c4aeC7cA261C856',
            // 3-ETH/USD
            '0x14D162E10eCCe3935c1F64cd49faB28b3cC2B527',
        ],
        // wETH wBTC USDC pool
        wPool: '0x64541216bafffeec8ea535bb71fbc927831d0595',
    },
};
