import { useMemo, useReducer } from 'react';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { HistoricCommit } from '@libs/types/General';
import { HistoricCommitsState, historicsReducer, initialHistoricsState, LoadingState } from './state';
import { fetchPoolCommits, SourceType } from '@libs/utils/reputationAPI';
import BigNumber from 'bignumber.js';
import { DEFAULT_POOLSTATE } from '@libs/constants/pool';
import { ethers } from 'ethers';
import { usePools } from '@context/PoolContext';
import { CommitEnum } from '@tracer-protocol/pools-js';

// const commitType = (num: number) => {
//     if (num < 0.25) {
//         return CommitEnum.longMint;
//     } else if (num >= 0.25 && num < 0.5) {
//         return CommitEnum.longBurn;
//     } else if (num >= 0.5 && num < 0.75) {
//         return CommitEnum.shortMint;
//     } else {
//         return CommitEnum.shortBurn;
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
        if (account && provider) {
            const fetchHistoricCommits = async () => {
                try {
                    await provider.ready;
                    const network = provider.network.chainId;
                    const checkSummed = ethers.utils.getAddress(account);
                    const commits = await fetchPoolCommits(network.toString() as SourceType, {
                        account: checkSummed,
                    });
                    console.debug('All user commits', commits);
                    const allUserCommits: HistoricCommit[] = [];
                    for (const commit of commits) {
                        const { poolInstance, userBalances } = pools?.[commit.pool] ?? DEFAULT_POOLSTATE;

                        const {
                            shortToken,
                            longToken,
                            quoteToken: { decimals },
                        } = poolInstance;

                        let token;
                        let tokenPrice: BigNumber = new BigNumber(0);
                        if (commit.commitType === CommitEnum.shortMint || commit.commitType === CommitEnum.shortBurn) {
                            token = {
                                ...shortToken,
                                ...userBalances.shortToken,
                            };
                            tokenPrice = poolInstance.getNextShortTokenPrice();
                        } else {
                            token = {
                                ...longToken,
                                ...userBalances.longToken,
                            };
                            tokenPrice = poolInstance.getNextLongTokenPrice();
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
