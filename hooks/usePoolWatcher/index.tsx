import { useMemo, useRef } from 'react';
import { ethers } from 'ethers';
import shallow from 'zustand/shallow';
import { EVENT_NAMES, MultiplePoolWatcher } from '@tracer-protocol/perpetual-pools-v2-pool-watcher';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { networkConfig } from '~/constants/networks';
import { useStore } from '~/store/main';
import { selectUserCommitActions } from '~/store/PendingCommitSlice';
import { selectPoolInstanceActions, selectPoolInstanceUpdateActions } from '~/store/PoolInstancesSlice';
import { selectAllPoolLists } from '~/store/PoolsSlice';
import { selectWeb3Info } from '~/store/Web3Slice';

export const usePoolWatcher = (): void => {
    const currentSubscribed = useRef<string | undefined>();
    const pools = useStore(selectAllPoolLists, (oldState, newState) => oldState.length === newState.length);
    const poolAddresses = useMemo(() => pools.map((pool) => pool.address), [pools.length]);
    const { network, account } = useStore(selectWeb3Info, shallow);
    const { addCommit, removeCommits } = useStore(selectUserCommitActions, shallow);
    const { setPoolIsWaiting, setPoolExpectedExecution } = useStore(selectPoolInstanceActions, shallow);
    const { handlePoolUpkeep } = useStore(selectPoolInstanceUpdateActions, shallow);

    useMemo(() => {
        const wssProvider = networkConfig[network as KnownNetwork]?.publicWebsocketRPC;
        if (!!poolAddresses?.length && !!wssProvider && !!network) {
            if (!currentSubscribed.current || currentSubscribed.current !== network) {
                currentSubscribed.current = network;
                console.count(`Setting pool watcher: ${network}`);

                const watcher = new MultiplePoolWatcher({
                    nodeUrl: wssProvider,
                    commitmentWindowBuffer: 20, // calculate and emit expected state 20 seconds before expected end of commitment window
                    chainId: network,
                    poolAddresses: poolAddresses,
                });

                watcher.initializePoolWatchers().then(() => {
                    watcher.on(EVENT_NAMES.COMMIT, (commitInfo) => {
                        console.debug('Received commit', commitInfo);
                        if (commitInfo.user.toLowerCase() === account?.toLowerCase()) {
                            addCommit({
                                pool: commitInfo.poolAddress,
                                id: commitInfo.txHash,
                                type: commitInfo.commitType,
                                txnHash: commitInfo.txHash,
                                // TODO parse in Decimals
                                amount: commitInfo.amount.times(10 ** -18),
                                from: commitInfo.user,
                                created: commitInfo.timestamp,
                                appropriateIntervalId: commitInfo.appropriateIntervalId,
                            });
                        }
                    });

                    watcher.on(EVENT_NAMES.COMMITS_EXECUTED, (data) => {
                        console.debug('Executed commits', data);
                        removeCommits(data.poolAddress, data.updateIntervalId);
                    });

                    watcher.on(EVENT_NAMES.UPKEEP, (data) => {
                        console.debug(`Completed upkeep on pool: ${data.poolAddress}`, data);
                        handlePoolUpkeep(
                            data.poolAddress,
                            new ethers.providers.WebSocketProvider(wssProvider),
                            account,
                        );
                    });
                    watcher.on(EVENT_NAMES.COMMITMENT_WINDOW_ENDING, (data) => {
                        console.debug('Commitment window ending', data);
                    });
                    watcher.on(EVENT_NAMES.COMMITMENT_WINDOW_ENDED, (data) => {
                        console.debug('Commitment window ended', data);
                        setPoolIsWaiting(data.poolAddress, true);
                        setPoolExpectedExecution(data.poolAddress);
                    });
                });
            }
        }
    }, [poolAddresses, network]);
};

export default usePoolWatcher;
