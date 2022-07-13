import { KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';
import { BalancerInfo } from '~/types/balancer';

// vault address is the same on all chains
export const BALANCER_VAULT_ADDRESS = '0xBA12222222228d8Ba445958a75a0704d566BF2C8';

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
            // 3 BTC/USD-12h
            '0xc999678122cbf8a30cb72c53d4bdd72abd96af88',
        ],
        // wETH wBTC USDC pool
        wPool: '0x64541216bafffeec8ea535bb71fbc927831d0595',
        knownUSDCPriceFeeds: {
            // wBTC: BTC/USD
            '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f': '0x6ce185860a4963106506C203335A2910413708e9',
            // wETH: ETH/USD
            '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612',
        },
    },
};
