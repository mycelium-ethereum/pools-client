import { ARBITRUM_RINKEBY, ARBITRUM, MAINNET, RINKEBY } from '@libs/constants';
// import Inbox from '@libs/abi/arbitrum/Inbox.json';

export const destinationNetworkLookup: { [current: number]: string } = {
    [RINKEBY]: ARBITRUM_RINKEBY,
    [ARBITRUM_RINKEBY]: RINKEBY,
    [MAINNET]: ARBITRUM,
    [ARBITRUM]: MAINNET,
};

export const bridgeableTokens: {
    [networkId: string]: { name: string; symbol: string; address: string; decimals: number }[];
} = {
    [ARBITRUM]: [
        {
            address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
            name: 'USDC',
            symbol: 'USDC',
            decimals: 6,
        },
    ],
    [ARBITRUM_RINKEBY]: [
        {
            address: '0x1E77ad77925Ac0075CF61Fb76bA35D884985019d',
            name: 'USDC',
            symbol: 'USDC',
            decimals: 6,
        },
    ],
    [MAINNET]: [
        {
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            name: 'USDC',
            symbol: 'USDC',
            decimals: 6,
        },
    ],
    [RINKEBY]: [
        {
            address: '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
            name: 'USDC',
            symbol: 'USDC',
            decimals: 6,
        },
    ],
};

export const bridgeableTickers = {
    ETH: 'ETH',
    USDC: 'USDC',
};
