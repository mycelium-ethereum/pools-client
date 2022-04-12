import { useCallback, useEffect, useReducer, useRef } from 'react';
import { StaticPoolInfo } from '@tracer-protocol/pools-js';
import { useStore } from '~/store/main';
import { StoreState } from '~/store/types';
import { selectNetwork } from '~/store/Web3Slice';
import { flattenAllPoolLists } from '~/utils/poolLists';

// wrapper hook to memoize fetching of poolLists
export const useAllPoolLists = (): StaticPoolInfo[] => {
    // can be used to trigger a state udpate
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const ref = useRef<StaticPoolInfo[]>([]);
    const network = useStore(selectNetwork);
    const poolLists = useStore(
        useCallback((state: StoreState) => network && state.poolsSlice.poolLists[network], [network]),
    );

    useEffect(() => {
        if (!!poolLists) {
            console.count('Flattening pools list');
            ref.current = flattenAllPoolLists(poolLists);
            forceUpdate();
        }
    }, [poolLists]);

    return ref.current;
};
