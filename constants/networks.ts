import { KnownNetwork } from '@tracer-protocol/pools-js';
import { NETWORKS } from '@tracer-protocol/pools-js/utils/constants';
import { Network } from '~/types/networks';

export const UNKNOWN_NETWORK = '0';

export const knownNetworkToSubgraphUrl: Partial<Record<KnownNetwork, string>> = {
    [NETWORKS.ARBITRUM]: 'https://api.thegraph.com/subgraphs/name/tracer-protocol/perpetual-pools-v2-arbitrum-one',
    [NETWORKS.ARBITRUM_RINKEBY]:
        'https://api.thegraph.com/subgraphs/name/tracer-protocol/perpetual-pools-v2-arbitrum-rinkeby',
};

/**
 * Network store which allows swapping between networks and fetching from different data sources.
 * Keys are the ID of the network.
 */
export const networkConfig: Record<KnownNetwork, Network> = {
    [NETWORKS.ARBITRUM_RINKEBY]: {
        id: NETWORKS.ARBITRUM_RINKEBY,
        name: 'Arbitrum Rinkeby',
        logoTicker: NETWORKS.ARBITRUM,
        previewUrl: 'https://testnet.arbiscan.io',
        hex: '0x66EEB',
        publicRPC: process.env.NEXT_PUBLIC_TESTNET_RPC ?? 'https://rinkeby.arbitrum.io/rpc',
        publicWebsocketRPC: process.env.NEXT_PUBLIC_TESTNET_WSS_RPC,
        usdcAddress: '',
        tcrAddress: '',
        knownMarketSpotPriceChainlinkFeeds: {
            'BTC/USD': {
                feedAddress: '0x0c9973e7a27d00e656B9f153348dA46CaD70d03d',
                decimals: 8,
            },
            'ETH/USD': {
                feedAddress: '0x5f0423B1a6935dc5596e7A24d98532b67A0AeFd8',
                decimals: 8,
            },
        },
    },
    [NETWORKS.ARBITRUM]: {
        id: NETWORKS.ARBITRUM,
        name: 'Arbitrum',
        logoTicker: NETWORKS.ARBITRUM,
        previewUrl: 'https://arbiscan.io/',
        hex: '0xA4B1',
        publicRPC: process.env.NEXT_PUBLIC_MAINNET_RPC ?? 'https://arb1.arbitrum.io/rpc',
        publicWebsocketRPC: process.env.NEXT_PUBLIC_MAINNET_WSS_RPC,
        usdcAddress: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
        tcrAddress: '0xA72159FC390f0E3C6D415e658264c7c4051E9b87',
        knownMarketSpotPriceChainlinkFeeds: {
            'BTC/USD': {
                feedAddress: '0x6ce185860a4963106506C203335A2910413708e9',
                decimals: 8,
            },
            'ETH/USD': {
                feedAddress: '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612',
                decimals: 8,
            },
        },
    },
    [NETWORKS.MAINNET]: {
        id: NETWORKS.MAINNET,
        name: 'Ethereum',
        logoTicker: 'ETH',
        previewUrl: '',
        hex: '0x1',
        publicRPC: process.env.NEXT_PUBLIC_MAINNET_L1_RPC || '',
        usdcAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        tcrAddress: '0x9c4a4204b79dd291d6b6571c5be8bbcd0622f050',
    },
    [NETWORKS.RINKEBY]: {
        id: NETWORKS.RINKEBY,
        name: 'Rinkeby',
        logoTicker: 'ETH',
        previewUrl: '',
        hex: '0x4',
        publicRPC: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        usdcAddress: '',
        tcrAddress: '',
    },
    [NETWORKS.KOVAN]: {
        // TODO fill this out properly
        id: NETWORKS.KOVAN,
        name: 'Kovan',
        logoTicker: 'ETH',
        previewUrl: '',
        hex: '0x4',
        publicRPC: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        usdcAddress: '',
        tcrAddress: '',
    },
};

export const DEFAULT_NETWORK = NETWORKS.ARBITRUM;
export const DEFAULT_WSS_RPC = networkConfig[DEFAULT_NETWORK].publicWebsocketRPC;
