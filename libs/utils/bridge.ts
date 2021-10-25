import { ARBITRUM_RINKEBY, ARBITRUM, MAINNET, RINKEBY } from '@libs/constants';
import { BridgeableAsset } from '@libs/types/General';
import { LogoTicker } from '@components/General/Logo';
import BigNumber from 'bignumber.js';

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

type KnownAssetAddressesByNetwork = { [networkId: string]: { [ticker: string]: string } };
const knownAssetAddressesByNetwork: KnownAssetAddressesByNetwork = {
    [ARBITRUM]: {
        [bridgeableTickers.USDC]: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    },
    [ARBITRUM_RINKEBY]: {
        [bridgeableTickers.USDC]: '0x1E77ad77925Ac0075CF61Fb76bA35D884985019d',
    },
    [MAINNET]: {
        [bridgeableTickers.USDC]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    },
    [RINKEBY]: {
        [bridgeableTickers.USDC]: '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
    },
};

export const bridgeableAssets: BridgeableAssets = {
    [ARBITRUM]: [
        {
            address: knownAssetAddressesByNetwork[ARBITRUM][bridgeableTickers.USDC],
            ...usdcSharedDetails,
        },
        BRIDGEABLE_ASSET_ETH,
    ],
    [ARBITRUM_RINKEBY]: [
        {
            address: knownAssetAddressesByNetwork[ARBITRUM_RINKEBY][bridgeableTickers.USDC],
            ...usdcSharedDetails,
        },
        BRIDGEABLE_ASSET_ETH,
    ],
    [MAINNET]: [
        {
            address: knownAssetAddressesByNetwork[MAINNET][bridgeableTickers.USDC],
            ...usdcSharedDetails,
        },
        BRIDGEABLE_ASSET_ETH,
    ],
    [RINKEBY]: [
        {
            address: knownAssetAddressesByNetwork[RINKEBY][bridgeableTickers.USDC],
            ...usdcSharedDetails,
        },
        BRIDGEABLE_ASSET_ETH,
    ],
};

const minUSDCWarning =
    'Please note that the minimum order size for Perpetual Pools is $1,000 USDC. Ensure that you deposit enough USDC to meet the order size requirement.';
type BridgeableAssetWarnings = {
    [networkId: string]: {
        [ticker: string]: { getWarningText: ({ amount }: { amount: BigNumber }) => string | null };
    };
};
export const bridgeableAssetWarnings: BridgeableAssetWarnings = {
    [MAINNET]: {
        [bridgeableTickers.USDC]: {
            getWarningText: ({ amount }) => {
                if (amount.lt(1000)) {
                    return minUSDCWarning;
                }
                return null;
            },
        },
    },
    [RINKEBY]: {
        [bridgeableTickers.USDC]: {
            getWarningText: ({ amount }) => {
                if (amount.lt(1000)) {
                    return minUSDCWarning;
                }
                return null;
            },
        },
    },
};

export const isArbitrumNetwork = (networkId: string): boolean =>
    networkId === ARBITRUM || networkId === ARBITRUM_RINKEBY;
