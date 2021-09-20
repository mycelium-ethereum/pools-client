import React, { useContext, useReducer, useRef, useState } from 'react';
import { Children, Pool } from '@libs/types/General';
import { FactoryContext } from '../FactoryContext';
import { useEffect } from 'react';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { reducer, initialPoolState } from './poolDispatch';
import { fetchTokenBalances, initPool, fetchCommits, fetchTokenApprovals } from './helpers';
import { useMemo } from 'react';
import { ethers } from 'ethers';
import { DEFAULT_POOLSTATE } from '@libs/constants/pool';
import BigNumber from 'bignumber.js';
import {
    LeveragedPool,
    LeveragedPool__factory,
    PoolCommitter,
    PoolCommitter__factory,
    PoolKeeper,
    PoolKeeper__factory,
    PoolToken,
    PoolToken__factory,
} from '@tracer-protocol/perpetual-pools-contracts/types';
import { CommitEnum } from '@libs/constants';
import { useTransactionContext } from '@context/TransactionContext';
import { useCommitActions } from '@context/UsersCommitContext';
import { calcNextValueTransfer } from '@libs/utils/calcs';

type Options = {
    onSuccess?: (...args: any) => any;
};

interface ContextProps {
    pools: Record<string, Pool>;
    poolsInitialised: boolean;
}

interface ActionContextProps {
    commit: (pool: string, commitType: CommitEnum, amount: BigNumber, options?: Options) => Promise<void>;
    approve: (pool: string) => void;
}

interface SelectedPoolContextProps {
    pool: Pool;
}

export const PoolsContext = React.createContext<Partial<ContextProps>>({});
export const PoolsActionsContext = React.createContext<Partial<ActionContextProps>>({});
export const SelectedPoolContext = React.createContext<Partial<SelectedPoolContextProps>>({});

/**
 * Wrapper store for all pools information
 */
export const PoolStore: React.FC<Children> = ({ children }: Children) => {
    const { pools } = useContext(FactoryContext);
    const { provider, account, signer } = useWeb3();
    const { handleTransaction } = useTransactionContext();
    const { commitDispatch = () => console.error('Commit dispatch undefined') } = useCommitActions();
    const [poolsState, poolsDispatch] = useReducer(reducer, initialPoolState);

    // ref to assist in the ensuring that the pools are not getting set twice
    const hasSetPools = useRef(false);

    // if the pools from the factory change, re-init them
    useMemo(() => {
        let mounted = true;
        if (pools && provider) {
            poolsDispatch({ type: 'resetPools' });
            hasSetPools.current = false;
            Promise.all(pools.map((pool) => initPool(pool, provider)))
                .then((res) => {
                    if (!hasSetPools.current && mounted) {
                        res.forEach((pool) => {
                            poolsDispatch({ type: 'setPool', pool: pool, key: pool.address });
                        });
                        if (res.length) {
                            // if pools exist
                            poolsDispatch({ type: 'setPoolsInitialised', value: true });
                            hasSetPools.current = true;
                        }
                    }
                })
                .catch((err) => {
                    console.error('Failed to initialise pools', err);
                    if (mounted) {
                        poolsDispatch({ type: 'setPoolsInitialised', value: false });
                    }
                });
        }
        return () => {
            mounted = false
        }
    }, [provider, pools]);

    // fetch all pending commits
    useEffect(() => {
        if (provider && poolsState.poolsInitialised) {
            Object.values(poolsState.pools).map((pool) => {
                // get and set token balances
                updateTokenBalances(pool);
                updateTokenApprovals(pool);
                const decimals = pool.quoteToken.decimals;

                // fetch commits
                try {
                    fetchCommits(pool.committer.address, provider, pool.quoteToken.decimals).then((committerInfo) => {
                        poolsDispatch({
                            type: 'setPendingAmounts',
                            pool: pool.address,
                            pendingLong: committerInfo.pendingLong,
                            pendingShort: committerInfo.pendingShort,
                        });

                        setExpectedPrice(pool);

                        committerInfo.allUnexecutedCommits.map((commit) => {
                            commit.getTransaction().then((txn) => {
                                commitDispatch({
                                    type: 'addCommit',
                                    commitInfo: {
                                        pool: pool.address,
                                        id: commit.args.commitID.toNumber(),
                                        amount: new BigNumber(ethers.utils.formatUnits(commit.args.amount, decimals)),
                                        type: commit.args.commitType as CommitEnum,
                                        from: txn.from,
                                        txnHash: txn.hash,
                                        created: Date.now() / 1000,
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
    }, [provider, poolsState.poolsInitialised]);

    // update token balances and approvals when address changes
    useEffect(() => {
        if (provider && account && poolsState.poolsInitialised) {
            Object.values(poolsState.pools).map((pool) => {
                // get and set token balances and approvals for each pool
                updateTokenBalances(pool);
                updateTokenApprovals(pool);
            });
        }
    }, [provider, account, poolsState.poolsInitialised]);

    // get and set token balances
    const updateTokenBalances: (pool: Pool) => void = (pool) => {
        if (!provider || !account) {
            return false;
        }
        const tokens = [pool.shortToken.address, pool.longToken.address, pool.quoteToken.address];
        const decimals = pool.quoteToken.decimals;
        fetchTokenBalances(tokens, provider, account, pool.address)
            .then((balances) => {
                const shortTokenBalance = new BigNumber(ethers.utils.formatUnits(balances[0], decimals));
                const longTokenBalance = new BigNumber(ethers.utils.formatUnits(balances[1], decimals));
                const quoteTokenBalance = new BigNumber(ethers.utils.formatUnits(balances[2], decimals));

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

    // get and set approvals
    const updateTokenApprovals: (pool: Pool) => void = (pool) => {
        if (!provider || !account) {
            return;
        }
        const tokens = [pool.shortToken.address, pool.longToken.address, pool.quoteToken.address];
        const decimals = pool.quoteToken.decimals;
        fetchTokenApprovals(tokens, provider, account, pool.address).then((approvals) => {
            poolsDispatch({
                type: 'setTokenApprovals',
                pool: pool.address,
                shortTokenAmount: new BigNumber(ethers.utils.formatUnits(approvals[0], decimals)),
                longTokenAmount: new BigNumber(ethers.utils.formatUnits(approvals[1], decimals)),
                quoteTokenAmount: new BigNumber(ethers.utils.formatUnits(approvals[2], decimals)),
            });
        });
    };

    // subscribe to pool events
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

                const decimals = poolsState.pools[pool].quoteToken.decimals;

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
                                amount: new BigNumber(ethers.utils.formatUnits(amount, decimals)),
                                created: Date.now() / 1000,
                            },
                        });
                    }
                });

                const amount_ = new BigNumber(ethers.utils.formatUnits(amount, decimals));
                poolsDispatch({ type: 'addToPending', pool: pool, commitType: type, amount: amount_ });
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

    /**
     * Commit to a pool
     * @param pool pool address to commit to
     * @param commitType int corresponsing to commitType
     * @param amount amount to commit
     * @param options handleTransaction options
     */
    const commit: (pool: string, commitType: CommitEnum, amount: BigNumber, options?: Options) => Promise<void> =
        async (pool, commitType, amount, options) => {
            const committerAddress = poolsState.pools[pool].committer.address;
            const quoteTokenDecimals = poolsState.pools[pool].quoteToken.decimals;
            if (!committerAddress) {
                console.error('Committer address undefined when trying to mint');
                // TODO handle error
            }
            const network = await signer?.getChainId();
            const committer = new ethers.Contract(
                committerAddress,
                PoolCommitter__factory.abi,
                signer,
            ) as PoolCommitter;
            console.debug(
                `Creating commit. Amount: ${ethers.utils.parseUnits(
                    amount.toFixed(),
                    quoteTokenDecimals,
                )}, Raw amount: ${amount.toFixed()}`,
            );
            if (handleTransaction) {
                handleTransaction(
                    committer.commit,
                    [commitType, ethers.utils.parseUnits(amount.toFixed(), quoteTokenDecimals)],
                    {
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
                    },
                );
            }
        };

    /**
     * Approve pool to spend quote token
     * @param pool address to approve
     */
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

    /**
     * Sets the expected price after value transfer
     * @param pool address of pool
     */
    const setExpectedPrice = (pool: Pool) => {
        const { lastPrice, leverage, longBalance, shortBalance } = pool;
        const leveragedPool = new ethers.Contract(pool.address, LeveragedPool__factory.abi, provider) as LeveragedPool;

        leveragedPool.getOraclePrice().then((price) => {
            const oraclePrice = new BigNumber(ethers.utils.formatEther(price));
            const { shortValueTransfer, longValueTransfer } = calcNextValueTransfer(
                lastPrice,
                oraclePrice,
                new BigNumber(leverage),
                longBalance,
                shortBalance,
            );
            console.debug('Calculated value transfer', {
                shortValueTransfer: shortValueTransfer.toFixed(),
                longValueTransfer: longValueTransfer.toFixed(),
                lastPrice: lastPrice.toFixed(),
                newPrice: oraclePrice.toFixed(),
            });
            poolsDispatch({
                type: 'setNextPoolBalances',
                pool: pool.address,
                nextLongBalance: longBalance.plus(longValueTransfer),
                nextShortBalance: shortBalance.plus(shortValueTransfer),
            });
        });
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
