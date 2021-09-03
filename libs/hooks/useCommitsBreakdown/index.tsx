import { useState, useEffect } from 'react';
import { usePools } from '@context/PoolContext';
import { SHORT_MINT, LONG_MINT } from '@libs/constants';
import { useCommits } from '@context/UsersCommitContext';

export default (() => {
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
            Object.values(commits).map((commit) => {
                if (commit.type === SHORT_MINT || commit.type === LONG_MINT) {
                    buys += 1;
                } else {
                    sells += 1;
                }
                const newMin = pools[commit.pool].updateInterval.plus(pools[commit.pool].updateInterval).toNumber();
                if (newMin < nextUpdate) {
                    nextUpdate = newMin; // set new min
                }
            });
            setBuys(buys);
            setSells(sells);
            setNextUpdate(nextUpdate);
        }
    }, [commits, pools]);

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
