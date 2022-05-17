import { useState, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import shallow from 'zustand/shallow';
import { CommitEnum, getExpectedExecutionTimestamp } from '@tracer-protocol/pools-js';
import { usePools } from '~/hooks/usePools';
import { useStore } from '~/store/main';
import { selectCommits } from '~/store/PendingCommitSlice';
import { selectWeb3Info } from '~/store/Web3Slice';
import { QueuedCommit } from '~/types/commits';
import { LoadingRows } from '~/types/hooks';

type Token = QueuedCommit['tokenIn'] | QueuedCommit['tokenOut'];

export const useQueuedCommits = (): LoadingRows<QueuedCommit> => {
    const { account = '', provider } = useStore(selectWeb3Info, shallow);
    const commits = useStore(selectCommits);
    const { pools, isLoadingPools } = usePools();
    const [rows, setRows] = useState<QueuedCommit[]>([]);

    useMemo(() => {
        // filter user commits
        if (pools && Object.keys(pools).length && provider && account) {
            const parsedCommits: QueuedCommit[] = [];
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

                    const { poolInstance } = pools[commit.pool];

                    const { shortToken, longToken, settlementToken, frontRunningInterval, lastUpdate, updateInterval } =
                        poolInstance;

                    let tokenIn, tokenOut;

                    const parsedSettlementToken: Token = {
                        name: settlementToken.name,
                        symbol: settlementToken.symbol,
                        address: settlementToken.address,
                        decimals: settlementToken.decimals,
                        price: new BigNumber(1),
                        amount: commit.amount,
                    };
                    const parsedLongToken: Token = {
                        name: longToken.name,
                        symbol: longToken.symbol,
                        address: longToken.address,
                        decimals: longToken.decimals,
                        price: poolInstance.getNextLongTokenPrice(),
                        amount: commit.amount,
                        isLong: true,
                    };
                    const parsedShortToken: Token = {
                        name: shortToken.name,
                        symbol: shortToken.symbol,
                        address: shortToken.address,
                        decimals: shortToken.decimals,
                        price: poolInstance.getNextShortTokenPrice(),
                        amount: commit.amount,
                        isLong: false,
                    };

                    if (commit.type === CommitEnum.longMint) {
                        tokenIn = parsedSettlementToken;
                        tokenOut = {
                            ...parsedLongToken,
                            amount: commit.amount.div(parsedLongToken.price),
                        };
                    } else if (commit.type === CommitEnum.shortMint) {
                        tokenIn = parsedSettlementToken;
                        tokenOut = {
                            ...parsedShortToken,
                            amount: commit.amount.div(parsedShortToken.price),
                        };
                    } else if (commit.type === CommitEnum.longBurn) {
                        tokenIn = parsedLongToken;
                        tokenOut = {
                            ...parsedSettlementToken,
                            amount: commit.amount.times(parsedLongToken.price),
                        };
                    } else if (commit.type === CommitEnum.shortBurn) {
                        tokenIn = parsedShortToken;
                        tokenOut = {
                            ...parsedSettlementToken,
                            amount: commit.amount.times(parsedShortToken.price),
                        };
                    } else if (commit.type === CommitEnum.longBurnShortMint) {
                        // flips
                        tokenIn = parsedLongToken;
                        tokenOut = {
                            ...parsedShortToken,
                            amount: commit.amount.times(parsedLongToken.price).div(parsedShortToken.price), // estimate
                        };
                    } else {
                        // shortBurnLongMint
                        tokenIn = parsedShortToken;
                        tokenOut = {
                            ...parsedLongToken,
                            amount: commit.amount.times(parsedShortToken.price).div(parsedLongToken.price), // estimate
                        };
                    }

                    parsedCommits.push({
                        ...commit,
                        tokenIn,
                        tokenOut,
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
            setRows(parsedCommits);
        }
    }, [pools, commits, provider, account]);

    return {
        rows,
        isLoading: isLoadingPools && rows.length === 0,
    };
};

export default useQueuedCommits;
