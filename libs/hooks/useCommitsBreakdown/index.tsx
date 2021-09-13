import { useState, useEffect } from 'react';
import { usePools } from '@context/PoolContext';
import { CommitEnum } from '@libs/constants';
import { useCommits } from '@context/UsersCommitContext';
import { useWeb3 } from '@context/Web3Context/Web3Context';

export default (() => {
    const { account = '' } = useWeb3();
    const { commits = {} } = useCommits();
    const { pools = {} } = usePools();
    const [buys, setBuys] = useState<number>(0);
    const [sells, setSells] = useState<number>(0);
    const [nextUpdate, setNextUpdate] = useState<number>(0);

    useEffect(() => {
        if (commits && Object.keys(pools).length) {
            let buys = 0,
                sells = 0,
                nextUpdate = 0;
            const accountLower = account.toLowerCase();
            Object.values(commits).map((commit) => {
                if (commit.from.toLowerCase() !== accountLower) {
                    return;
                }
                if (commit.type === CommitEnum.short_mint || commit.type === CommitEnum.long_mint) {
                    buys += 1;
                } else {
                    sells += 1;
                }
                if (pools[commit.pool]) {
                    const newMin = pools[commit.pool].lastUpdate.plus(pools[commit.pool].updateInterval).toNumber();
                    if (newMin < nextUpdate || nextUpdate === 0) {
                        nextUpdate = newMin; // set new min
                    }
                }
            });
            setBuys(buys);
            setSells(sells);
            setNextUpdate(nextUpdate);
        }
    }, [commits, pools, account]);

    return {
        buys,
        sells,
        nextUpdate,
    };
}) as () => {
    buys: number;
    sells: number;
    nextUpdate: number;
};
