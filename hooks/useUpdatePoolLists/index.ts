import { useMemo } from 'react';
import { useStore } from '~/store/main';
import { selectFetchPools } from '~/store/PoolsSlice';
import { selectNetwork } from '~/store/Web3Slice';

// custom hook fetchPools on network change
// poolLists are cache within the store
export const useUpdatePoolLists: () => void = () => {
    const network = useStore(selectNetwork);

    const fetchPools = useStore(selectFetchPools);

    // getPoolsList
    useMemo(() => {
        if (network) {
            console.count(`Fetching pools: ${network}`);
            fetchPools(network);
        }
    }, [network]);
};
