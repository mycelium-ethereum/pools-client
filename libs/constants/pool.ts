import { PoolInfo } from '@context/PoolContext/poolDispatch';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import Pool from '@tracer-protocol/pools-js/entities/pool';
import { BigNumber } from 'bignumber.js';
import { NETWORKS } from '@tracer-protocol/pools-js';

export const DEFAULT_POOLSTATE: PoolInfo = {
    poolInstance: Pool.CreateDefault(),
    userBalances: {
        shortToken: {
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
        },
        longToken: {
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
        },
        quoteToken: {
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
        },
        aggregateBalances: {
            longTokens: new BigNumber(0),
            shortTokens: new BigNumber(0),
            quoteTokens: new BigNumber(0),
        },
    },
};

export interface PoolListMap {
    Tracer: {
        verified: string;
        factoryDeployed?: string;
    };
    External: string[];
}

type TokenListMapByNetwork = Partial<Record<KnownNetwork, PoolListMap>>;

/**
 * Mapping of the TokenLists used on each network
 */
export const POOL_LIST_MAP: TokenListMapByNetwork = {
    [NETWORKS.ARBITRUM]: {
        Tracer: {
            verified:
                'https://gist.githubusercontent.com/dospore/8194a94a3d3893263737e48c101adf07/raw/e661bad9f6ab9004164777967c731ccb8d17f2f9/mainnet.json',
        },
        External: [],
    },
    [NETWORKS.ARBITRUM_RINKEBY]: {
        Tracer: {
            verified:
                'https://gist.githubusercontent.com/dospore/8ecc737874cf1726524a922d1c463683/raw/0fbe7c533a79ca479f9c24d76d0701fc2a36da88/arb-rinkeby.json',
        },
        External: [],
    },
};
