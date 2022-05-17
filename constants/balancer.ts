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
            '0x3fF51DE6D96d4A88182b7006b8E8d9DB7D43931c',
            // 3-ETH/USD
            '0x03F3919407b9ef2Df36436C256029A16A51B107b',
        ],
        // wETH wBTC USDC pool
        wPool: '0x64541216bafffeec8ea535bb71fbc927831d0595',
    },
};
