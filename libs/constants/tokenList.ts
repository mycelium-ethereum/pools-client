import { LogoTicker } from '@components/General';
import { AvailableNetwork } from '@context/Web3Context/Web3Context.Config';
import { StaticTokenInfo } from '@tracer-protocol/pools-js/dist/types/types';
import { ARBITRUM, ARBITRUM_RINKEBY, MAINNET, RINKEBY } from '.';

const tokenList: Record<AvailableNetwork, StaticTokenInfo[]> = {
    [ARBITRUM]: [
        {
            name: 'USDC',
            symbol: 'USDC',
            decimals: 6,
            address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
        },
    ],
    [ARBITRUM_RINKEBY]: [
        {
            name: 'USDC',
            symbol: 'USDC',
            decimals: 6,
            address: '0x1E77ad77925Ac0075CF61Fb76bA35D884985019d',
        },
    ],
    [MAINNET]: [
        {
            name: 'USDC',
            symbol: 'USDC',
            decimals: 6,
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        },
    ],
    [RINKEBY]: [
        {
            name: 'USDC',
            symbol: 'USDC',
            decimals: 6,
            address: '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
        },
    ],
    '0': [],
    '1337': [],
};

export const tokenMap: Record<AvailableNetwork, Record<LogoTicker, StaticTokenInfo>> = Object.assign(
    {},
    ...Object.keys(tokenList).map((key) => ({
        [key]: Object.assign(
            {},
            ...tokenList[key as AvailableNetwork].map((token) => ({
                [token.symbol]: {
                    ...token,
                },
            })),
        ),
    })),
);
