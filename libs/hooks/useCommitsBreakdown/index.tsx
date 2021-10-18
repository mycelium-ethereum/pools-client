import { useState, useEffect } from 'react';
import { usePools } from '@context/PoolContext';
import { CommitEnum } from '@libs/constants';
import { useCommits } from '@context/UsersCommitContext';
import { useWeb3 } from '@context/Web3Context/Web3Context';

export default (() => {
    const { account = '' } = useWeb3();
    const { commits = {} } = useCommits();
    const { pools = {} } = usePools();
    const [pendingCommits, setPendingCommits] = useState<number>(0);
    const [claimable, setClaimable] = useState<number>(0);
    const [nextUpdate, setNextUpdate] = useState<number>(0);

    useEffect(() => {
        if (Object.keys(pools).length && account) {
            let pendingCommits = 0,
                claimable = 0,
                nextUpdate = 0;
            Object.values(commits).map((commit) => {
                console.log(commits, "Commits")
                if (commit.type === CommitEnum.short_mint || commit.type === CommitEnum.long_mint) {
                    pendingCommits += 1;
                } else {
                    claimable += 1;
                }
                if (pools[commit.pool]) {
                    const newMin = pools[commit.pool].lastUpdate.plus(pools[commit.pool].updateInterval).toNumber();
                    if (newMin < nextUpdate || nextUpdate === 0) {
                        nextUpdate = newMin; // set new min
                    }
                }
            });
            setPendingCommits(pendingCommits);
            setClaimable(claimable);
            setNextUpdate(nextUpdate);
        }
    }, [commits, pools, account]);

    return {
        pendingCommits,
        claimable,
        nextUpdate,
    };
}) as () => {
    pendingCommits: number;
    claimable: number;
    nextUpdate: number;
};
