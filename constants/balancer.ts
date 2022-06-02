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
            // deprecated 3-BTC/USD
            '0x0d9fEC3a621387A3ceC87DA24c4aeC7cA261C856',
            // deprecated 3-ETH/USD
            '0x14D162E10eCCe3935c1F64cd49faB28b3cC2B527',
            // v2.1 pools
            // 3-BTC/USD
            '0x045c5480131EeF51AA1a74F34e62e7DE23136f24',
            // 3-ETH/USD
            '0x59B7867F6B127070378feeb328e2Ffe6AAb67525',
            // 3 WTI/USD
            '0xfE7b8F8FcA690AB0CD2B8D979ABEeaC94C06805D',
        ],
        // wETH wBTC USDC pool
        wPool: '0x64541216bafffeec8ea535bb71fbc927831d0595',
    },
};
