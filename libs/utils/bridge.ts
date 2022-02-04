import { ARBITRUM_RINKEBY, ARBITRUM, MAINNET, RINKEBY } from '@libs/constants';
import { BridgeableAsset } from '@libs/types/General';
import { LogoTicker } from '@components/General/Logo';
import BigNumber from 'bignumber.js';
import { tokenMap } from '@tracer-protocol/pools-js/data';

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
    displayDecimals: 2,
};

const BRIDGEABLE_ASSET_ETH = {
    name: 'Ethereum',
    symbol: bridgeableTickers.ETH,
    address: null,
    displayDecimals: 6,
    decimals: 18,
};

const BRIDGEABLE_ASSET_USDC = {
    name: 'USDC',
    symbol: bridgeableTickers.USDC,
    address: null,
    displayDecimals: 6,
    decimals: 6,
};

export type BridgeableAssets = {
    [networkId: string]: BridgeableAsset[];
};

export const bridgeableAssets: BridgeableAssets = {
    [ARBITRUM]: [
        {
            ...tokenMap[ARBITRUM][bridgeableTickers.USDC],
            symbol: tokenMap[ARBITRUM][bridgeableTickers.USDC].symbol as LogoTicker,
            ...usdcSharedDetails,
        },
        BRIDGEABLE_ASSET_ETH,
    ],
    [ARBITRUM_RINKEBY]: [
        {
            ...tokenMap[ARBITRUM_RINKEBY][bridgeableTickers.USDC],
            symbol: tokenMap[ARBITRUM_RINKEBY][bridgeableTickers.USDC].symbol as LogoTicker,
            ...usdcSharedDetails,
        },
        BRIDGEABLE_ASSET_ETH,
    ],
    [MAINNET]: [
        {
            ...tokenMap[MAINNET][bridgeableTickers.USDC],
            symbol: tokenMap[MAINNET][bridgeableTickers.USDC].symbol as LogoTicker,
            ...usdcSharedDetails,
        },
        BRIDGEABLE_ASSET_ETH,
    ],
    [RINKEBY]: [
        {
            ...tokenMap[RINKEBY][bridgeableTickers.USDC],
            symbol: tokenMap[RINKEBY][bridgeableTickers.USDC].symbol as LogoTicker,
            ...usdcSharedDetails,
        },
        BRIDGEABLE_ASSET_ETH,
    ],
    DEFAULT: [BRIDGEABLE_ASSET_USDC, BRIDGEABLE_ASSET_ETH],
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
