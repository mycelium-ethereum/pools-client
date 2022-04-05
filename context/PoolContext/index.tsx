import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import shallow from 'zustand/shallow';
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
    getExpectedExecutionTimestamp,
} from '@tracer-protocol/pools-js';
import { CommitToQueryFocusMap, DEFAULT_POOLSTATE } from '~/constants/index';
import { networkConfig } from '~/constants/networks';
import { useStore } from '~/store/main';
import { selectUserCommitActions } from '~/store/PendingCommitSlice';
import { selectPoolInstanceActions, selectPoolInstances, selectPoolsInitialized } from '~/store/PoolInstancesSlice';
import { selectAllPoolLists } from '~/store/PoolsSlice';
import { selectHandleTransaction } from '~/store/TransactionSlice';
import { TransactionType } from '~/store/TransactionSlice/types';
import { selectWeb3Info } from '~/store/Web3Slice';

import { Children } from '~/types/general';
import { PoolInfo } from '~/types/pools';
import { fetchAggregateBalance, fetchTokenApprovals, fetchTokenBalances, fromAggregateBalances } from '~/utils/pools';
import { isSupportedNetwork } from '~/utils/supportedNetworks';
import { fetchPendingCommits, V2_SUPPORTED_NETWORKS } from '~/utils/tracerAPI';

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
    const poolAddresses = useStore(selectAllPoolLists);
    const pools = useStore(selectPoolInstances, shallow);
    const poolsInitialized = useStore(selectPoolsInitialized);
    const {
        setPool,
        resetPools,
        setPoolsInitialized,
        setTokenBalances,
        setTokenApprovals,
        setAggregateBalances,
        setTokenApproved,
    } = useStore(selectPoolInstanceActions);
    const handleTransaction = useStore(selectHandleTransaction);
    const { addCommit } = useStore(selectUserCommitActions);

    // ref to assist in the ensuring that the pools are not getting set twice
    const hasSetPools = useRef(false);
    // ref to assist in the ensuring that contracts are not double subscribed
    const subscriptions = useRef<Record<string, boolean>>({});

    // if the pools from the factory change, re-init them
    useMemo(() => {
        let mounted = true;
        console.debug('Attempting to initialise pools');
        // this is not the greatest for the time being
        if (!!poolAddresses.length && provider?.network?.chainId) {
            const network = provider.network?.chainId?.toString();
            if (isSupportedNetwork(network)) {
                const fetchAndSetPools = async () => {
                    console.debug(`Initialising pools ${network.slice()}`, pools);
                    resetPools();
                    hasSetPools.current = false;
                    Promise.all(
                        poolAddresses.map((pool) =>
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
                                    setPool(pool);
                                });
                                if (res.length) {
                                    // if pools exist
                                    setPoolsInitialized(true);
                                    hasSetPools.current = true;
                                }
                            }
                        })
                        .catch((err) => {
                            console.error('Failed to initialise pools', err);
                            if (mounted) {
                                setPoolsInitialized(false);
                            }
                        });
                };
                fetchAndSetPools();
            } else {
                console.error('Skipped pools initialisation, network not supported');
            }
        } else {
            console.error('Skipped pools initialisation, provider not ready');
            resetPools();
        }
        return () => {
            mounted = false;
        };
    }, [poolAddresses.length]);

    // fetch all pending commits
    useEffect(() => {
        let mounted = true;
        if (provider && poolsInitialized) {
            Object.values(pools).map((pool) => {
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
                                        appropriateIntervalId: commit.updateIntervalId,
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
    }, [provider, poolsInitialized]);

    // update token balances and approvals when address changes
    useEffect(() => {
        if (provider && account && poolsInitialized) {
            Object.values(pools).map((pool) => {
                // get and set token balances and approvals for each pool
                updateTokenBalances(pool.poolInstance, provider);
                updateTokenApprovals(pool.poolInstance);
            });
        } else if (!account && poolsInitialized) {
            // account disconnect
            Object.keys(pools).map((pool) => {
                setTokenBalances(pool, {
                    shortTokenBalance: new BigNumber(0),
                    longTokenBalance: new BigNumber(0),
                    settlementTokenBalance: new BigNumber(0),
                });
            });
        }
    }, [provider, account, poolsInitialized]);

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

                setTokenBalances(pool.address, {
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
                setAggregateBalances(pool.address, balances);
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
                setTokenApprovals(pool.address, {
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
            // set the provider
            pool.connect(provider_);
            // fetch all updated values
            Promise.all([
                pool.fetchLastPriceTimestamp(),
                pool.fetchLastPrice(),
                pool.fetchOraclePrice(),
                pool.fetchPoolBalances(),
            ]).then((res) => {
                console.log('Pool updated', res);
            });
        } else {
            console.debug(`Skipping pool balance update: Provider: ${provider}, pool: ${pool?.address}`);
        }
    };

    // subscribe to pool events
    const subscribeToPool = (pool: string) => {
        if (provider && pools[pool]) {
            console.debug('Subscribing to pool', pool);

            const { keeper } = pools[pool].poolInstance;

            const wssProvider =
                networkConfig[provider?.network?.chainId.toString() as KnownNetwork]?.publicWebsocketRPC;
            const subscriptionProvider = wssProvider ? new ethers.providers.WebSocketProvider(wssProvider) : provider;

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
                        const poolInstance = pools[pool]?.poolInstance;
                        if (!poolInstance) {
                            return;
                        }
                        poolInstance.connect(subscriptionProvider);
                        poolInstance.fetchLastPriceTimestamp().then((lastUpdate: BigNumber) => {
                            console.debug(`New last updated: ${lastUpdate.toString()}`);
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
        } = pools[pool].poolInstance;

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
                        updateTokenBalances(pools[pool].poolInstance, provider);
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

        const committerAddress = pools[pool]?.poolInstance?.committer?.address;

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
            frontRunningInterval,
            address: poolAddress,
            committer: { address: committerAddress },
            settlementToken: { decimals: settlementTokenDecimals },
            longToken: { symbol: longTokenSymbol },
            shortToken: { symbol: shortTokenSymbol },
        } = pools[pool].poolInstance;
        const expectedExecution = getExpectedExecutionTimestamp(
            frontRunningInterval.toNumber(),
            updateInterval.toNumber(),
            lastUpdate.toNumber(),
            Date.now() / 1000,
        );

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
                    expectedExecution: expectedExecution,
                },
                callBacks: {
                    onSuccess: (receipt) => {
                        console.debug('Successfully submitted commit txn: ', receipt);
                        // get and set token balances
                        updateTokenBalances(pools[pool].poolInstance, provider);
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

        const token = PoolToken__factory.connect(pools[pool].poolInstance.settlementToken.address, signer);

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
                        setTokenApproved(pool, 'settlementToken', new BigNumber(Number.MAX_SAFE_INTEGER));
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
                pools: pools,
                poolsInitialised: poolsInitialized,
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
