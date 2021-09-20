import { PoolFactory__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
import { StakingRewards__factory } from '@libs/staking/typechain/factories/StakingRewards__factory';

import { ethers } from 'ethers';

export type Network = {
    name: string;
    previewUrl: string;
    contracts: {
        [name: string]: {
            address: string | undefined;
            abi: ethers.ContractInterface;
        };
    };
    farms: {
        address: string;
        abi: ethers.ContractInterface;
        isPoolTokenFarm: boolean;
        token0IsPoolToken?: boolean;
        token1IsPoolToken?: boolean;
    }[];
    hex: string;
    publicRPC: string;
    graphUri: string;
    sushiRouterAddress: string;
    usdcAddress: string;
    knownNonPoolTokenPricePaths?: {
        [address: string]: string[];
    };
};

/**
 * Network store which allows swapping between networks and fetching from different data sources.
 * Keys are the ID of the network.
 * The 0 network is a default network when the user has not connected their address.
 *  The data sources for the 0 network are populated from the env variables.
 * The local config also uses the ENV variables so the commit history is not riddled with updates to
 *  this config.
 * Do not change the other network configs unless the contract addresses have changed.
 */
export const networkConfig: Record<string, Network> = {
    '0': {
        previewUrl: '',
        name: 'Unknown',
        contracts: {},
        farms: [],
        publicRPC: '',
        hex: '',
        graphUri: process.env.NEXT_PUBLIC_GRAPH_URI ?? '',
        sushiRouterAddress: '',
        usdcAddress: '',
    },
    '421611': {
        name: 'Arbitrum Rinkeby',
        previewUrl: 'https://rinkeby-explorer.arbitrum.io/#',
        contracts: {
            poolFactory: {
                address: '0xd51F77C5945dD39a8ec87cAc7E02d85E7e5e182e',
                abi: PoolFactory__factory.abi,
            },
        },
        farms: [
            {
                address: '0xa39fA0857D5967E6Ab3A247b179C474cFE5415A9',
                abi: StakingRewards__factory.abi,
                isPoolTokenFarm: true,
                token1IsPoolToken: false,
            },
            {
                address: '0x6213c21518EF9d4875d9C41F7ad8d16B4f986cB2',
                abi: StakingRewards__factory.abi,
                isPoolTokenFarm: true,
                token1IsPoolToken: false,
            },
        ],
        hex: '0x66EEB',
        publicRPC: 'https://arb-rinkeby.g.alchemy.com/v2/QF3hs2p0H00-8hkAzs6QsdpMABmQkjx_',
        graphUri: 'https://api.thegraph.com/subgraphs/name/tracer-protocol/tracer-arbitrum',
        sushiRouterAddress: '',
        usdcAddress: '',
    },
    '42161': {
        name: 'Arbitrum',
        previewUrl: 'https://explorer.arbitrum.io/#',
        contracts: {
            poolFactory: {
                address: '0x98C58c1cEb01E198F8356763d5CbA8EB7b11e4E2',
                abi: PoolFactory__factory.abi,
            },
        },
        farms: [
            {
                address: '0xA2bACCD1AA980f80b37BC950CE3eE2d5816d7EC0',
                abi: StakingRewards__factory.abi,
                isPoolTokenFarm: true,
            },
            {
                address: '0xD04dDCAEca6bf283A430Cb9E847CEEd5Da419Fa0',
                abi: StakingRewards__factory.abi,
                isPoolTokenFarm: true,
            },
            {
                address: '0xEb05e160D3C1990719aa25d74294783fE4e3D3Ef',
                abi: StakingRewards__factory.abi,
                isPoolTokenFarm: true,
            },
            {
                address: '0xeA4FF5ED11F93AA0Ce7744B1D40093f52eA1cda8',
                abi: StakingRewards__factory.abi,
                isPoolTokenFarm: true,
            },
            {
                address: '0xA18413dC5506A91138e0604C283E36B021b8849B',
                abi: StakingRewards__factory.abi,
                isPoolTokenFarm: true,
            },
            {
                address: '0x9769F208239C740cC40E9CB3427c34513213B83f',
                abi: StakingRewards__factory.abi,
                isPoolTokenFarm: true,
            },
            {
                address: '0x07cCcDC913bCbab246fC6E38E81b0C53AaB3De9b',
                abi: StakingRewards__factory.abi,
                isPoolTokenFarm: true,
            },
            {
                address: '0xE1c9C69a26BD5c6E4b39E6870a4a2B01b4e033bC',
                abi: StakingRewards__factory.abi,
                isPoolTokenFarm: true,
            },
            // SLP farms
            {
                address: '0x1908D6f83DF6E5cbc2DA9CaeF2b88DF78EA22833', // 1-ETH/USD Short/Long
                abi: StakingRewards__factory.abi,
                isPoolTokenFarm: false,
                token0IsPoolToken: true,
                token1IsPoolToken: true,
            },
            {
                address: '0xEC49D9C1A45e135999f88A1B3a6631414Dc26720', // 1-ETH/USD Short/wETH
                abi: StakingRewards__factory.abi,
                isPoolTokenFarm: false,
                token0IsPoolToken: false,
                token1IsPoolToken: true,
            },
            {
                address: '0x5Bc1E7D49a1C5433358317426b7e526367D60CD8', // 3-ETH/USD Short/Long
                abi: StakingRewards__factory.abi,
                isPoolTokenFarm: false,
                token0IsPoolToken: true,
                token1IsPoolToken: true,
            },
            {
                address: '0x04148587eCDE89933FC582E4dC5eE38d8C978b36', // 3-ETH/USD Short/wETH
                abi: StakingRewards__factory.abi,
                isPoolTokenFarm: false,
                token0IsPoolToken: true,
                token1IsPoolToken: false,
            },
            {
                address: '0x71505bc95053d57F9e699BC38A3621b0F564B042', // 1-BTC/USD Short/Long
                abi: StakingRewards__factory.abi,
                isPoolTokenFarm: false,
                token0IsPoolToken: true,
                token1IsPoolToken: true,
            },
            {
                address: '0x97c9F5F75863b8887FEF9CcBBDc05B31d2a34D07', // 1-BTC/USD Short/wBTC
                abi: StakingRewards__factory.abi,
                isPoolTokenFarm: false,
                token0IsPoolToken: true,
                token1IsPoolToken: false,
            },
            {
                address: '0x97C3d137b3158443Cac3006fCDaDeD23Dd9a36da', // 3-BTC/USD Short/Long
                abi: StakingRewards__factory.abi,
                isPoolTokenFarm: false,
                token0IsPoolToken: true,
                token1IsPoolToken: true,
            },
            {
                address: '0x8D56b35A3f50d42Ae39e953448B0138FCDF0894e', // 3-BTC/USD Short/wBTC
                abi: StakingRewards__factory.abi,
                isPoolTokenFarm: false,
                token0IsPoolToken: false,
                token1IsPoolToken: true,
            },
        ],
        hex: '0xA4B1',
        publicRPC: 'https://arb1.arbitrum.io/rpc',
        graphUri: 'TODO',
        sushiRouterAddress: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506',
        usdcAddress: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
        knownNonPoolTokenPricePaths: {
            // wBTC: USDC -> wETH -> wBTC
            '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f': [
                '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // USDC
                '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', // wETH
                '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', // wBTC
            ],
            // wETH: USDC -> wETH -> wBTC
            '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': [
                '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // USDC
                '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', // wETH
            ],
        },
    },
    '42': {
        name: 'Kovan',
        previewUrl: 'https://kovan.etherscan.io',
        contracts: {
            poolFactory: {
                address: '0x24d73Dd9Aa5ca7C7eA59e5aB3B5f5BA9784733F5',
                abi: PoolFactory__factory.abi,
            },
        },
        farms: [],
        publicRPC: 'https://kovan.infura.io/v3/ad68300d4b3e483f8cb54452485b4854',
        hex: '0x2A',
        graphUri: 'https://api.thegraph.com/subgraphs/name/tracer-protocol/tracer-kovan',
        sushiRouterAddress: '',
        usdcAddress: '',
    },
    '1337': {
        name: 'Local',
        previewUrl: '',
        contracts: {
            poolFactory: {
                address: process.env.NEXT_PUBLIC_POOL_FACTORY_ADDRESS,
                abi: PoolFactory__factory.abi,
            },
        },
        hex: '',
        farms: [],
        publicRPC: '',
        graphUri: 'http://localhost:8000/subgraphs/name/dospore/tracer-graph',
        sushiRouterAddress: '',
        usdcAddress: '',
    },
};
