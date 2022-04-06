import { useState, useMemo } from 'react';
import shallow from 'zustand/shallow';
import { DEFAULT_POOLSTATE } from '~/constants/pools';
import { useStore } from '~/store/main';
import { selectPoolInstances } from '~/store/PoolInstancesSlice';
import { PoolInfo } from '~/types/pools';

export const usePool: (pool: string | undefined) => PoolInfo = (pool) => {
    const pools = useStore(selectPoolInstances, shallow);
    const [pool_, setPool] = useState<PoolInfo>(DEFAULT_POOLSTATE);
    useMemo(() => {
        if (pool && pools[pool]) {
            setPool(pools[pool]);
        }
    }, [pool, pools]);

    return pool_;
};
