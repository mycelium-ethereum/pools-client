import { useState, useMemo } from 'react';
import { usePools } from '@context/PoolContext';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { CommitEnum } from '@tracer-protocol/pools-js/types/enums';
import { QueuedCommit } from '@libs/types/General';
import { useCommits } from '@context/UsersCommitContext';

export default (() => {
    const { account = '', provider } = useWeb3();
    const { commits = {} } = useCommits();
    const { pools } = usePools();
    const [allQueuedCommits, setAllQueuedCommits] = useState<QueuedCommit[]>([]);

    useMemo(() => {
        // filter user commits
        if (pools && Object.keys(pools).length && provider && account) {
            const parsedCommits = [];
            const accountLower = account?.toLowerCase();
            for (const pool of Object.values(commits)) {
                for (const commit of Object.values(pool)) {
                    if (
                        !pools[commit.pool] || // pools doesnt exist
                        commit.from?.toLowerCase() !== accountLower // not committed by connected account
                    ) {
                        continue;
                    }
                    const pool = pools[commit.pool].poolInstance;
                    const { shortToken, longToken, lastUpdate, updateInterval, frontRunningInterval } =
                        pools[commit.pool].poolInstance;

                    let token, tokenPrice;

                    if (commit.type === CommitEnum.shortMint || commit.type === CommitEnum.shortBurn) {
                        token = shortToken;
                        tokenPrice = pool.getNextLongTokenPrice();
                    } else {
                        token = longToken;
                        tokenPrice = pool.getNextShortTokenPrice();
                    }

                    parsedCommits.push({
                        ...commit,
                        token,
                        tokenPrice,
                        nextRebalance: lastUpdate.plus(updateInterval),
                        frontRunningInterval: frontRunningInterval,
                        updateInterval: updateInterval,
                    });
                }
            }
            setAllQueuedCommits(parsedCommits);
        }
    }, [pools, commits, provider, account]);

    return allQueuedCommits;
}) as () => QueuedCommit[];
