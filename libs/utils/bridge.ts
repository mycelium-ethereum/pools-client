import { ARBITRUM_RINKEBY, ARBITRUM, MAINNET, RINKEBY } from '@libs/constants';
import { BridgeableAsset } from '@libs/types/General';
import { LogoTicker } from '@components/General/Logo';

type DestinationNetwork = typeof RINKEBY | typeof ARBITRUM_RINKEBY | typeof MAINNET | typeof ARBITRUM;

export const destinationNetworkLookup: Record<string, DestinationNetwork> = {
    [RINKEBY]: ARBITRUM_RINKEBY,
    [ARBITRUM_RINKEBY]: RINKEBY,
    [MAINNET]: ARBITRUM,
    [ARBITRUM]: MAINNET,
};

export const bridgeableTickers: { [symbol: string]: LogoTicker } = {
    ETH: 'ETH',
    USDC: 'USDC',
};

const usdcSharedDetails = {
    name: 'USDC',
    symbol: bridgeableTickers.USDC as LogoTicker,
    decimals: 6,
    displayDecimals: 2,
};

const BRIDGEABLE_ASSET_ETH = {
    name: 'Ethereum',
    symbol: bridgeableTickers.ETH,
    address: null,
    displayDecimals: 6,
    decimals: 18,
};

export type BridgeableAssets = {
    [networkId: string]: BridgeableAsset[];
};

export const bridgeableAssets: BridgeableAssets = {
    [ARBITRUM]: [
        {
            address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
            ...usdcSharedDetails,
        },
        BRIDGEABLE_ASSET_ETH,
    ],
    [ARBITRUM_RINKEBY]: [
        {
            address: '0x1E77ad77925Ac0075CF61Fb76bA35D884985019d',
            ...usdcSharedDetails,
        },
        BRIDGEABLE_ASSET_ETH,
    ],
    [MAINNET]: [
        {
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            ...usdcSharedDetails,
        },
        BRIDGEABLE_ASSET_ETH,
    ],
    [RINKEBY]: [
        {
            address: '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
            ...usdcSharedDetails,
        },
        BRIDGEABLE_ASSET_ETH,
    ],
};

export const isArbitrumNetwork = (networkId: string): boolean =>
    networkId === ARBITRUM || networkId === ARBITRUM_RINKEBY;
