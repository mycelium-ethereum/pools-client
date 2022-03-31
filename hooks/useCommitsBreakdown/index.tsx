import { useState, useEffect } from 'react';
import { CommitEnum } from '@tracer-protocol/pools-js';
import { usePools } from '~/context/PoolContext';
import { useStore } from '~/store/main';
import { selectCommits } from '~/store/PendingCommitSlice';
import { selectAccount } from '~/store/Web3Slice';

export default (() => {
    const account = useStore(selectAccount);
    const commits = useStore(selectCommits);
    const { pools = {} } = usePools();
    const [mints, setMints] = useState<number>(0);
    const [burns, setBurns] = useState<number>(0);
    const [nextUpdate, setNextUpdate] = useState<number>(0);

    useEffect(() => {
        if (Object.keys(pools).length && account) {
            let mints = 0,
                burns = 0,
                nextUpdate_ = 0;
            const accountLower = account?.toLowerCase();
            Object.values(commits).map((pool) => {
                Object.values(pool).map((commit) => {
                    if (commit.from?.toLowerCase() !== accountLower) {
                        return;
                    }
                    if (commit.type === CommitEnum.shortMint || commit.type === CommitEnum.longMint) {
                        mints += 1;
                    } else {
                        burns += 1;
                    }
                    if (pools[commit.pool]) {
                        const newMin = pools[commit.pool].poolInstance.lastUpdate
                            .plus(pools[commit.pool].poolInstance.updateInterval)
                            .toNumber();
                        if (newMin < nextUpdate_ || nextUpdate_ === 0) {
                            nextUpdate_ = newMin; // set new min
                        }
                    }
                });
            });
            setMints(mints);
            setBurns(burns);
            setNextUpdate(nextUpdate_);
        }
    }, [commits, pools, account]);

    return {
        mints,
        burns,
        nextUpdate,
    };
}) as () => {
    mints: number;
    burns: number;
    nextUpdate: number;
};
