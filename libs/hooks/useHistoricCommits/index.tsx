import { useMemo, useReducer } from 'react';
// import { usePools } from '@context/PoolContext';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import {
    CommitEnum,
    // SideEnum
} from '@libs/constants';
import { HistoricCommit } from '@libs/types/General';
// import { calcTokenPrice } from '@tracer-protocol/tracer-pools-utils';
import { HistoricCommitsState, historicsReducer, initialHistoricsState, LoadingState } from './state';
import { fetchPoolCommits, SourceType } from '@libs/utils/reputationAPI';
import BigNumber from 'bignumber.js';
import { DEFAULT_POOLSTATE } from '@libs/constants/pool';
import { ethers } from 'ethers';
import { usePools } from '@context/PoolContext';
import { calcTokenPrice } from '@tracer-protocol/tracer-pools-utils';

// const commitType = (num: number) => {
//     if (num < 0.25) {
//         return CommitEnum.long_mint;
//     } else if (num >= 0.25 && num < 0.5) {
//         return CommitEnum.long_burn;
//     } else if (num >= 0.5 && num < 0.75) {
//         return CommitEnum.short_mint;
//     } else {
//         return CommitEnum.short_burn;
//     }
// };

// const generateRandomData: () => HistoricCommit[] = () => {
//     const data: HistoricCommit[] = [];

//     for (let i = 0; i < 20; i++) {
//         data.push({
//             id: i,
//             type: commitType(Math.random()),
//             pool: '',
//             amount: new BigNumber(Math.random() * 1000),
//             from: '0x62e2301441a117aeF332CAcb8dE280DF7eed14b7',
//             txnHash: '',
//             created: Math.round(Date.now() / 1000 - Math.random() * 10000),
//             tokenPrice: new BigNumber(1 + Math.random()),
//             fee: new BigNumber(Math.random() * 100),
//             token: Math.random() ? DEFAULT_POOLSTATE.longToken : DEFAULT_POOLSTATE.shortToken,
//         });
//     }

//     return data;
// };

export default (() => {
    const { account = '', provider } = useWeb3();
    const [state, dispatch] = useReducer(historicsReducer, initialHistoricsState);
    const { pools } = usePools();

    useMemo(() => {
        let mounted = true;
        console.log(provider, "provider")
        if (account && provider) {
            console.log("fetching")
            const fetchHistoricCommits = async () => {
                console.log("Trying")
                try {
                    await provider.ready;
                    const network = provider.network.chainId;
                    const checkSummed = ethers.utils.getAddress(account);
                    console.log(network, "network")
                    const commits = await fetchPoolCommits(network.toString() as SourceType, {
                    	account: checkSummed
                    });
                    console.log("woooo commits", commits)
                    const allUserCommits: HistoricCommit[] = [];
                    for (const commit of commits) {
                    	const {
                    		shortToken,
                    		longToken,
                    		nextShortBalance,
                            quoteToken: {
                                decimals
                            },
                    		nextLongBalance,
                    		committer: {
                    			pendingLong: { burn: pendingLongBurn },
                    			pendingShort: { burn: pendingShortBurn },
                    		},
                    	} = pools?.[commit.pool] ?? DEFAULT_POOLSTATE;

                    	let token;
                        let tokenPrice: BigNumber = new BigNumber(0);
                    	if (commit.commitType === CommitEnum.short_mint || commit.commitType === CommitEnum.short_burn) {
                    		token = shortToken;
                    		tokenPrice = calcTokenPrice(nextShortBalance, shortToken.supply.plus(pendingShortBurn));
                    	} else {
                    		token = longToken;
                    		tokenPrice = calcTokenPrice(nextLongBalance, longToken.supply.plus(pendingLongBurn));
                    	}

                    	allUserCommits.push({
                            id: commit.commitID,
                            type: commit.commitType,
                            pool: commit.pool,
                            amount: new BigNumber(ethers.utils.formatUnits(commit.amount, decimals)),
                            from: commit.from,
                            txnHash: commit.txnHash,
                            created: commit.timestamp,
                            tokenPrice: tokenPrice,
                    		fee: new BigNumber(0),
                    		token,
                    	});
                    }
                    console.log("all commits", allUserCommits)
                    if (mounted) {
                        dispatch({ type: 'setCommits', commits: allUserCommits });
                        dispatch({ type: 'setLoadingState', state: LoadingState.HasFetched });
                    }
                } catch (err) {
                    console.error('Failed to set user commits', err);
                }
            };

            fetchHistoricCommits();
        }

        return () => (mounted = false);
    }, [provider, account]);

    return {
        ...state,
    };
}) as () => HistoricCommitsState;
