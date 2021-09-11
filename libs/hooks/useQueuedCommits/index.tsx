import { useState, useMemo } from 'react';
import { usePools } from '@context/PoolContext';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { CommitEnum, CommitsFocusEnum } from '@libs/constants';
import { QueuedCommit } from '@libs/types/General';
import { calcTokenPrice } from '@libs/utils/calcs';
import { useCommits } from '@context/UsersCommitContext';

export default ((focus) => {
    const { account, provider } = useWeb3();
    const { commits = {} } = useCommits();
    const { pools } = usePools();
    const [allQueuedCommits, setAllQueuedCommits] = useState<QueuedCommit[]>([]);

    useMemo(() => {
        // filter user commits
        if (pools && Object.keys(pools).length && provider && account) {
            const parsedCommits = [];
            const accountLower = account.toLowerCase();
            for (const commit of Object.values(commits)) {
                if (
                    !pools[commit.pool] || // pools doesnt exist
                    commit.from.toLowerCase() !== accountLower || // not committed by connected account
                    (focus === CommitsFocusEnum.buys &&
                        (commit.type === CommitEnum.short_burn || commit.type === CommitEnum.long_burn))
                ) {
                    continue;
                }
                const {
                    shortToken,
                    longToken,
                    shortBalance,
                    longBalance,
                    lastUpdate,
                    updateInterval,
                    frontRunningInterval,
                } = pools[commit.pool];

                let token, tokenPrice;

                if (commit.type === CommitEnum.short_mint || commit.type === CommitEnum.short_burn) {
                    token = shortToken;
                    tokenPrice = calcTokenPrice(shortBalance, shortToken.supply);
                } else {
                    token = longToken;
                    tokenPrice = calcTokenPrice(longBalance, longToken.supply);
                }

                const nowSeconds = Math.floor(Date.now() / 1000);
                const lockTime = lastUpdate.plus(updateInterval).minus(frontRunningInterval).toNumber();

                parsedCommits.push({
                    ...commit,
                    token,
                    tokenPrice,
                    nextRebalance: lastUpdate.plus(updateInterval),
                    locked: nowSeconds > lockTime,
                });
            }
            setAllQueuedCommits(parsedCommits);
        }
    }, [pools, commits, provider, account, focus]);

    return allQueuedCommits;
}) as (focus: CommitsFocusEnum) => QueuedCommit[];
