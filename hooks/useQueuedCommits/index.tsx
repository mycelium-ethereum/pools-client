import { useState, useMemo } from 'react';
import { CommitEnum, getExpectedExecutionTimestamp } from '@tracer-protocol/pools-js';
import { usePools } from '~/hooks/usePools';
import { useStore } from '~/store/main';
import { selectCommits } from '~/store/PendingCommitSlice';
import { selectWeb3Info } from '~/store/Web3Slice';
import { QueuedCommit } from '~/types/pools';

export default (() => {
    const { account = '', provider } = useStore(selectWeb3Info);
    const commits = useStore(selectCommits);
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
                        // skip this entry
                        continue;
                    }

                    const { poolInstance, userBalances } = pools[commit.pool];

                    const { shortToken, longToken, settlementToken, frontRunningInterval, lastUpdate, updateInterval } =
                        poolInstance;

                    let tokenIn, tokenOut, tokenPrice;

                    if (
                        commit.type === CommitEnum.longMint ||
                        commit.type === CommitEnum.longBurn ||
                        commit.type === CommitEnum.longBurnShortMint
                    ) {
                        tokenIn = {
                            ...shortToken,
                            ...userBalances.shortToken,
                        };
                        tokenOut = {
                            ...longToken,
                            ...userBalances.longToken,
                        };
                        tokenPrice = poolInstance.getNextLongTokenPrice();
                    } else {
                        tokenIn = {
                            ...longToken,
                            ...userBalances.longToken,
                        };
                        tokenOut = {
                            ...shortToken,
                            ...userBalances.shortToken,
                        };
                        tokenPrice = poolInstance.getNextShortTokenPrice();
                    }

                    parsedCommits.push({
                        ...commit,
                        tokenIn,
                        tokenOut,
                        tokenPrice,
                        nextRebalance: lastUpdate.plus(updateInterval),
                        frontRunningInterval: frontRunningInterval,
                        updateInterval: updateInterval,
                        settlementTokenSymbol: settlementToken.symbol,
                        expectedExecution: getExpectedExecutionTimestamp(
                            frontRunningInterval.toNumber(),
                            updateInterval.toNumber(),
                            lastUpdate.toNumber(),
                            commit.created,
                        ),
                    });
                }
            }
            setAllQueuedCommits(parsedCommits);
        }
    }, [pools, commits, provider, account]);

    return allQueuedCommits;
}) as () => QueuedCommit[];
