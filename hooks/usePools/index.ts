import { useStore } from '~/store/main';
import {
    selectPoolInstances,
    selectPoolsInitialized,
    selectPoolsInitializationError,
} from '~/store/PoolInstancesSlice';
import { PoolInfo } from '~/types/pools';

export const usePools: () => {
    pools: Record<string, PoolInfo>;
    isLoadingPools: boolean;
    poolsInitialized: boolean;
} = () => {
    const pools = useStore(selectPoolInstances);
    const poolsInitialized = useStore(selectPoolsInitialized);
    const poolsInitializationError = useStore(selectPoolsInitializationError);
    return {
        pools,
        poolsInitialized,
        isLoadingPools: !poolsInitialized && !poolsInitializationError,
    };
};

export default usePools;
