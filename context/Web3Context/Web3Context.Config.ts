import { PoolFactory__factory } from '@tracer-protocol/perpetual-pools-contracts/types';

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
        hex: '0x66EEB',
        publicRPC: 'https://arb-rinkeby.g.alchemy.com/v2/QF3hs2p0H00-8hkAzs6QsdpMABmQkjx_',
        graphUri: 'https://api.thegraph.com/subgraphs/name/tracer-protocol/tracer-arbitrum',
    },
    '42161': {
        name: 'Arbitrum',
        previewUrl: 'https://explorer.arbitrum.io/#',
        contracts: {
            poolFactory: {
                address: 'TODO',
                abi: PoolFactory__factory.abi,
            },
        },
        hex: '0xA4B1',
        publicRPC: 'TODO',
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
        publicRPC: '',
        graphUri: 'http://localhost:8000/subgraphs/name/dospore/tracer-graph',
    },
};
