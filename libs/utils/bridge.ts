import { ARBITRUM_RINKEBY, ARBITRUM, MAINNET, RINKEBY } from '@libs/constants';
// import Inbox from '@libs/abi/arbitrum/Inbox.json';
import { IInbox__factory, ArbSys__factory, GatewayRouter__factory } from 'arb-ts/dist/lib/abi';
import { ethers } from 'ethers';

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
            address: '',
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

export const arbitrumContracts: {
    [network: string]: { [name: string]: { address: string; abi: ethers.ContractInterface } };
} = {
    [RINKEBY]: {
        INBOX: {
            address: '0x578BAde599406A8fE3d24Fd7f7211c0911F5B29e',
            abi: IInbox__factory.abi,
        },
        GATEWAY_ROUTER: {
            address: '0x70C143928eCfFaf9F5b406f7f4fC28Dc43d68380',
            abi: GatewayRouter__factory.abi,
        },
    },
    [ARBITRUM_RINKEBY]: {
        ARBSYS: {
            address: '0x0000000000000000000000000000000000000064',
            abi: ArbSys__factory.abi,
        },
        GATEWAY_ROUTER: {
            address: '0x9413AD42910c1eA60c737dB5f58d1C504498a3cD',
            abi: GatewayRouter__factory.abi,
        },
    },
};
