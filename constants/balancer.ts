import { KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';
import { BalancerInfo } from '~/types/balancer';

export const balancerConfig: Partial<Record<KnownNetwork, BalancerInfo>> = {
    [NETWORKS.ARBITRUM]: {
        graphUri: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-arbitrum-v2',
        baseUri: 'https://arbitrum.balancer.fi/#/trade',
        // 1-BTC/USD and 1-ETH/USD
        pools: ['0x6ee86e032173716a41818e6d6d320a752176d697', '0x17a35e3d578797e34131d10e66c11170848c6da1'],
        // 3-BTC/USD and 3-ETH/USD
        leveragedPools: ['0xcf3ae4b9235b1c203457e472a011c12c3a2fde93', '0x996616bde0cb4974e571f17d31c844da2bd177f8'],
        // wETH wBTC USDC pool
        wPool: '0x64541216bafffeec8ea535bb71fbc927831d0595',
    },
};
