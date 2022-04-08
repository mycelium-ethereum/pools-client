import { useMemo, useRef } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import shallow from 'zustand/shallow';
import { Pool } from '@tracer-protocol/pools-js';
import { useStore } from '~/store/main';
import { selectUserCommitActions } from '~/store/PendingCommitSlice';
import {
    selectPoolInstanceActions,
    selectPoolInstances,
    selectPoolInstanceUpdateActions,
    selectPoolsInitialized,
} from '~/store/PoolInstancesSlice';
import { selectAllPoolLists } from '~/store/PoolsSlice';
import { selectWeb3Info } from '~/store/Web3Slice';

import { isSupportedNetwork } from '~/utils/supportedNetworks';
import { fetchPendingCommits, V2_SUPPORTED_NETWORKS } from '~/utils/tracerAPI';

/**
 * Wrapper to update all pools information
 */
export const useUpdatePoolInstances = (): void => {
    const { setMultiplePools, resetPools, setPoolsInitialized, setTokenBalances } = useStore(
        selectPoolInstanceActions,
        shallow,
    );
    const { updateTokenApprovals, updateTokenBalances } = useStore(selectPoolInstanceUpdateActions, shallow);
    const { addCommit } = useStore(selectUserCommitActions, shallow);
    const { provider, account } = useStore(selectWeb3Info, shallow);
    const poolAddresses = useStore(selectAllPoolLists, (oldState, newState) => oldState.length === newState.length);
    const pools = useStore(selectPoolInstances);
    const poolsInitialized = useStore(selectPoolsInitialized);

    // ref to assist in the ensuring that the pools are not getting set twice
    const hasSetPools = useRef(false);

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
                    setPoolsInitialized(false);
                    Promise.all(
                        poolAddresses.map((pool) =>
                            Pool.Create({
                                ...pool,
                                address: pool.address,
                                provider,
                            }),
                        ),
                    )
                        .then((pools_) => {
                            if (!hasSetPools.current && mounted) {
                                if (pools_.length) {
                                    // if pools exist
                                    setMultiplePools(pools_);
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
    useMemo(() => {
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
            });
        }
        return () => {
            mounted = false;
        };
    }, [provider, poolsInitialized]);

    // update token balances and approvals when address changes
    useMemo(() => {
        if (account && poolsInitialized) {
            Object.values(pools).map((pool) => {
                // get and set token balances and approvals for each pool
                updateTokenBalances(pool.poolInstance.address, provider, account);
                updateTokenApprovals(pool.poolInstance.address, provider, account);
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
    }, [account, poolsInitialized]);
};
