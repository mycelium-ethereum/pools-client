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
        name: 'Select Network',
        contracts: {},
        graphUri: process.env.NEXT_PUBLIC_GRAPH_URI ?? '',
    },
    '421611': {
        name: 'Arbitrum',
        previewUrl: 'https://rinkeby-explorer.arbitrum.io/#',
        contracts: {
            poolFactory: {
                address: '0xcD95A675eD9df9b7f280E6C0BE5199DA574A7B3b',
                abi: PoolFactory__factory.abi,
            },
        },
        graphUri: 'https://api.thegraph.com/subgraphs/name/tracer-protocol/tracer-arbitrum',
    },
    '42': {
        name: 'Kovan',
        previewUrl: 'https://kovan.etherscan.io',
        contracts: {
            poolFactory: {
                address: '0x2e2A925EF653aa7e246F0587dFE86805E0e65B12',
                abi: PoolFactory__factory.abi,
            },
        },
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
        graphUri: 'http://localhost:8000/subgraphs/name/dospore/tracer-graph',
    },
};
