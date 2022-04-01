import { useMemo, useRef } from "react";
import { usePools } from "~/context/PoolContext"; 
import {networkConfig} from "~/constants/networks";
import {useStore} from "~/store/main";
import {selectWeb3Info} from "~/store/Web3Slice";
import {KnownNetwork} from "@tracer-protocol/pools-js";
import {EVENT_NAMES, MultiplePoolWatcher} from "@tracer-protocol/perpetual-pools-v2-pool-watcher";
import {PoolLists} from "~/types/pools";
import {selectUserCommitActions} from "~/store/PendingCommitSlice";
import BigNumber from "bignumber.js";
import {ethers} from "ethers";

const emptyState: string[] = [];

const flattenAllPools: (poolsLists: PoolLists | undefined) => string[] = (poolsLists) => poolsLists ? poolsLists.All.map((poolList) => poolList.pools.map(pool => pool.address)).flat(1) : []

export const usePoolWatcher = () => {
    const currentSubscribed = useRef<string | undefined>();
    const { network, account } = useStore(selectWeb3Info);
    const { addCommit, removeCommits } = useStore(selectUserCommitActions);
    // TODO replace with pools-store
    const pools = usePools();
    const poolAddresses: string[] = useMemo(() => network ? flattenAllPools(pools.poolsLists?.[network]) : emptyState, [network, pools.poolsLists])

    useMemo(() => {
        const wssProvider = networkConfig[network as KnownNetwork]?.publicWebsocketRPC;
        if (!!poolAddresses?.length && !!wssProvider && !!network) {
            if (!currentSubscribed.current || currentSubscribed.current !== network) {
                currentSubscribed.current = network;
                console.count(`Setting pool watcher: ${network}`)
                console.log(poolAddresses)

                const watcher = new MultiplePoolWatcher({
                    nodeUrl: wssProvider,
                    commitmentWindowBuffer: 20, // calculate and emit expected state 20 seconds before expected end of commitment window
                    chainId: network,
                    poolAddresses: poolAddresses,
                    ignoreEvents: { [EVENT_NAMES.COMMITMENT_WINDOW_ENDED]: true, [EVENT_NAMES.COMMITMENT_WINDOW_ENDING]: true }
                })

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
                                amount: new BigNumber(ethers.utils.formatUnits(commitInfo.amount.toString(), 18)),
                                from: commitInfo.user,
                                created: commitInfo.timestamp,
                                appropriateIntervalId: commitInfo.appropriateIntervalId
                            })
                        }
                    })

                    watcher.on(EVENT_NAMES.COMMITS_EXECUTED, (data) => {
                        console.debug('Executed commit', data);
                        removeCommits(data.poolAddress, data.updateIntervalId);
                    })

                    watcher.on(EVENT_NAMES.UPKEEP, (data) => {
                        console.debug('Executed upkeep', data);
                    })
                })

            }
        }

    }, [poolAddresses, network])
}

export default usePoolWatcher;
