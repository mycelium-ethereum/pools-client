import { useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import shallow from 'zustand/shallow';
import { Pool } from '@tracer-protocol/pools-js';
import { tracerAPIService } from '~/services/TracerAPIService';
import { useStore } from '~/store/main';
import { selectUserCommitActions } from '~/store/PendingCommitSlice';
import {
    selectPoolInstanceActions,
    selectPoolInstances,
    selectPoolInstanceUpdateActions,
    selectPoolsInitialized,
} from '~/store/PoolInstancesSlice';
import { selectWeb3Info } from '~/store/Web3Slice';

import { isSupportedNetwork } from '~/utils/supportedNetworks';
import { useAllPoolLists } from '../useAllPoolLists';

/**
 * Wrapper to update all pools information
 */
export const useUpdatePoolInstances = (): void => {
    const { setMultiplePools, resetPools, setPoolsInitialized, setTokenBalances } = useStore(
        selectPoolInstanceActions,
        shallow,
    );
    const { updateTokenApprovals, updateTokenBalances, updateAverageEntryPrices } = useStore(
        selectPoolInstanceUpdateActions,
        shallow,
    );
    const { addMutlipleCommits } = useStore(selectUserCommitActions, shallow);
    const { provider, account, network } = useStore(selectWeb3Info, shallow);
    const poolLists = useAllPoolLists();
    const pools = useStore(selectPoolInstances);
    const poolsInitialized = useStore(selectPoolsInitialized);

    // ref to assist in the ensuring that the pools are not getting set twice
    const hasSetPools = useRef(false);

    // if the pools from the factory change, re-init them
    useEffect(() => {
        let mounted = true;
        console.debug('Attempting to initialise pools');
        // this is not the greatest for the time being
        if (!!poolLists.length && provider?.network?.chainId) {
            const network = provider.network?.chainId?.toString();
            if (isSupportedNetwork(network)) {
                const fetchAndSetPools = async () => {
                    console.debug(`Initialising pools ${network.slice()}`, pools);
                    resetPools();
                    hasSetPools.current = false;
                    setPoolsInitialized(false);
                    Promise.all(
                        poolLists.map((pool) =>
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
    }, [provider, poolLists]);

    // fetch all pending commits
    useEffect(() => {
        let mounted = true;
        if (provider && poolsInitialized) {
            Object.values(pools).map((pool) => {
                const decimals = pool.poolInstance.settlementToken.decimals;
                const network = provider.network.chainId;
                if (isSupportedNetwork(network)) {
                    // fetch commits
                    tracerAPIService
                        .fetchPendingCommits({ pool: pool.poolInstance.address })
                        .then((pendingCommits) => {
                            if (mounted) {
                                addMutlipleCommits(
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
            Object.values(pools).map((pool) => {
                // get and set token balances and approvals for each pool
                updateTokenBalances(pool.poolInstance.address, provider, account);
                updateAverageEntryPrices(pool.poolInstance.address, account);
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
    }, [account, network, poolsInitialized]);
};
