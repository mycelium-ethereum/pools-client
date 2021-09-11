import { useState, useMemo } from 'react';
import { usePools } from '@context/PoolContext';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { CommitEnum } from '@libs/constants';
import { QueuedCommit } from '@libs/types/General';
import { calcTokenPrice } from '@libs/utils/calcs';
import { useCommits } from '@context/UsersCommitContext';

export default (() => {
    const { account, provider } = useWeb3();
    const { commits = {} } = useCommits();
    const { pools } = usePools();
    const [allQueuedCommits, setAllQueuedCommits] = useState<QueuedCommit[]>([]);

    useMemo(() => {
        // filter user commits
        if (pools && Object.keys(pools).length && provider && account) {
            const parsedCommits = [];
            for (const commit of Object.values(commits)) {
                if (!pools[commit.pool]) {
                    continue;
                }
                const { shortToken, longToken, shortBalance, longBalance, lastUpdate, updateInterval } =
                    pools[commit.pool];

                let token, tokenPrice;

                if (commit.type === CommitEnum.short_mint || commit.type === CommitEnum.short_burn) {
                    token = shortToken;
                    tokenPrice = calcTokenPrice(shortBalance, shortToken.supply);
                } else {
                    token = longToken;
                    tokenPrice = calcTokenPrice(longBalance, longToken.supply);
                }
                parsedCommits.push({
                    ...commit,
                    token,
                    tokenPrice,
                    spent: commit.amount.times(tokenPrice),
                    nextRebalance: lastUpdate.plus(updateInterval),
                });
            }

            setAllQueuedCommits(parsedCommits);
        }
    }, [pools, commits, provider]);

    return allQueuedCommits;
}) as () => QueuedCommit[];
