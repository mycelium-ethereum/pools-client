import React, { useContext, useReducer, useState } from 'react';
import { Children, Pool } from '@libs/types/General';
import { FactoryContext } from '../FactoryContext';
import { useEffect } from 'react';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { reducer, initialPoolState } from './poolDispatch';
import { fetchTokenBalances, initPool, fetchCommits, fetchTokenApprovals } from './helpers';
import { useMemo } from 'react';
import { ethers, BigNumber as EthersBigNumber } from 'ethers';
import { DEFAULT_POOLSTATE } from '@libs/constants/pool';
import BigNumber from 'bignumber.js';
import {
    PoolCommitter,
    PoolCommitter__factory,
    PoolKeeper,
    PoolKeeper__factory,
    PoolToken,
    PoolToken__factory,
} from '@tracer-protocol/perpetual-pools-contracts/types';
import { SideEnum, CommitEnum } from '@libs/constants';
import { useTransactionContext } from '@context/TransactionContext';
import { useCommitActions } from '@context/UsersCommitContext';

type Options = {
    onSuccess?: (...args: any) => any;
};

interface ContextProps {
    pools: Record<string, Pool>;
    poolsInitialised: boolean;
}

interface ActionContextProps {
    commit: (pool: string, commitType: CommitEnum, amount: number, options?: Options) => Promise<void>;
    approve: (pool: string) => void;
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
                updateTokenBalances(pool);
                updateTokenApprovals(pool);

                // fetch commits
                try {
                    commitDispatch({ type: 'resetCommits' });
                    fetchCommits(pool.committer.address, provider).then((committerInfo) => {
                        poolsDispatch({
                            type: 'addToPending',
                            pool: pool.address,
                            side: SideEnum.long,
                            amount: committerInfo.pendingLong,
                        });
                        poolsDispatch({
                            type: 'addToPending',
                            pool: pool.address,
                            side: SideEnum.short,
                            amount: committerInfo.pendingShort,
                        });

                        committerInfo.allUnexecutedCommits.map((commit) => {
                            commit.getTransaction().then((txn) => {
                                commitDispatch({
                                    type: 'addCommit',
                                    commitInfo: {
                                        pool: pool.address,
                                        id: commit.args.commitID.toNumber(),
                                        amount: new BigNumber(ethers.utils.formatEther(commit.args.amount)),
                                        type: commit.args.commitType as CommitEnum,
                                        from: txn.from,
                                        txnHash: txn.hash,
                                    },
                                });
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

    const updateTokenBalances: (pool: Pool) => void = (pool) => {
        if (!provider || !account) {
            return false;
        }
        const tokens = [pool.shortToken.address, pool.longToken.address, pool.quoteToken.address];
        fetchTokenBalances(tokens, provider, account, pool.address)
            .then((balances) => {
                const shortTokenBalance = new BigNumber(ethers.utils.formatEther(balances[0]));
                const longTokenBalance = new BigNumber(ethers.utils.formatEther(balances[1]));
                const quoteTokenBalance = new BigNumber(ethers.utils.formatEther(balances[2]));

                console.debug('Balances', {
                    shortTokenBalance,
                    longTokenBalance,
                    quoteTokenBalance,
                });

                poolsDispatch({
                    type: 'setTokenBalances',
                    pool: pool.address,
                    shortTokenBalance,
                    longTokenBalance,
                    quoteTokenBalance,
                });
            })
            .catch((err) => {
                console.error('Failed to fetch token balances', err);
            });
    };

    const updateTokenApprovals: (pool: Pool) => void = (pool) => {
        if (!provider || !account) {
            return;
        }
        const tokens = [pool.shortToken.address, pool.longToken.address, pool.quoteToken.address];
        fetchTokenApprovals(tokens, provider, account, pool.address).then((approvals) => {
            poolsDispatch({
                type: 'setTokenApprovals',
                pool: pool.address,
                shortTokenAmount: new BigNumber(ethers.utils.formatEther(approvals[0])),
                longTokenAmount: new BigNumber(ethers.utils.formatEther(approvals[1])),
                quoteTokenAmount: new BigNumber(ethers.utils.formatEther(approvals[2])),
            });
        });
    };

    const subscribeToPool = async (pool: string) => {
        if (provider && !poolsState.pools[pool]?.subscribed) {
            console.debug('Subscribing to pool', pool);

            const { committer: committerInfo, keeper } = poolsState.pools[pool];
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
                                from: txn.from, // from address
                                txnHash: txn.hash,
                                type: type as CommitEnum,
                                amount: new BigNumber(ethers.utils.formatEther(amount)),
                            },
                        });
                    }
                });

                addAmountToPendingPools(pool, type as CommitEnum, amount);
            });

            committer.on('ExecuteCommit', (id, amount, type) => {
                console.debug('Commit executed', {
                    id,
                    amount,
                    type,
                });
                updateTokenBalances(poolsState.pools[pool]);
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

            const keeperInstance = new ethers.Contract(keeper, PoolKeeper__factory.abi, provider) as PoolKeeper;

            keeperInstance.on(keeperInstance.filters.UpkeepSuccessful(), (startPrice, endPrice, log) => {
                console.debug(`
                    Completed upkeep. 
                    Old price: ${ethers.utils.formatEther(startPrice)}
                    New price: ${ethers.utils.formatEther(endPrice)}
                `);
                log.getTransaction().then((txn) => {
                    // txn.timestamp should be the the ne lastUpdate price
                    // this saves creating a poolInstance. If txn.timestamp cant be found then
                    // Date.now should be roughly the new update time
                    const timestamp = txn?.timestamp ?? Date.now();
                    console.debug(`New lastupdated: ${txn?.timestamp}`);
                    poolsDispatch({
                        type: 'setLastUpdate',
                        pool: pool,
                        value: new BigNumber(timestamp.toString()),
                    });
                });
            });

            poolsDispatch({ type: 'setSubscribed', pool: pool, value: true });
        }
    };

    const addAmountToPendingPools: (pool: string, type: CommitEnum, amount: EthersBigNumber) => void = (
        pool,
        type,
        amount,
    ) => {
        let amount_ = new BigNumber(ethers.utils.formatEther(amount));
        switch (type) {
            // @ts-ignore
            case CommitEnum.short_burn:
                amount_ = amount_.negated();
            // fall through
            case CommitEnum.short_mint:
                poolsDispatch({
                    type: 'addToPending',
                    pool: pool,
                    side: SideEnum.short,
                    amount: amount_,
                });
                break;
            // @ts-ignore
            case CommitEnum.long_burn:
                amount_ = amount_.negated();
            // fall through
            case CommitEnum.long_mint:
                poolsDispatch({
                    type: 'addToPending',
                    pool: pool,
                    side: SideEnum.long,
                    amount: amount_,
                });
                break;
            default:
                break;
        }
    };

    const commit: (pool: string, commitType: CommitEnum, amount: number, options?: Options) => Promise<void> = async (
        pool,
        commitType,
        amount,
        options,
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
                onSuccess: (receipt) => {
                    console.debug('Successfully submitted commit txn: ', receipt);
                    // get and set token balances
                    updateTokenBalances(poolsState.pools[pool]);
                    options?.onSuccess ? options.onSuccess(receipt) : null;
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
                        value: new BigNumber(Number.MAX_SAFE_INTEGER),
                    });
                },
            });
        }
    };

    return (
        <PoolsContext.Provider
            value={{
                pools: poolsState.pools,
                poolsInitialised: poolsState.poolsInitialised,
            }}
        >
            <PoolsActionsContext.Provider
                value={{
                    commit,
                    approve,
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
