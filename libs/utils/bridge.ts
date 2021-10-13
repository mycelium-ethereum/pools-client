import { ARBITRUM_RINKEBY, ARBITRUM, MAINNET, RINKEBY } from '@libs/constants';
import { BridgeableAsset } from '@libs/types/General';
import { LogoTicker } from '@components/General/Logo';

export const destinationNetworkLookup: { [current: number]: string } = {
    [RINKEBY]: ARBITRUM_RINKEBY,
    [ARBITRUM_RINKEBY]: RINKEBY,
    [MAINNET]: ARBITRUM,
    [ARBITRUM]: MAINNET,
};

const usdcSharedDetails = {
    name: 'USDC',
    symbol: 'USDC' as LogoTicker,
    decimals: 6,
    displayDecimals: 2,
};

export const bridgeableTokens: {
    [networkId: string]: BridgeableAsset[];
} = {
    [ARBITRUM]: [
        {
            address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
            ...usdcSharedDetails,
        },
    ],
    [ARBITRUM_RINKEBY]: [
        {
            address: '0x1E77ad77925Ac0075CF61Fb76bA35D884985019d',
            ...usdcSharedDetails,
        },
    ],
    [MAINNET]: [
        {
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            ...usdcSharedDetails,
        },
    ],
    [RINKEBY]: [
        {
            address: '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
            ...usdcSharedDetails,
        },
    ],
};

export const bridgeableTickers = {
    ETH: 'ETH',
    USDC: 'USDC',
} as const;
