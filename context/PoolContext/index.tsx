import React, { useContext, useReducer, useState } from 'react';
import { Children, CommitType, Pool } from '@libs/types/General';
import { FactoryContext } from '../FactoryContext';
import { useEffect } from 'react';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { reducer, initialPoolState } from './poolDispatch';
import { fetchTokenBalances, initPool, initCommitter } from './helpers';
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
// import { calcTokenPrice } from '@libs/utils/calcs';
import { useTransactionContext } from '@context/TransactionContext';
import { useCommitActions } from '@context/UsersCommitContext';

interface ContextProps {
    pools: Record<string, Pool>;
}

interface ActionContextProps {
    commit: (pool: string, commitType: CommitType, amount: number) => void;
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
    const { commitDispatch } = useCommitActions();
    // const { handleTransaction } = useContext(TransactionContext);
    const [poolsState, poolsDispatch] = useReducer(reducer, initialPoolState);

    /** If pools changes then re-init them */
    useMemo(() => {
        // if pools from factory change
        if (pools && provider) {
            Promise.all(pools.map((pool) => initPool(pool, provider)))
                .then((res) => {
                    res.forEach((pool) => {
                        poolsDispatch({ type: 'setPool', pool: pool, key: pool.address });
                        try {
                            initCommitter(pool.committer.address, provider).then((committerInfo) => {
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
                                    if (!commitDispatch) {
                                        return;
                                    }
                                    commitDispatch({
                                        type: 'addCommit',
                                        commitInfo: {
                                            pool: pool.address,
                                            id: commit.args.commitID.toNumber(),
                                            amount: new BigNumber(ethers.utils.formatEther(commit.args.amount)),
                                            type: commit.args.commitType as CommitType,
                                        },
                                    });
                                });
                            });
                        } catch (err) {
                            console.error('Failed to initialise committer', err);
                        }
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

                // subscribe
                subscribeToPool(pool.address);
            });
        }
    }, [account, poolsState.poolsInitialised]);

    const subscribeToPool = async (pool: string) => {
        if (provider && !poolsState.pools[pool]?.subscribed) {
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

                // const {
                //     amount: amount_,
                //     value,
                //     tokenName,
                //     buttonText,
                // } = constructNotification(poolsState.pools[pool], type as CommitType, amount);

                // log.getTransaction().then(async (txn: ethers.providers.TransactionResponse) => {
                //     console.log('not the same');
                //     if (txn.from.toLowerCase() === account?.toLowerCase()) {
                //         if (!addCommit) {
                //             return;
                //         }
                //         const poolInstance = new ethers.Contract(
                //             pool,
                //             LeveragedPool__factory.abi,
                //             provider,
                //         ) as LeveragedPool;
                //         const lastUpdate = await poolInstance.lastPriceTimestamp();
                //         // lastUpdate
                //         const { updateInterval, frontRunningInterval } = poolsState.pools[pool];
                //         console.log(poolsState);
                //         console.log(lastUpdate);
                //         console.log(updateInterval.toNumber(), lastUpdate.toNumber(), 'update interval');

                // addCommit(id.toNumber(), {
                //     amount: amount_,
                //     value,
                //     tokenName,
                //     updateInterval,
                //     lastUpdate: new BigNumber(lastUpdate.toNumber()),
                //     frontRunningInterval,
                //     action: {
                //         text: buttonText,
                //         onClick: () => {
                //             uncommit(pool, id);
                //         },
                //     },
                // });
                // }
                // });
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

    const commit: (pool: string, commitType: CommitType, amount: number) => void = (pool, commitType, amount) => {
        const committerAddress = poolsState.pools[pool].committer.address;
        if (!committerAddress) {
            console.error('Committer address undefined when trying to mint');
            // TODO handle error
        }
        const committer = new ethers.Contract(committerAddress, PoolCommitter__factory.abi, signer) as PoolCommitter;
        if (handleTransaction) {
            handleTransaction(committer.commit, [commitType, amount], {
                statusMessages: {
                    waiting: 'Submitting commit',
                    error: 'Failed to commit',
                },
                onSuccess: async (receipt) => {
                    console.debug('Failed to commit: ', receipt);
                },
            });
        }
    };

    // const _uncommit: (pool: string, commitID: EthersBigNumber) => void = (pool, commitID) => {
    //     const committerAddress = poolsState.pools[pool].committer.address;
    //     if (!committerAddress) {
    //         console.error('Committer address undefined when trying to mint');
    //         // TODO handle error
    //     }
    //     const committer = new ethers.Contract(committerAddress, PoolCommitter__factory.abi, signer) as PoolCommitter;
    //     if (handleTransaction) {
    //         handleTransaction(committer.uncommit, [commitID], {
    //             statusMessages: {
    //                 waiting: 'Submitting commit',
    //                 error: 'Failed to commit',
    //             },
    //             onSuccess: async (receipt) => {
    //                 console.log(receipt);
    //                 // if (!removeCommit) {
    //                 //     return;
    //                 // }
    //                 // removeCommit(commitID.toNumber());
    //             },
    //         });
    //     }
    // };

    const approve: (pool: string) => void = (pool) => {
        const token = new ethers.Contract(
            poolsState.pools[pool].quoteToken.address,
            PoolToken__factory.abi,
            signer,
        ) as PoolToken;
        if (handleTransaction) {
            handleTransaction(token.approve, [pool, ethers.utils.parseEther(Number.MAX_SAFE_INTEGER.toString())], {
                statusMessages: {
                    waiting: 'Submitting commit',
                    error: 'Failed to commit',
                },
                onSuccess: async (receipt) => {
                    poolsDispatch({
                        type: 'setTokenApproved',
                        token: 'quoteToken',
                        pool: pool,
                        value: true,
                    });
                    console.log(receipt);
                },
            });
        }
    };
    /**
     * Subscribes to a given pool address
     */
    // const subscribeToPool = (pool: string) => {
    //     if (poolsState?.pools[pool]) {
    //         const pools = poolsState?.pools;
    //         const poolContract = new ethers.Contract(
    //             pool,
    //             LeveragedPool__factory.abi,
    //             provider,
    //         ) as LeveragedPool;
    //         const shortToken = new ethers.Contract(
    //             pools[pool].shortToken.address,
    //             TestToken__factory.abi,
    //             provider,
    //         ) as PoolTokenContract;
    //         const longToken = new ethers.Contract(
    //             pools[pool].longToken.address,
    //             TestToken__factory.abi,
    //             provider,
    //         ) as PoolTokenContract;
    //         const quoteToken = new ethers.Contract(
    //             pools[pool].quoteToken.address,
    //             TestToken__factory.abi,
    //             provider,
    //         ) as TestToken;

    //         shortToken.on('Transfer', () => {
    //             console.log("Detected short token transfer")
    //         });

    //         longToken.on('Transfer', () => {
    //             console.log("Detected long token transfer")
    //         });

    //         quoteToken.on('Transfer', () => {
    //             console.log("Detected quote token transfer")
    //         });
    //         poolContract.on('PriceChange', (startPrice, endPrice, transferAmount) => {
    //             console.log("Pool price change", startPrice, endPrice, transferAmount)
    //             // const oldPrice = new BigNumber(ethers.utils.formatEther(startPrice));
    //             // const newPrice = new BigNumber(ethers.utils.formatEther(endPrice));
    //             // console.debug(
    //             //     `Pool price changed, old: $${oldPrice.toNumber()}, new: $${newPrice.toNumber()}, transferred: ${transferAmount}`,
    //             // );
    //         });
    //     }
    // }

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

// const constructNotification = (pool: Pool, type: CommitType, amount: EthersBigNumber) => {
//     const amount_ = new BigNumber(amount.toString());
//     const { shortBalance, longBalance, shortToken, longToken } = pool;
//     const tokenPrice =
//         type === SHORT_MINT || type === SHORT_BURN
//             ? calcTokenPrice(shortBalance, shortToken.supply)
//             : calcTokenPrice(longBalance, longToken.supply);
//     const tokenName = type === SHORT_MINT || type === SHORT_BURN ? shortToken.name : longToken.name;
//     const buttonText = type === SHORT_BURN || type === LONG_BURN ? 'Cancel Sell' : 'Cancel Buy';
//     console.log(amount_.toNumber(), 'Amount');
//     return {
//         amount: amount_,
//         value: amount_.times(tokenPrice),
//         tokenName,
//         buttonText,
//     };
// };
