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
        isPoolToken: boolean;
    }[];
    hex: string;
    publicRPC: string;
    graphUri: string;
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
                isPoolToken: true,
            },
            {
                address: '0x6213c21518EF9d4875d9C41F7ad8d16B4f986cB2',
                abi: StakingRewards__factory.abi,
                isPoolToken: true,
            },
        ],
        hex: '0x66EEB',
        publicRPC: 'https://arb-rinkeby.g.alchemy.com/v2/QF3hs2p0H00-8hkAzs6QsdpMABmQkjx_',
        graphUri: 'https://api.thegraph.com/subgraphs/name/tracer-protocol/tracer-arbitrum',
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
                isPoolToken: true,
            },
            {
                address: '0xD04dDCAEca6bf283A430Cb9E847CEEd5Da419Fa0',
                abi: StakingRewards__factory.abi,
                isPoolToken: true,
            },
            {
                address: '0xEb05e160D3C1990719aa25d74294783fE4e3D3Ef',
                abi: StakingRewards__factory.abi,
                isPoolToken: true,
            },
            {
                address: '0xeA4FF5ED11F93AA0Ce7744B1D40093f52eA1cda8',
                abi: StakingRewards__factory.abi,
                isPoolToken: true,
            },
            {
                address: '0xA18413dC5506A91138e0604C283E36B021b8849B',
                abi: StakingRewards__factory.abi,
                isPoolToken: true,
            },
            {
                address: '0x9769F208239C740cC40E9CB3427c34513213B83f',
                abi: StakingRewards__factory.abi,
                isPoolToken: true,
            },
            {
                address: '0x07cCcDC913bCbab246fC6E38E81b0C53AaB3De9b',
                abi: StakingRewards__factory.abi,
                isPoolToken: true,
            },
            {
                address: '0xE1c9C69a26BD5c6E4b39E6870a4a2B01b4e033bC',
                abi: StakingRewards__factory.abi,
                isPoolToken: true,
            },
        ],
        hex: '0xA4B1',
        publicRPC: 'https://arb1.arbitrum.io/rpc',
        graphUri: 'TODO',
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
    },
};
