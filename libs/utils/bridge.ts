import { ARBITRUM_RINKEBY, ARBITRUM_ONE, MAINNET, RINKEBY } from '@libs/constants';
import Inbox from '@libs/abi/arbitrum/Inbox.json';
import { ethers } from 'ethers';

export const destinationNetworkLookup: { [current: number]: string } = {
    [RINKEBY]: ARBITRUM_RINKEBY,
    [ARBITRUM_RINKEBY]: RINKEBY,
    [MAINNET]: ARBITRUM_ONE,
    [ARBITRUM_ONE]: MAINNET,
};

export const bridgeableTokens: { [networkId: string]: { name: string; ticker: string; address: string }[] } = {
    [ARBITRUM_ONE]: [
        {
            address: '',
            name: 'USDC',
            ticker: 'USDC',
        },
    ],
    [ARBITRUM_RINKEBY]: [
        {
            address: '',
            name: 'USDC',
            ticker: 'USDC',
        },
    ],
    [MAINNET]: [
        {
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            name: 'USDC',
            ticker: 'USDC',
        },
    ],
    [RINKEBY]: [
        {
            address: '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
            name: 'USDC',
            ticker: 'USDC',
        },
    ],
};

export const bridgeableTickers = {
    ETH: 'ETH',
    USDC: 'USDC',
};

export const arbitrumContracts: {
    [network: string]: { [name: string]: { address: string; abi: ethers.ContractInterface } };
} = {
    [RINKEBY]: {
        INBOX: {
            address: '0x578BAde599406A8fE3d24Fd7f7211c0911F5B29e',
            abi: Inbox,
        },
    },
};

// export const arbitrumContracts: {
//     [network: string]: { [name: string]: string };
// } = {
//     [RINKEBY]: {
//         l1GatewayRouterAddress: '0x70C143928eCfFaf9F5b406f7f4fC28Dc43d68380',
//         l2GatewayRouterAddress: '0x9413AD42910c1eA60c737dB5f58d1C504498a3cD',
//     },
//     [ARBITRUM_RINKEBY]: {
//         l1GatewayRouterAddress: '0x70C143928eCfFaf9F5b406f7f4fC28Dc43d68380',
//         l2GatewayRouterAddress: '0x9413AD42910c1eA60c737dB5f58d1C504498a3cD',
//     },
// };
