import { PoolKeeper__factory, PoolFactory__factory, TestOracle__factory } from '@libs/types/typechain';
import { ethers } from 'ethers';

export type Network = {
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
        contracts: {},
        graphUri: process.env.NEXT_PUBLIC_GRAPH_URI ?? '',
    },
    '421611': {
        // arbitrum
        previewUrl: 'https://rinkeby-explorer.arbitrum.io/#',
        contracts: {
            poolKeeper: {
                address: '0xe3aB9987a8A8331b85A651fEb85855c6548CD0Db',
                abi: PoolKeeper__factory.abi,
            },
            poolFactory: {
                address: '0xcD95A675eD9df9b7f280E6C0BE5199DA574A7B3b',
                abi: PoolFactory__factory.abi,
            },
            oracleWrapper: {
                address: '0xF8f2A07D299c1683E8F06611733908D135700d14',
                abi: TestOracle__factory.abi,
            },
        },
        graphUri: 'https://api.thegraph.com/subgraphs/name/tracer-protocol/tracer-arbitrum',
    },
    '42': {
        previewUrl: 'https://kovan.etherscan.io',
        contracts: {
            poolKeeper: {
                address: '0xe3aB9987a8A8331b85A651fEb85855c6548CD0Db',
                abi: PoolKeeper__factory.abi,
            },
            poolFactory: {
                address: '0xcD95A675eD9df9b7f280E6C0BE5199DA574A7B3b',
                abi: PoolFactory__factory.abi,
            },
            oracleWrapper: {
                address: '0xF8f2A07D299c1683E8F06611733908D135700d14',
                abi: TestOracle__factory.abi,
            },
        },
        graphUri: 'https://api.thegraph.com/subgraphs/name/tracer-protocol/tracer-kovan',
    },
    '1337': {
        // local
        previewUrl: '',
        contracts: {
            poolKeeper: {
                address: process.env.NEXT_PUBLIC_POOL_KEEPER_ADDRESS,
                abi: PoolKeeper__factory.abi,
            },
            poolFactory: {
                address: process.env.NEXT_PUBLIC_POOL_FACTORY_ADDRESS,
                abi: PoolFactory__factory.abi,
            },
            oracleWrapper: {
                address: process.env.NEXT_PUBLIC_POOL_ORACLE_ADDRESS,
                abi: TestOracle__factory.abi,
            },
        },
        graphUri: 'http://localhost:8000/subgraphs/name/dospore/tracer-graph',
    },
};
