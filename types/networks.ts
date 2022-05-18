import { KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';
import { LogoTicker } from '~/components/General';
import { UNKNOWN_NETWORK } from '~/constants/networks';

export type V2_SUPPORTED_NETWORKS = typeof NETWORKS.ARBITRUM_RINKEBY | typeof NETWORKS.ARBITRUM;
export type UnknownNetwork = typeof UNKNOWN_NETWORK;

export type Network = {
    id: KnownNetwork;
    name: string;
    logoTicker: LogoTicker;
    previewUrl: string;
    hex: string;

    usdcAddress: string;
    tcrAddress: string;

    publicRPC: string;
    publicWebsocketRPC?: string;

    // chainlink USD spot price feeds
    // lookup from market name -> chainlink feed address
    // ie ETH/USD -> { feedAddress: 0x6ce185860a4963106506C203335A2910413708e9, decimals: 8 }
    knownMarketSpotPriceChainlinkFeeds?: Record<string, { feedAddress: string; decimals: number }>;
};
