import React, { useContext, useReducer, useState } from 'react';
import { Children, CommitType, Pool } from '@libs/types/General';
import { FactoryContext } from '../FactoryContext';
import { useEffect } from 'react';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { reducer, initialPoolState } from './poolDispatch';
import { fetchTokenBalances, initPool, fetchCommits } from './helpers';
import { useMemo } from 'react';
import { ethers, BigNumber as EthersBigNumber } from 'ethers';
import { DEFAULT_POOLSTATE } from '@libs/constants/pool';
import BigNumber from 'bignumber.js';
import {
    LeveragedPool,
    LeveragedPool__factory,
    PoolCommitter,
    PoolCommitter__factory,
    PoolToken,
    PoolToken__factory,
} from '@tracer-protocol/perpetual-pools-contracts/types';
import { LONG, LONG_BURN, LONG_MINT, SHORT, SHORT_BURN, SHORT_MINT } from '@libs/constants';
import { useTransactionContext } from '@context/TransactionContext';
import { useCommitActions } from '@context/UsersCommitContext';

interface ContextProps {
    pools: Record<string, Pool>;
}

interface ActionContextProps {
    commit: (pool: string, commitType: CommitType, amount: number) => void;
    approve: (pool: string) => void;
    uncommit: (pool: string, commitID: number) => void;
}

interface SelectedPoolContextProps {
    pool: Pool;
}

export const PoolsContext = React.createContext<Partial<ContextProps>>({});
export const PoolsActionsContext = React.createContext<Partial<ActionContextProps>>({});
export const SelectedPoolContext = React.createContext<Partial<SelectedPoolContextProps>>({});

/**
 * Wrapper store for the swap page state
 */
export const PoolStore: React.FC<Children> = ({ children }: Children) => {
    const { pools } = useContext(FactoryContext);
    const { provider, account, signer } = useWeb3();
    const { handleTransaction } = useTransactionContext();
    const { commitDispatch = () => console.error('Commit dispatch undefined') } = useCommitActions();
    // const { handleTransaction } = useContext(TransactionContext);
    const [poolsState, poolsDispatch] = useReducer(reducer, initialPoolState);

    /** If pools changes then re-init them */
    useMemo(() => {
        // if pools from factory change
        if (pools && provider) {
            poolsDispatch({ type: 'resetPools' });
            Promise.all(pools.map((pool) => initPool(pool, provider)))
                .then((res) => {
                    res.forEach((pool) => {
                        poolsDispatch({ type: 'setPool', pool: pool, key: pool.address });
                    });
                    if (res.length) {
                        // if pools exist
                        poolsDispatch({ type: 'setPoolsInitialised', value: true });
                    }
                })
                .catch((err) => {
                    console.error('Failed to initialise pools', err);
                    poolsDispatch({ type: 'setPoolsInitialised', value: false });
                });
        }
    }, [provider, pools]);

    // if the account or provider changes update the account balances for each pool
    // as well as the pending user commits
    useEffect(() => {
        if (account && provider && poolsState.poolsInitialised) {
            Object.values(poolsState.pools).map((pool) => {
                // get and set token balances
                const tokens = [pool.shortToken.address, pool.longToken.address, pool.quoteToken.address];
                fetchTokenBalances(tokens, provider, account, pool.address).then((balances) => {
                    console.debug(
                        'Balances',
                        ethers.utils.formatEther(balances[0][1]),
                        ethers.utils.formatEther(balances[1][1]),
                        ethers.utils.formatEther(balances[2][1]),
                    );
                    const shortTokenBalance = new BigNumber(ethers.utils.formatEther(balances[0][0]));
                    const longTokenBalance = new BigNumber(ethers.utils.formatEther(balances[1][0]));
                    const quoteTokenBalance = new BigNumber(ethers.utils.formatEther(balances[2][0]));
                    poolsDispatch({
                        type: 'setTokenBalances',
                        pool: pool.address,
                        shortToken: {
                            balance: shortTokenBalance,
                            approved: new BigNumber(ethers.utils.formatEther(balances[0][1])).gte(shortTokenBalance),
                        },
                        longToken: {
                            balance: longTokenBalance,
                            approved: new BigNumber(ethers.utils.formatEther(balances[1][1])).gte(longTokenBalance),
                        },
                        quoteToken: {
                            balance: quoteTokenBalance,
                            approved: new BigNumber(ethers.utils.formatEther(balances[2][1])).gte(quoteTokenBalance),
                        },
                    });
                });

                // fetch commits
                try {
                    commitDispatch({ type: 'resetCommits' });
                    fetchCommits(pool.committer.address, provider, account).then((committerInfo) => {
                        poolsDispatch({
                            type: 'addToPending',
                            pool: pool.address,
                            side: LONG,
                            amount: committerInfo.pendingLong,
                        });
                        poolsDispatch({
                            type: 'addToPending',
                            pool: pool.address,
                            side: SHORT,
                            amount: committerInfo.pendingShort,
                        });

                        committerInfo.allUnexecutedCommits.map((commit) => {
                            commitDispatch({
                                type: 'addCommit',
                                commitInfo: {
                                    pool: pool.address,
                                    id: commit.args.commitID.toNumber(),
                                    amount: new BigNumber(ethers.utils.formatEther(commit.args.amount)),
                                    type: commit.args.commitType as CommitType,
                                    txnHash: commit.transactionHash,
                                },
                            });
                        });
                    });
                } catch (err) {
                    console.error('Failed to initialise committer', err);
                }

                // subscribe
                subscribeToPool(pool.address);
            });
        }
    }, [account, poolsState.poolsInitialised]);

    const subscribeToPool = async (pool: string) => {
        if (provider && !poolsState.pools[pool]?.subscribed) {
            console.debug('Subscribing to pool', pool);

            const committerInfo = poolsState.pools[pool].committer;
            const committer = new ethers.Contract(
                committerInfo.address,
                PoolCommitter__factory.abi,
                provider,
            ) as PoolCommitter;

            // @ts-ignore
            committer.on(committer.filters.CreateCommit(), (id, amount, type, log) => {
                console.debug('Commit created', {
                    id,
                    amount,
                    type,
                });

                log.getTransaction().then((txn: ethers.providers.TransactionResponse) => {
                    if (commitDispatch) {
                        commitDispatch({
                            type: 'addCommit',
                            commitInfo: {
                                id: id.toNumber(),
                                pool,
                                txnHash: txn.hash,
                                type: type as CommitType,
                                amount: new BigNumber(ethers.utils.formatEther(amount)),
                            },
                        });
                    }
                });

                addAmountToPendingPools(pool, type as CommitType, amount);
            });

            committer.on('ExecuteCommit', (id, amount, type) => {
                console.debug('Commit executed', {
                    id,
                    amount,
                    type,
                });
                if (commitDispatch) {
                    commitDispatch({
                        type: 'removeCommit',
                        id: id.toNumber(),
                        pool: pool,
                    });
                }
            });

            committer.on('RemoveCommit', (id, amount, type) => {
                console.debug('Commit deleted', {
                    id,
                    amount,
                    type,
                });
                if (commitDispatch) {
                    commitDispatch({
                        type: 'removeCommit',
                        id: id.toNumber(),
                        pool: pool,
                    });
                }
            });
            committer.on('FailedCommitExecution', () => {
                console.debug('Failed to execute commit');
            });

            const poolInstance = new ethers.Contract(pool, LeveragedPool__factory.abi, provider) as LeveragedPool;

            poolInstance.on('CompletedUpkeep', () => {
                console.debug('Completed upkeep');
                poolInstance.lastPriceTimestamp().then((lastUpdate) => {
                    console.debug('Last update', lastUpdate.toNumber());
                    poolsDispatch({
                        type: 'setLastUpdate',
                        pool: poolInstance.address,
                        value: new BigNumber(lastUpdate.toString()),
                    });
                });
            });

            poolsDispatch({ type: 'setSubscribed', pool: pool, value: true });
        }
    };

    const addAmountToPendingPools: (pool: string, type: CommitType, amount: EthersBigNumber) => void = (
        pool,
        type,
        amount,
    ) => {
        let amount_ = new BigNumber(ethers.utils.formatEther(amount));
        switch (type) {
            // @ts-ignore
            case SHORT_BURN:
                amount_ = amount_.negated();
            // fall through
            case SHORT_MINT:
                poolsDispatch({
                    type: 'addToPending',
                    pool: pool,
                    side: SHORT,
                    amount: amount_,
                });
                break;
            // @ts-ignore
            case LONG_BURN:
                amount_ = amount_.negated();
            // fall through
            case LONG_MINT:
                poolsDispatch({
                    type: 'addToPending',
                    pool: pool,
                    side: LONG,
                    amount: amount_,
                });
                break;
            default:
                break;
        }
    };

    const commit: (pool: string, commitType: CommitType, amount: number) => Promise<void> = async (
        pool,
        commitType,
        amount,
    ) => {
        const committerAddress = poolsState.pools[pool].committer.address;
        if (!committerAddress) {
            console.error('Committer address undefined when trying to mint');
            // TODO handle error
        }
        const network = await signer?.getChainId();
        const committer = new ethers.Contract(committerAddress, PoolCommitter__factory.abi, signer) as PoolCommitter;
        console.debug(`Creating commit. Amount: ${ethers.utils.parseEther(amount.toString())}, Raw amount: ${amount}`);
        if (handleTransaction) {
            handleTransaction(committer.commit, [commitType, ethers.utils.parseEther(amount.toString())], {
                network: network,
                statusMessages: {
                    waiting: 'Submitting commit',
                    error: 'Failed to commit',
                },
                onSuccess: async (receipt) => {
                    console.debug('Successfully submitted commit txn: ', receipt);
                },
            });
        }
    };

    const uncommit: (pool: string, commitID: number) => Promise<void> = async (pool, commitID) => {
        const committerAddress = poolsState.pools[pool].committer.address;
        if (!committerAddress) {
            console.error('Committer address undefined when trying to mint');
            // TODO handle error
        }
        const network = await signer?.getChainId();
        const committer = new ethers.Contract(committerAddress, PoolCommitter__factory.abi, signer) as PoolCommitter;
        if (handleTransaction) {
            handleTransaction(committer.uncommit, [commitID], {
                network: network,
                statusMessages: {
                    waiting: 'Submitting commit',
                    error: 'Failed to commit',
                },
                onSuccess: async (receipt) => {
                    console.debug('Successfully uncommitted', receipt);
                    // if (!removeCommit) {
                    //     return;
                    // }
                    // removeCommit(commitID.toNumber());
                },
            });
        }
    };

    const approve: (pool: string) => Promise<void> = async (pool) => {
        const token = new ethers.Contract(
            poolsState.pools[pool].quoteToken.address,
            PoolToken__factory.abi,
            signer,
        ) as PoolToken;
        const network = await signer?.getChainId();
        if (handleTransaction) {
            handleTransaction(token.approve, [pool, ethers.utils.parseEther(Number.MAX_SAFE_INTEGER.toString())], {
                network: network,
                statusMessages: {
                    waiting: 'Submitting commit',
                    error: 'Failed to commit',
                },
                onSuccess: async (receipt) => {
                    console.debug('Successfully approved token', receipt);
                    poolsDispatch({
                        type: 'setTokenApproved',
                        token: 'quoteToken',
                        pool: pool,
                        value: true,
                    });
                },
            });
        }
    };

    return (
        <PoolsContext.Provider
            value={{
                pools: poolsState.pools,
            }}
        >
            <PoolsActionsContext.Provider
                value={{
                    commit,
                    approve,
                    uncommit,
                }}
            >
                {children}
            </PoolsActionsContext.Provider>
        </PoolsContext.Provider>
    );
};

export const usePools: () => Partial<ContextProps> = () => {
    const context = useContext(PoolsContext);
    if (context === undefined) {
        throw new Error(`usePools must be called within PoolsContext`);
    }
    return context;
};

export const usePoolActions: () => Partial<ActionContextProps> = () => {
    const context = useContext(PoolsActionsContext);
    if (context === undefined) {
        throw new Error(`usePoolActions must be called within PoolsActionsContext`);
    }
    return context;
};

export const usePool: (pool: string | undefined) => Pool = (pool) => {
    const { pools } = usePools();
    const [pool_, setPool] = useState<Pool>(DEFAULT_POOLSTATE);
    useMemo(() => {
        if (pool) {
            setPool(pools?.[pool] ?? DEFAULT_POOLSTATE);
        }
    }, [pool, pools]);

    return pool_;
};

type TargetType = 'lastUpdate';
export const useSpecific: (poolAddress: string | undefined, target: TargetType, defaultValue: any) => any = (
    poolAddress,
    target,
    defaultValue,
) => {
    const pool = usePool(poolAddress);
    const [value, setValue] = useState<any | undefined>(defaultValue);
    useMemo(() => {
        if (pool) {
            setValue(pool[target]);
        }
    }, [pool?.[target]]);

    return value;
};
