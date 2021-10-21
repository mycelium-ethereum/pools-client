import { useState, useMemo } from 'react';
import { usePools } from '@context/PoolContext';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { CommitEnum } from '@libs/constants';
import { QueuedCommit } from '@libs/types/General';
import { calcTokenPrice } from '@tracer-protocol/tracer-pools-utils';
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
                    const {
                        shortToken,
                        longToken,
                        nextShortBalance,
                        nextLongBalance,
                        lastUpdate,
                        updateInterval,
                        committer: {
                            pendingLong: { burn: pendingLongBurn },
                            pendingShort: { burn: pendingShortBurn },
                        },
                    } = pools[commit.pool];

                    let token, tokenPrice;

                    if (commit.type === CommitEnum.short_mint || commit.type === CommitEnum.short_burn) {
                        token = shortToken;
                        tokenPrice = calcTokenPrice(nextShortBalance, shortToken.supply.plus(pendingShortBurn));
                    } else {
                        token = longToken;
                        tokenPrice = calcTokenPrice(nextLongBalance, longToken.supply.plus(pendingLongBurn));
                    }

                    parsedCommits.push({
                        ...commit,
                        token,
                        tokenPrice,
                        nextRebalance: lastUpdate.plus(updateInterval),
                        frontRunningInterval: pools[commit.pool].frontRunningInterval,
                        updateInterval: updateInterval,
                    });
                }
            }
            setAllQueuedCommits(parsedCommits);
        }
    }, [pools, commits, provider, account]);

    return allQueuedCommits;
}) as () => QueuedCommit[];
