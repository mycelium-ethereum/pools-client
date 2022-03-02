import { useState, useMemo } from 'react';
import { usePools } from '@context/PoolContext';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { QueuedCommit } from '@libs/types/General';
import { useCommits } from '@context/UsersCommitContext';
import { CommitEnum } from '@tracer-protocol/pools-js';

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
                    const { poolInstance, userBalances } = pools[commit.pool];

                    const { shortToken, longToken, quoteToken, frontRunningInterval, lastUpdate, updateInterval } =
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
                        quoteTokenSymbol: quoteToken.symbol,
                    });
                }
            }
            setAllQueuedCommits(parsedCommits);
        }
    }, [pools, commits, provider, account]);

    return allQueuedCommits;
}) as () => QueuedCommit[];
