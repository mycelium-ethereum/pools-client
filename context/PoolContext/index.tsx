import React, { useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import {
    LeveragedPool,
    LeveragedPool__factory,
    PoolCommitter__factory,
    PoolKeeper__factory,
    PoolToken__factory,
} from '@tracer-protocol/perpetual-pools-contracts/types';
import {
    Pool,
    KnownNetwork,
    CommitEnum,
    encodeCommitParams,
    BalanceTypeEnum,
    calcNextValueTransfer,
} from '@tracer-protocol/pools-js';
import { CommitToQueryFocusMap, DEFAULT_POOLSTATE } from '~/constants/index';
import { networkConfig } from '~/constants/networks';
import { useStore } from '~/store/main';
import { selectUserCommitActions } from '~/store/PendingCommitSlice';
import { selectAllPools } from '~/store/PoolsSlice';
import { selectHandleTransaction } from '~/store/TransactionSlice';
import { TransactionType } from '~/store/TransactionSlice/types';
import { selectWeb3Info } from '~/store/Web3Slice';
import { Children } from '~/types/general';
import {
    fetchAggregateBalance,
    fetchPoolBalances,
    fetchTokenApprovals,
    fetchTokenBalances,
    fromAggregateBalances,
} from '~/utils/pools';
import { isSupportedNetwork } from '~/utils/supportedNetworks';
import { fetchPendingCommits, V2_SUPPORTED_NETWORKS } from '~/utils/tracerAPI';
import { initialPoolState, PoolInfo, reducer } from './poolDispatch';

type Options = {
    onSuccess?: (...args: any) => any;
};

interface ContextProps {
    pools: Record<string, PoolInfo>;
    poolsInitialised: boolean;
}

interface ActionContextProps {
    commit: (
        pool: string,
        commitType: CommitEnum,
        balanceType: BalanceTypeEnum,
        amount: BigNumber,
        options?: Options,
    ) => Promise<void>;
    approve: (pool: string, settlementTokenSymbol: string) => void;
    claim: (pool: string, options?: Options) => void;
    commitGasFee: (
        pool: string,
        commitType: CommitEnum,
        balanceType: BalanceTypeEnum,
        amount: BigNumber,
    ) => Promise<BigNumber>;
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
    const { provider, account, signer } = useStore(selectWeb3Info);
    const pools = useStore(selectAllPools);
    const handleTransaction = useStore(selectHandleTransaction);
    const { addCommit } = useStore(selectUserCommitActions);
    const [poolsState, poolsDispatch] = useReducer(reducer, initialPoolState);

    // ref to assist in the ensuring that the pools are not getting set twice
    const hasSetPools = useRef(false);
    // ref to assist in the ensuring that contracts are not double subscribed
    const subscriptions = useRef<Record<string, boolean>>({});

    // if the pools from the factory change, re-init them
    useMemo(() => {
        let mounted = true;
        console.debug('Attempting to initialise pools');
        // this is not the greatest for the time being
        if (!!pools.length && provider?.network?.chainId) {
            const network = provider.network?.chainId?.toString();
            if (isSupportedNetwork(network)) {
                const fetchAndSetPools = async () => {
                    console.debug(`Initialising pools ${network.slice()}`, pools);
                    poolsDispatch({ type: 'resetPools' });
                    hasSetPools.current = false;
                    Promise.all(
                        pools.map((pool) =>
                            Pool.Create({
                                ...pool,
                                address: pool.address,
                                provider,
                            }),
                        ),
                    )
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
                                // this will stop incrementing at MAX_RETRY_COUNT specified in ./poolDispatch
                                poolsDispatch({ type: 'incrementRetryCount' });
                            }
                        });
                };
                fetchAndSetPools();
            } else {
                console.error('Skipped pools initialisation, network not supported');
            }
        } else {
            console.error('Skipped pools initialisation, provider not ready');
            poolsDispatch({ type: 'resetPools' });
        }
        return () => {
            mounted = false;
        };
    }, [pools.length]);

    // fetch all pending commits
    useEffect(() => {
        let mounted = true;
        if (provider && poolsState.poolsInitialised) {
            Object.values(poolsState.pools).map((pool) => {
                const decimals = pool.poolInstance.settlementToken.decimals;
                const network = provider.network.chainId;
                if (isSupportedNetwork(network)) {
                    // fetch commits
                    fetchPendingCommits(network.toString() as V2_SUPPORTED_NETWORKS, {
                        pool: pool.poolInstance.address,
                    })
                        .then((pendingCommits) => {
                            if (mounted) {
                                setExpectedPrice(pool.poolInstance);
                                pendingCommits.map((commit) => {
                                    addCommit({
                                        pool: pool.poolInstance.address,
                                        id: commit.commitID,
                                        amount: new BigNumber(ethers.utils.formatUnits(commit.amount, decimals)),
                                        type: commit.commitType,
                                        from: commit.from,
                                        txnHash: commit.txnHash,
                                        created: commit.timestamp,
                                    });
                                });
                            }
                        })
                        .catch((err) => {
                            console.error('Failed to initialise committer', err);
                        });
                }
                // subscribe
                subscribeToPool(pool.poolInstance.address);
            });
        }
        return () => {
            mounted = false;
        };
    }, [provider, poolsState.poolsInitialised]);

    // update token balances and approvals when address changes
    useEffect(() => {
        if (provider && account && poolsState.poolsInitialised) {
            Object.values(poolsState.pools).map((pool) => {
                // get and set token balances and approvals for each pool
                updateTokenBalances(pool.poolInstance, provider);
                updateTokenApprovals(pool.poolInstance);
            });
        } else if (!account && poolsState.poolsInitialised) {
            // account disconnect
            Object.keys(poolsState.pools).map((pool) => {
                poolsDispatch({
                    type: 'setTokenBalances',
                    pool: pool,
                    shortTokenBalance: new BigNumber(0),
                    longTokenBalance: new BigNumber(0),
                    settlementTokenBalance: new BigNumber(0),
                });
            });
        }
    }, [provider, account, poolsState.poolsInitialised]);

    // get and set token balances
    const updateTokenBalances: (pool: Pool, provider: ethers.providers.JsonRpcProvider | undefined) => void = (
        pool,
        provider_,
    ) => {
        if (!provider_ || !account) {
            return false;
        }
        const tokens = [pool.shortToken.address, pool.longToken.address, pool.settlementToken.address];
        const decimals = pool.settlementToken.decimals;
        fetchTokenBalances(tokens, provider_, account, pool.address)
            .then((balances) => {
                const shortTokenBalance = new BigNumber(ethers.utils.formatUnits(balances[0], decimals));
                const longTokenBalance = new BigNumber(ethers.utils.formatUnits(balances[1], decimals));
                const settlementTokenBalance = new BigNumber(ethers.utils.formatUnits(balances[2], decimals));

                console.debug('Balances', {
                    shortTokenBalance,
                    longTokenBalance,
                    settlementTokenBalance,
                });

                poolsDispatch({
                    type: 'setTokenBalances',
                    pool: pool.address,
                    shortTokenBalance,
                    longTokenBalance,
                    settlementTokenBalance,
                });
            })
            .catch((err) => {
                console.error('Failed to fetch token balances', err);
            });
        fetchAggregateBalance(provider_, account, pool.committer.address, decimals)
            .then((balances) => {
                console.debug('Pending balances', {
                    longTokens: balances.longTokens.toNumber(),
                    shortTokens: balances.shortTokens.toNumber(),
                    settlementTokens: balances.settlementTokens.toNumber(),
                });
                poolsDispatch({
                    type: 'setAggregateBalances',
                    pool: pool.address,
                    aggregateBalances: balances,
                });
            })
            .catch((err) => {
                console.error('Failed to fetch aggregate balance', err);
            });
    };

    // get and set approvals
    const updateTokenApprovals: (pool: Pool) => void = (pool) => {
        if (!provider || !account) {
            return;
        }
        const tokens = [pool.shortToken.address, pool.longToken.address, pool.settlementToken.address];
        const decimals = pool.settlementToken.decimals;
        fetchTokenApprovals(tokens, provider, account, pool.address)
            .then((approvals) => {
                poolsDispatch({
                    type: 'setTokenApprovals',
                    pool: pool.address,
                    shortTokenAmount: new BigNumber(ethers.utils.formatUnits(approvals[0], decimals)),
                    longTokenAmount: new BigNumber(ethers.utils.formatUnits(approvals[1], decimals)),
                    settlementTokenAmount: new BigNumber(ethers.utils.formatUnits(approvals[2], decimals)),
                });
            })
            .catch((err) => {
                console.error('Failed to fetch token allowances', err);
            });
    };

    const updatePoolBalances: (pool: Pool, provider_: ethers.providers.JsonRpcProvider | undefined) => void = (
        pool,
        provider_,
    ) => {
        if (provider_ && pool) {
            fetchPoolBalances(
                {
                    address: pool.address,
                    keeper: pool.keeper,
                    settlementTokenDecimals: pool.settlementToken.decimals,
                },
                provider_,
            ).then((poolBalances) => {
                console.debug('Fetched updated bool balances');
                poolsDispatch({
                    type: 'setUpdatedPoolBalances',
                    pool: pool.address,
                    ...poolBalances,
                });
            });
        } else {
            console.debug(`Skipping pool balance update: Provider: ${provider}, pool: ${pool?.address}`);
        }
    };

    // subscribe to pool events
    const subscribeToPool = (pool: string) => {
        if (provider && poolsState.pools[pool]) {
            console.debug('Subscribing to pool', pool);

            const { committer: committerInfo, keeper } = poolsState.pools[pool].poolInstance;

            const wssProvider =
                networkConfig[provider?.network?.chainId.toString() as KnownNetwork]?.publicWebsocketRPC;
            const subscriptionProvider = wssProvider ? new ethers.providers.WebSocketProvider(wssProvider) : provider;

            const committer = PoolCommitter__factory.connect(committerInfo.address, subscriptionProvider);

            if (!subscriptions.current[committerInfo.address]) {
                console.debug(`Subscribing committer: ${committerInfo.address}`);
                committer.on(
                    committer.filters.CreateCommit(),
                    (
                        id,
                        amount,
                        type,
                        _appropriateUpdateInterval,
                        _fromAggregateBalances,
                        _payForClaim,
                        _mintingFee,
                        log,
                    ) => {
                        console.debug('Commit created', {
                            id,
                            amount,
                            type,
                        });

                        const decimals = poolsState.pools[pool].poolInstance.settlementToken.decimals;

                        log.getTransaction().then((txn: ethers.providers.TransactionResponse) => {
                            addCommit({
                                id: txn.hash,
                                pool,
                                from: txn?.from, // from address
                                txnHash: txn.hash,
                                type: type as CommitEnum,
                                amount: new BigNumber(ethers.utils.formatUnits(amount, decimals)),
                                created: txn.timestamp ?? Date.now() / 1000,
                            });
                        });
                    },
                );

                subscriptions.current = {
                    ...subscriptions.current,
                    [committerInfo.address]: true,
                };
            } else {
                console.debug(`Committer ${committerInfo.address.slice()} already subscribed`);
            }

            const keeperInstance = PoolKeeper__factory.connect(keeper, subscriptionProvider);

            if (!subscriptions.current[keeper]) {
                console.debug(`Subscribing keeper: ${keeper.slice()}`);
                keeperInstance.on(keeperInstance.filters.UpkeepSuccessful(), (pool, _data, startPrice, endPrice) => {
                    console.debug(`
                        Completed upkeep on pool: ${pool}
                        Old price: ${ethers.utils.formatEther(startPrice)}
                        New price: ${ethers.utils.formatEther(endPrice)}
                    `);
                    if (subscriptionProvider.network.chainId !== provider.network.chainId) {
                        console.error('Stale upkeep detected: Networks do not match. Removing all listners');
                        // remove all listeners as we are no longer connected to this network
                        keeperInstance.removeAllListeners();
                        // remove from list of subscriptions
                        subscriptions.current = {
                            ...subscriptions.current,
                            [keeper]: false,
                        };
                    } else {
                        const poolInstance = poolsState.pools[pool]?.poolInstance;
                        if (!poolInstance) {
                            return;
                        }
                        poolInstance.connect(subscriptionProvider);
                        poolInstance.fetchLastPriceTimestamp().then((lastUpdate: BigNumber) => {
                            console.debug(`New last updated: ${lastUpdate.toString()}`);
                            // poolsDispatch({ type: 'triggerUpdate' });
                        });
                        updateTokenBalances(poolInstance, subscriptionProvider);
                        updatePoolBalances(poolInstance, subscriptionProvider);
                        // resetCommits(pool);
                    }
                });
                subscriptions.current = {
                    ...subscriptions.current,
                    [keeper]: true,
                };
            } else {
                console.debug(`Keeper ${keeper.slice()} already subscribed`);
            }
        }
    };

    /**
     * Claim all pending commits
     * @param pool pool address to claim from
     * @param options handleTransaction options
     */
    const claim: (pool: string, options?: Options) => Promise<void> = async (pool, options) => {
        const {
            name: poolName,
            committer: { address: committerAddress },
        } = poolsState.pools[pool].poolInstance;

        if (!committerAddress) {
            console.error('Failed to claim: Committer address undefined');
            // TODO handle error
        }
        if (!account) {
            console.error('Failed to claim: Account undefined');
            return;
        }
        if (!signer) {
            console.error('Signer undefined when trying to mint');
            return;
        }
        const committer = PoolCommitter__factory.connect(committerAddress, signer);
        if (handleTransaction) {
            handleTransaction({
                callMethod: committer.claim,
                params: [account],
                type: TransactionType.CLAIM,
                injectedProps: {
                    poolName,
                },
                callBacks: {
                    onSuccess: (receipt) => {
                        console.debug('Successfully submitted claim txn: ', receipt);
                        // get and set token balances
                        updateTokenBalances(poolsState.pools[pool].poolInstance, provider);
                        options?.onSuccess ? options.onSuccess(receipt) : null;
                    },
                },
            });
        }
    };

    // returns the cost of gas units
    const commitGasFee: ActionContextProps['commitGasFee'] = async (pool = '', commitType, balanceType, amount) => {
        if (amount.eq(0)) {
            throw 'Failed to estimate gas cost: amount cannot be 0';
        }

        const committerAddress = poolsState?.pools[pool]?.poolInstance?.committer?.address;

        if (!committerAddress) {
            throw 'Committer address undefined when trying to mint';
        }

        if (!signer) {
            throw 'Signer undefined when trying to mint';
        }
        const committer = PoolCommitter__factory?.connect(committerAddress, signer);

        try {
            const gasEstimate = await committer?.estimateGas?.commit(
                encodeCommitParams(
                    false,
                    fromAggregateBalances(balanceType),
                    commitType,
                    ethers.utils.parseUnits(amount?.toFixed(), 18),
                ),
            );
            const formattedGasEstimate = new BigNumber(gasEstimate.toString());
            return formattedGasEstimate;
        } catch (err) {
            throw `Failed to estimate gas cost: ${err}`;
        }
    };
    /**
     * Commit to a pool
     * @param pool pool address to commit to
     * @param commitType int corresponding to commitType
     * @param amount amount to commit
     * @param options handleTransaction options
     */
    const commit: (
        pool: string,
        commitType: CommitEnum,
        balanceType: BalanceTypeEnum,
        amount: BigNumber,
        options?: Options,
    ) => Promise<void> = async (pool, commitType, balanceType, amount, options) => {
        const {
            lastUpdate,
            updateInterval,
            address: poolAddress,
            frontRunningInterval: frontRunning,
            committer: { address: committerAddress },
            settlementToken: { decimals: settlementTokenDecimals },
            longToken: { symbol: longTokenSymbol },
            shortToken: { symbol: shortTokenSymbol },
        } = poolsState.pools[pool].poolInstance;
        const nextRebalance = lastUpdate.plus(updateInterval).toNumber();
        const targetTime =
            nextRebalance - Date.now() / 1000 < frontRunning.toNumber()
                ? nextRebalance + poolsState.pools[pool].poolInstance.updateInterval.toNumber()
                : nextRebalance;

        if (!committerAddress) {
            console.error('Committer address undefined when trying to mint');
            // TODO handle error
        }
        if (!signer) {
            console.error('Signer undefined when trying to mint');
            return;
        }
        const committer = PoolCommitter__factory.connect(committerAddress, signer);
        console.debug(
            `Creating commit. Amount: ${ethers.utils.parseUnits(
                amount.toFixed(),
                settlementTokenDecimals,
            )}, Raw amount: ${amount.toFixed()}`,
        );
        if (handleTransaction) {
            handleTransaction({
                callMethod: committer.commit,
                params: [
                    encodeCommitParams(
                        false,
                        fromAggregateBalances(balanceType),
                        commitType,
                        ethers.utils.parseUnits(amount.toFixed(), settlementTokenDecimals),
                    ),
                ],
                type: TransactionType.COMMIT,
                injectedProps: {
                    poolAddress,
                    provider: provider as ethers.providers.JsonRpcProvider,
                    tokenSymbol: commitType === CommitEnum.longMint ? longTokenSymbol : shortTokenSymbol,
                    commitType: CommitToQueryFocusMap[commitType],
                    settlementTokenDecimals,
                    nextRebalance: targetTime,
                },
                callBacks: {
                    onSuccess: (receipt) => {
                        console.debug('Successfully submitted commit txn: ', receipt);
                        // get and set token balances
                        updateTokenBalances(poolsState.pools[pool].poolInstance, provider);
                        options?.onSuccess ? options.onSuccess(receipt) : null;
                    },
                },
            });
        }
    };

    const approve: (pool: string, settlementTokenSymbol: string) => Promise<void> = async (
        pool,
        settlementTokenSymbol,
    ) => {
        if (!signer) {
            console.error('Failed to approve token: signer undefined');
            return;
        }

        const token = PoolToken__factory.connect(poolsState.pools[pool].poolInstance.settlementToken.address, signer);

        if (handleTransaction) {
            handleTransaction({
                callMethod: token.approve,
                params: [pool, ethers.utils.parseEther(Number.MAX_SAFE_INTEGER.toString())],
                type: TransactionType.APPROVE,
                injectedProps: {
                    tokenSymbol: settlementTokenSymbol,
                },
                callBacks: {
                    onSuccess: async (receipt) => {
                        console.debug('Successfully approved token', receipt);
                        poolsDispatch({
                            type: 'setTokenApproved',
                            token: 'settlementToken',
                            pool: pool,
                            value: new BigNumber(Number.MAX_SAFE_INTEGER),
                        });
                    },
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
                    claim,
                    commitGasFee,
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

export const usePool: (pool: string | undefined) => PoolInfo = (pool) => {
    const { pools } = usePools();
    const [pool_, setPool] = useState<PoolInfo>(DEFAULT_POOLSTATE);
    useMemo(() => {
        if (pool && pools?.[pool]) {
            setPool(pools?.[pool]);
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
            setValue(pool.poolInstance[target]);
        }
    }, [pool?.poolInstance[target]]);

    return value;
};
