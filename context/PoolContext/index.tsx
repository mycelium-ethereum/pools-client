import React, { useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Children } from 'libs/types/General';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { initialPoolState, PoolInfo, reducer } from './poolDispatch';
import {
    fetchAggregateBalance,
    fetchCommits,
    fetchPoolBalances,
    fetchTokenApprovals,
    fetchTokenBalances,
} from './helpers';
import { Pool, KnownNetwork, CommitEnum } from '@tracer-protocol/pools-js';
import { ethers } from 'ethers';
import { DEFAULT_POOLSTATE } from '@libs/constants/pool';
import BigNumber from 'bignumber.js';
import {
    LeveragedPool,
    LeveragedPool__factory,
    PoolCommitter__factory,
    PoolKeeper__factory,
    PoolToken__factory,
} from '@tracer-protocol/perpetual-pools-contracts/types';
import { useTransactionContext } from '@context/TransactionContext';
import { useCommitActions } from '@context/UsersCommitContext';
import { calcNextValueTransfer } from '@tracer-protocol/pools-js';
import { watchAsset } from '@libs/utils/rpcMethods';
import { AvailableNetwork, networkConfig } from '@context/Web3Context/Web3Context.Config';
import { Logo, tokenSymbolToLogoTicker } from '@components/General';
import PoolListService, { PoolList } from '@libs/services/poolList';
import { isSupportedNetwork } from '@libs/utils/supportedNetworks';
import { CommitToQueryFocusMap } from '@libs/constants';

type Options = {
    onSuccess?: (...args: any) => any;
};

interface ContextProps {
    pools: Record<string, PoolInfo>;
    poolsInitialised: boolean;
}

interface ActionContextProps {
    commit: (pool: string, commitType: CommitEnum, amount: BigNumber, options?: Options) => Promise<void>;
    approve: (pool: string, quoteTokenSymbol: string) => void;
    claim: (pool: string, options?: Options) => void;
    commitGasFee: (pool: string, commitType: CommitEnum, amount: BigNumber) => Promise<string | undefined>;
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
    const { provider, account, signer } = useWeb3();
    const { handleTransaction } = useTransactionContext();
    const { commitDispatch = () => console.error('Commit dispatch undefined') } = useCommitActions();
    const [poolsState, poolsDispatch] = useReducer(reducer, initialPoolState);

    // ref to assist in the ensuring that the pools are not getting set twice
    const hasSetPools = useRef(false);
    // ref to assist in the ensuring that contracts are not double subscribed
    const subscriptions = useRef<Record<string, boolean>>({});

    // if the pools from the factory change, re-init them
    useMemo(() => {
        let mounted = true;
        console.debug('Attempting to initialise pools');
        if (provider?.network?.chainId) {
            const network = provider.network?.chainId?.toString();
            if (isSupportedNetwork(network as KnownNetwork)) {
                const fetchAndSetPools = async () => {
                    // for now just select the Tracer verfied pools (Tracer[0])
                    // this can be changed to select all or a specific list
                    let pools: PoolList | undefined = poolsState.poolsLists[network as KnownNetwork]?.Tracer[0];
                    if (!pools) {
                        const poolsLists = await new PoolListService(network)
                            .getAll()
                            .catch((err) => console.error(err));
                        if (!poolsLists) {
                            console.error('Failed to initialise pools: poolsList undefined');
                            return;
                        }
                        pools = poolsLists.Tracer[0] ?? [];
                        poolsDispatch({ type: 'setPoolLists', network: network as KnownNetwork, lists: poolsLists });
                    }
                    console.debug(`Initialising pools ${network.slice()}`, pools);
                    poolsDispatch({ type: 'resetPools' });
                    hasSetPools.current = false;
                    Promise.all(
                        pools.pools.map((pool) =>
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
    }, [provider?.network.chainId, poolsState.retryCount]);

    // fetch all pending commits
    useEffect(() => {
        let mounted = true;
        if (provider && poolsState.poolsInitialised) {
            Object.values(poolsState.pools).map((pool) => {
                const decimals = pool.poolInstance.quoteToken.decimals;
                // fetch commits
                fetchCommits(
                    {
                        committer: pool.poolInstance.committer.address,
                        lastUpdate: pool.poolInstance.lastUpdate.toNumber(),
                        address: pool.poolInstance.address,
                    },
                    provider,
                )
                    .then((committerInfo) => {
                        if (mounted) {
                            setExpectedPrice(pool.poolInstance);

                            committerInfo.allUnexecutedCommits.map(async (commit) => {
                                commitDispatch({
                                    type: 'addCommit',
                                    commitInfo: {
                                        pool: pool.poolInstance.address,
                                        id: commit.commitID,
                                        amount: new BigNumber(ethers.utils.formatUnits(commit.amount, decimals)),
                                        type: commit.commitType,
                                        from: commit.from,
                                        txnHash: commit.txnHash,
                                        created: commit.timestamp,
                                    },
                                });
                            });
                        }
                    })
                    .catch((err) => {
                        console.error('Failed to initialise committer', err);
                    });
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
                    quoteTokenBalance: new BigNumber(0),
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
        const tokens = [pool.shortToken.address, pool.longToken.address, pool.quoteToken.address];
        const decimals = pool.quoteToken.decimals;
        fetchTokenBalances(tokens, provider_, account, pool.address)
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
        fetchAggregateBalance(provider_, account, pool.committer.address, decimals)
            .then((balances) => {
                console.debug('Pending balances', {
                    longTokens: balances.longTokens.toNumber(),
                    shortTokens: balances.shortTokens.toNumber(),
                    quoteTokens: balances.quoteTokens.toNumber(),
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
        const tokens = [pool.shortToken.address, pool.longToken.address, pool.quoteToken.address];
        const decimals = pool.quoteToken.decimals;
        fetchTokenApprovals(tokens, provider, account, pool.address)
            .then((approvals) => {
                poolsDispatch({
                    type: 'setTokenApprovals',
                    pool: pool.address,
                    shortTokenAmount: new BigNumber(ethers.utils.formatUnits(approvals[0], decimals)),
                    longTokenAmount: new BigNumber(ethers.utils.formatUnits(approvals[1], decimals)),
                    quoteTokenAmount: new BigNumber(ethers.utils.formatUnits(approvals[2], decimals)),
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
                    quoteTokenDecimals: pool.quoteToken.decimals,
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

            // @ts-ignore
            if (!subscriptions.current[committerInfo.address]) {
                console.debug(`Subscribing committer: ${committerInfo.address}`);
                committer.filters.CreateCommit;
                committer.on(
                    committer.filters.CreateCommit(),
                    (id, amount, type, _appropriateUpdateInterval, _mintingFee, log) => {
                        // TODO id is now user
                        console.debug('Commit created', {
                            id,
                            amount,
                            type,
                        });

                        const decimals = poolsState.pools[pool].poolInstance.quoteToken.decimals;

                        // @ts-ignore
                        log.getTransaction().then((txn: ethers.providers.TransactionResponse) => {
                            if (commitDispatch) {
                                commitDispatch({
                                    type: 'addCommit',
                                    commitInfo: {
                                        id: parseInt(id),
                                        pool,
                                        from: txn?.from, // from address
                                        txnHash: txn.hash,
                                        type: type as CommitEnum,
                                        amount: new BigNumber(ethers.utils.formatUnits(amount, decimals)),
                                        created: txn.timestamp ?? Date.now() / 1000,
                                    },
                                });
                            }
                        });

                        // const amount_ = new BigNumber(ethers.utils.formatUnits(amount, decimals));
                        // poolsDispatch({ type: 'addToPending', pool: pool, commitType: type, amount: amount_ });
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
                        commitDispatch({
                            type: 'resetCommits',
                            pool: pool,
                        });
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
        const committerAddress = poolsState.pools[pool].poolInstance.committer.address;
        if (!committerAddress) {
            console.error('Failed to claim: Committer address undefined');
            // TODO handle error
        }
        if (!account) {
            console.error('Failed to claim: Account undefined');
        }
        const network = await signer?.getChainId();
        if (!signer) {
            console.error('Signer undefined when trying to mint');
            return;
        }
        const committer = PoolCommitter__factory.connect(committerAddress, signer);
        if (handleTransaction) {
            const poolName = poolsState.pools[pool].poolInstance.name;

            handleTransaction(committer.claim, [account], {
                network: (network ?? '0') as AvailableNetwork,
                onSuccess: (receipt) => {
                    console.debug('Successfully submitted claim txn: ', receipt);
                    // get and set token balances
                    updateTokenBalances(poolsState.pools[pool].poolInstance, provider);
                    options?.onSuccess ? options.onSuccess(receipt) : null;
                },
                statusMessages: {
                    waiting: {
                        title: `Claiming ${poolName} tokens`,
                    },
                    success: {
                        title: `${poolName} Claim Queued`,
                    },
                    error: {
                        title: `Claim from ${poolName} Failed`,
                    },
                },
            });
        }
    };

    const commitGasFee: (
        pool: string,
        commitType: CommitEnum,
        amount: BigNumber,
    ) => Promise<string | undefined> = async (pool = '', commitType, amount) => {
        const committerAddress = poolsState?.pools[pool]?.poolInstance?.committer?.address;

        if (!committerAddress) {
            console.error('Committer address undefined when trying to mint');
            // TODO handle error
        }

        if (!signer) {
            console.error('Signer undefined when trying to mint');
            return;
        }
        const committer = PoolCommitter__factory?.connect(committerAddress, signer);

        const mintGasEstimate = await committer?.estimateGas?.commit(
            commitType,
            ethers?.utils?.parseUnits(amount?.toFixed(), 18),
            false,
            false,
        );

        const formattedMintGasEstimate = ethers.utils.formatUnits(mintGasEstimate);
        const weiUnitPriceUSD = poolsState?.pools[pool]?.poolInstance?.lastPrice.div(10 ** 18);
        const mintGasPriceInUSD = weiUnitPriceUSD.multipliedBy(formattedMintGasEstimate);
        const mintGasPriceInUSDtoNumber = mintGasPriceInUSD.toNumber();
        const commitGasFee = mintGasPriceInUSDtoNumber.toFixed(20);

        return commitGasFee;
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
        amount: BigNumber,
        options?: Options,
    ) => Promise<void> = async (pool, commitType, amount, options) => {
        const committerAddress = poolsState.pools[pool].poolInstance.committer.address;
        const quoteTokenDecimals = poolsState.pools[pool].poolInstance.quoteToken.decimals;
        const nextRebalance = poolsState.pools[pool].poolInstance.lastUpdate
            .plus(poolsState.pools[pool].poolInstance.updateInterval)
            .toNumber();
        const frontRunning = poolsState.pools[pool].poolInstance.frontRunningInterval.toNumber();
        const targetTime =
            nextRebalance - Date.now() / 1000 < frontRunning
                ? nextRebalance + poolsState.pools[pool].poolInstance.updateInterval.toNumber()
                : nextRebalance;
        if (!committerAddress) {
            console.error('Committer address undefined when trying to mint');
            // TODO handle error
        }
        const network = await signer?.getChainId();
        if (!signer) {
            console.error('Signer undefined when trying to mint');
            return;
        }
        const committer = PoolCommitter__factory.connect(committerAddress, signer);
        console.debug(
            `Creating commit. Amount: ${ethers.utils.parseUnits(
                amount.toFixed(),
                quoteTokenDecimals,
            )}, Raw amount: ${amount.toFixed()}`,
        );
        if (handleTransaction) {
            handleTransaction(
                committer.commit,
                [commitType, ethers.utils.parseUnits(amount.toFixed(), quoteTokenDecimals), false, false],
                {
                    network: (network ?? '0') as AvailableNetwork,
                    onSuccess: (receipt) => {
                        console.debug('Successfully submitted commit txn: ', receipt);
                        // get and set token balances
                        updateTokenBalances(poolsState.pools[pool].poolInstance, provider);
                        options?.onSuccess ? options.onSuccess(receipt) : null;
                    },
                    statusMessages: {
                        waiting: {
                            title: 'Submitting Order',
                            body: (
                                <div
                                    className="flex items-center cursor-pointer"
                                    onClick={() =>
                                        watchAsset(provider as ethers.providers.JsonRpcProvider, {
                                            address: poolsState.pools[pool].poolInstance.address,
                                            decimals: quoteTokenDecimals,
                                            symbol:
                                                commitType === CommitEnum.longMint
                                                    ? poolsState.pools[pool].poolInstance.longToken.symbol
                                                    : poolsState.pools[pool].poolInstance.shortToken.symbol,
                                        })
                                    }
                                >
                                    <Logo
                                        className="mr-2"
                                        size="md"
                                        ticker={tokenSymbolToLogoTicker(
                                            commitType === CommitEnum.longMint
                                                ? poolsState.pools[pool].poolInstance.longToken.symbol
                                                : poolsState.pools[pool].poolInstance.shortToken.symbol,
                                        )}
                                    />
                                    <div>Add to wallet</div>
                                </div>
                            ),
                        },
                        symbol:
                            commitType === CommitEnum.longMint
                                ? poolsState.pools[pool].poolInstance.longToken.symbol
                                : poolsState.pools[pool].poolInstance.shortToken.symbol,
                        type: CommitToQueryFocusMap[commitType],
                        nextRebalance: targetTime,
                        success: {
                            title: 'Order Submitted',
                        },
                        error: {
                            title: 'Order Failed',
                        },
                    },
                },
            );
        }
    };

    const approve: (pool: string, quoteTokenSymbol: string) => Promise<void> = async (pool, quoteTokenSymbol) => {
        if (!signer) {
            console.error('Failed to approve token: signer undefined');
            return;
        }

        const token = PoolToken__factory.connect(poolsState.pools[pool].poolInstance.quoteToken.address, signer);
        const network = await signer?.getChainId();
        if (handleTransaction) {
            handleTransaction(token.approve, [pool, ethers.utils.parseEther(Number.MAX_SAFE_INTEGER.toString())], {
                network: (network?.toString() ?? '0') as AvailableNetwork,
                onSuccess: async (receipt) => {
                    console.debug('Successfully approved token', receipt);
                    poolsDispatch({
                        type: 'setTokenApproved',
                        token: 'quoteToken',
                        pool: pool,
                        value: new BigNumber(Number.MAX_SAFE_INTEGER),
                    });
                },
                statusMessages: {
                    waiting: {
                        title: `Unlocking ${quoteTokenSymbol}`,
                        body: '',
                    },
                    success: {
                        title: `${quoteTokenSymbol} Unlocked`,
                        body: '',
                    },
                    error: {
                        title: `Unlock ${quoteTokenSymbol} Failed`,
                        body: '',
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
