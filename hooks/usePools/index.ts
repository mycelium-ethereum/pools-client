import { useStore } from '~/store/main';
import { selectPoolInstances, selectPoolsInitialized } from '~/store/PoolInstancesSlice';
import { PoolInfo } from '~/types/pools';

export const usePools: () => {
    pools: Record<string, PoolInfo>;
    poolsInitialized: boolean;
} = () => {
    const pools = useStore(selectPoolInstances);
    const poolsInitialized = useStore(selectPoolsInitialized);
    return {
        pools,
        poolsInitialized,
    };
};

export default usePools;
