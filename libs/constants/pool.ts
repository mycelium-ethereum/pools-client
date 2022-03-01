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
                'https://raw.githubusercontent.com/tracer-protocol/pools-js/release/v2/src/data/static/arbitrum.json',
        },
        External: [],
    },
    [NETWORKS.ARBITRUM_RINKEBY]: {
        Tracer: {
            verified: 'https://api.tracer.finance/poolsv2/poolList?network=421611',
        },
        External: [],
    },
};
