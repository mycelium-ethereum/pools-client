import { useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { isAddress } from 'ethers/lib/utils';
import shallow from 'zustand/shallow';
import { Pool, attemptPromiseRecursively, StaticPoolInfo, KnownNetwork } from '@tracer-protocol/pools-js';
import { useStore } from '~/store/main';
import { selectUserCommitActions } from '~/store/PendingCommitSlice';
import {
    selectPoolInstanceActions,
    selectPoolInstances,
    selectPoolInstanceUpdateActions,
    selectPoolsInitialized,
} from '~/store/PoolInstancesSlice';
import { KnownPoolsInitialisationErrors } from '~/store/PoolInstancesSlice/types';
import { selectImportPool } from '~/store/PoolsSlice';
import { selectWeb3Info } from '~/store/Web3Slice';

import { V2_SUPPORTED_NETWORKS } from '~/types/networks';
import { randomIntInRange } from '~/utils/helpers';
import { isSupportedNetwork } from '~/utils/supportedNetworks';
import { fetchPendingCommits } from '~/utils/tracerAPI';
import { useAllPoolLists } from '../useAllPoolLists';

const MAX_RETRY_COUNT = 10;

/**
 * Wrapper to update all pools information
 */
export const useUpdatePoolInstances = (): void => {
    const { setMultiplePools, resetPools, setPoolsInitialized, setTokenBalances, setPoolsInitializationError } =
        useStore(selectPoolInstanceActions, shallow);
    const {
        updateTokenApprovals,
        updatePoolTokenBalances,
        updateSettlementTokenBalances,
        updateTradeStats,
        updatePoolCommitStats,
        updatePoolBalancerPrices,
        updateNextPoolStates,
        updateOracleDetails,
    } = useStore(selectPoolInstanceUpdateActions, shallow);
    const importPool = useStore(selectImportPool);
    const { addMultipleCommits } = useStore(selectUserCommitActions, shallow);
    const { provider, account, network } = useStore(selectWeb3Info, shallow);
    const poolLists = useAllPoolLists();
    const pools = useStore(selectPoolInstances);
    const poolsInitialized = useStore(selectPoolsInitialized);

    // ref to assist in the ensuring that the pools are not getting set twice
    const hasSetPools = useRef(false);
    const [isFetchingPools, setIsFetchingPools] = useState(false);
    const [importCheck, setImportCheck] = useState(false);

    useEffect(() => {
        if (poolLists.length && !hasSetPools.current) {
            const handleImport = (address: string) => {
                const isDuplicatePool = poolLists.some((v: StaticPoolInfo) => v.address === address);

                if (!isDuplicatePool && isAddress(address)) {
                    console.debug('Importing', address);
                    importPool(network as KnownNetwork, address);
                } else if (isDuplicatePool) {
                    console.error('Duplicate pool or duplicate import:', address);
                } else {
                    console.error('Invalid address:', address);
                }
            };

            // Check if there are any pools to import from URL
            const queryString = window?.location?.search;
            const urlParams = new URLSearchParams(queryString);
            const poolAddresses = urlParams?.getAll('show');

            if (poolAddresses) {
                console.debug(
                    `Found ${poolAddresses.length} pool${poolAddresses.length > 1 ? 's' : ''} to import:`,
                    poolAddresses,
                );
                poolAddresses.forEach((address) => {
                    handleImport(address);
                });
                setImportCheck(true);
            }
        }
    }, [poolLists]);

    // if the pools from the factory change, re-init them
    useEffect(() => {
        let mounted = true;
        console.debug('Attempting to initialise pools');
        if (isFetchingPools) {
            console.debug('Skipped pools initialisation, already fetching pools');
        } else if (!provider) {
            console.debug('Skipped pools initialisation, provider not ready');
            resetPools();
            setPoolsInitializationError(KnownPoolsInitialisationErrors.ProviderNotReady);
        } else if (!poolLists.length) {
            console.debug('Skipped pools initialisation, poolList is empty');
            setPoolsInitializationError(KnownPoolsInitialisationErrors.NoPools);
        } else if (!network || !isSupportedNetwork(network)) {
            console.debug(`Skipped pools initialisation, network: ${network} not supported`);
            setPoolsInitializationError(KnownPoolsInitialisationErrors.NetworkNotSupported);
        } else if (!importCheck) {
            console.debug(`Import check not complete, skipping pools initialisation`);
            setPoolsInitializationError(KnownPoolsInitialisationErrors.NetworkNotSupported);
        } else {
            // all is good
            const fetchAndSetPools = async () => {
                let retryCount = 0;

                setIsFetchingPools(true);
                console.debug(`Initialising pools ${network.slice()}: ${retryCount}`, poolLists);
                resetPools();
                hasSetPools.current = false;
                setPoolsInitialized(false);
                setPoolsInitializationError(undefined);

                if (!poolLists.length) {
                    return setPoolsInitializationError(KnownPoolsInitialisationErrors.NoPools);
                }

                try {
                    const initialisedPools = await Promise.all(
                        poolLists.map(async (pool) => {
                            const poolSDKInstance = await attemptPromiseRecursively({
                                promise: () =>
                                    Pool.Create({
                                        ...pool,
                                        address: pool.address,
                                        provider,
                                    }),
                                // add randomness to retry delay
                                // so two failing at the same time are unlikely to be retried at the exact same time
                                interval: randomIntInRange(300, 1000),
                                retryCheck: async () => {
                                    retryCount += 1;

                                    if (retryCount >= MAX_RETRY_COUNT) {
                                        console.debug(
                                            `Skipped pools initialisation, retry count has exceeded ${MAX_RETRY_COUNT}`,
                                        );

                                        setPoolsInitializationError(
                                            KnownPoolsInitialisationErrors.ExceededMaxRetryCount,
                                        );
                                    }

                                    return retryCount < MAX_RETRY_COUNT;
                                },
                                maxAttempts: MAX_RETRY_COUNT,
                            }).catch((error) => {
                                console.debug(
                                    `Abandoning loading of ${pool.name || pool.address}, retry limit reached: ${error}`,
                                );

                                return null;
                            });

                            return poolSDKInstance;
                        }),
                    );

                    // filter out abandoned attempts (which result in null)
                    const poolsToSet = initialisedPools.filter((pool) => Boolean(pool)) as Pool[];

                    setMultiplePools(poolsToSet, network);
                    setPoolsInitialized(true);
                    hasSetPools.current = true;
                } catch (error) {
                    if (mounted) {
                        setPoolsInitialized(false);
                        setPoolsInitializationError(error);
                        setIsFetchingPools(false);
                    }
                }

                setIsFetchingPools(false);
            };
            fetchAndSetPools();
        }
        return () => {
            mounted = false;
        };
    }, [poolLists, provider]);

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
                                addMultipleCommits(
                                    pendingCommits.map((commit) => ({
                                        pool: pool.poolInstance.address,
                                        id: commit.commitID,
                                        amount: new BigNumber(ethers.utils.formatUnits(commit.amount, decimals)),
                                        type: commit.commitType,
                                        from: commit.from,
                                        txnHash: commit.txnHash,
                                        created: commit.timestamp,
                                        appropriateIntervalId: commit.updateIntervalId,
                                    })),
                                );
                            }
                        })
                        .catch((err) => {
                            console.error('Failed to initialise committer', err);
                        });
                }
            });
        }
        return () => {
            mounted = false;
        };
    }, [provider, poolsInitialized]);

    // update token balances and approvals when address changes
    useEffect(() => {
        if (!!account && poolsInitialized) {
            const pools_ = Object.values(pools).map((pool) => pool.poolInstance.address);
            // get and set token balances and approvals for each pool
            updateSettlementTokenBalances(pools_, provider, account);
            updatePoolTokenBalances(pools_, provider, account);
            updateTradeStats(pools_, network, account);
            updateTokenApprovals(pools_, provider, account);
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
    }, [account, network, poolsInitialized]);

    // update poolStats when poolsInitialized changes
    useEffect(() => {
        if (poolsInitialized) {
            const pools_ = Object.values(pools).map((pool) => pool.poolInstance.address);
            updatePoolCommitStats(pools_, network);
            updatePoolBalancerPrices(pools_, network);
            updateNextPoolStates(pools_, network);
            updateOracleDetails(pools_);
        }
    }, [network, poolsInitialized]);
};
