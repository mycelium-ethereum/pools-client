import { KnownNetwork } from '@tracer-protocol/pools-js';
import { PoolLists } from '~/types/poolLists';

export interface IPoolsSlice {
    poolLists: Partial<Record<KnownNetwork, PoolLists>>;
    setPoolLists: (network: KnownNetwork, lists: PoolLists) => void;

    importPool: (network: KnownNetwork, pool: string) => void;

    fetchPoolLists: (network: KnownNetwork) => Promise<void>;

    getExistingPoolLists: (network: KnownNetwork) => PoolLists | undefined;
}
