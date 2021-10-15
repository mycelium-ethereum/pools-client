import { useState, useMemo } from 'react';
import { usePools } from '@context/PoolContext';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { CommitEnum } from '@libs/constants';
import { ClaimablePool, QueuedCommit } from '@libs/types/General';
import { calcTokenPrice } from '@tracer-protocol/tracer-pools-utils';
import { useCommits } from '@context/UsersCommitContext';

export default (() => {
    const { account = '', provider } = useWeb3();
    const { commits = {} } = useCommits();
    const { pools } = usePools();
    const [pendingCommits, setPendingCommits] = useState<QueuedCommit[]>([]);
    const [claimablePools, setClaimablePools] = useState<ClaimablePool[]>([]);

    useMemo(() => {
        // filter user commits
        if (pools && Object.keys(pools).length && provider && account) {
            const parsedCommits: QueuedCommit[] = [];
            const claimablePools: ClaimablePool[] = [];
            for (const pool of Object.values(pools)) {

                const {
                    address,
                    name,
                    shortToken,
                    longToken,
                    nextShortBalance,
                    nextLongBalance,
                    lastUpdate,
                    updateInterval,
                    committer: {
                        global: {
                            pendingLong: { burn: pendingLongBurn },
                            pendingShort: { burn: pendingShortBurn },
                        },
                        user: {
                            pending,
                            followingUpdate,
                            claimable: {
                                shortTokens: claimableShortTokens,
                                longTokens: claimableLongTokens,
                                settlementTokens: claimableSettlementTokens
                            }
                        }
                    },
                } = pool;

                const shortTokenPrice = calcTokenPrice(nextShortBalance, shortToken.supply.plus(pendingShortBurn));
                const longTokenPrice = calcTokenPrice(nextLongBalance, longToken.supply.plus(pendingLongBurn));

                Object.keys(pending).map((key) => {
                    const amounts = pending[key as 'long' | 'short'];
                    if (key === 'long') {
                        if (!amounts.burn.eq(0)) {
                            // some burn amount
                            parsedCommits.push({
                                pool: address,
                                token: longToken,
                                amount: amounts.burn,
                                tokenPrice: longTokenPrice,
                                commitmentTime: lastUpdate.plus(updateInterval),
                                type: CommitEnum.long_burn
                            })
                        }
                        if (!amounts.mint.eq(0)) {
                            parsedCommits.push({
                                pool: address,
                                token: longToken,
                                amount: amounts.mint,
                                tokenPrice: longTokenPrice,
                                commitmentTime: lastUpdate.plus(updateInterval),
                                type: CommitEnum.long_mint
                            })
                        }
                    } else if (key === 'short') {
                        if (!amounts.burn.eq(0)) {
                            parsedCommits.push({
                                pool: address,
                                token: shortToken,
                                amount: amounts.burn,
                                tokenPrice: shortTokenPrice,
                                commitmentTime: lastUpdate.plus(updateInterval),
                                type: CommitEnum.short_burn
                            })
                        }
                        if (!amounts.mint.eq(0)) {
                            parsedCommits.push({
                                pool: address,
                                token: shortToken,
                                amount: amounts.mint,
                                tokenPrice: shortTokenPrice,
                                commitmentTime: lastUpdate.plus(updateInterval),
                                type: CommitEnum.short_mint
                            })
                        }
                    }

                })

                Object.keys(followingUpdate).map((key) => {
                    const amounts = pending[key as 'long' | 'short'];
                    if (key === 'long') {
                        if (!amounts.burn.eq(0)) {
                            // some burn amount
                            parsedCommits.push({
                                pool: address,
                                token: longToken,
                                amount: amounts.burn,
                                tokenPrice: longTokenPrice,
                                commitmentTime: lastUpdate.plus(updateInterval).plus(updateInterval),
                                type: CommitEnum.long_burn
                            })
                        }
                        if (!amounts.mint.eq(0)) {
                            parsedCommits.push({
                                pool: address,
                                token: longToken,
                                amount: amounts.mint,
                                tokenPrice: longTokenPrice,
                                commitmentTime: lastUpdate.plus(updateInterval).plus(updateInterval),
                                type: CommitEnum.long_mint
                            })
                        }
                    } else if (key === 'short') {
                        if (!amounts.burn.eq(0)) {
                            parsedCommits.push({
                                pool: address,
                                token: shortToken,
                                amount: amounts.burn,
                                tokenPrice: shortTokenPrice,
                                commitmentTime: lastUpdate.plus(updateInterval).plus(updateInterval),
                                type: CommitEnum.short_burn
                            })
                        }
                        if (!amounts.mint.eq(0)) {
                            parsedCommits.push({
                                pool: address,
                                token: shortToken,
                                amount: amounts.mint,
                                tokenPrice: shortTokenPrice,
                                commitmentTime: lastUpdate.plus(updateInterval).plus(updateInterval),
                                type: CommitEnum.short_mint
                            })
                        }
                    }
                })

                if (
                    !claimableLongTokens.eq(0) || !claimableShortTokens.eq(0) || !claimableSettlementTokens.eq(0)
                ) {
                    claimablePools.push({
                        pool: {
                            address,
                            name
                        },
                        longTokenPrice,
                        shortTokenPrice,
                        claimableLongTokens,
                        claimableShortTokens,
                        claimableSettlementTokens,
                    })
                    // some claimable amount add it to the list of claimable pools
                }
            }
            setClaimablePools(claimablePools);
            setPendingCommits(parsedCommits);
        }
    }, [pools, commits, provider, account]);

    return {
        claimablePools,
        pendingCommits
    };
}) as () => {
    claimablePools: ClaimablePool[],
    pendingCommits: QueuedCommit[]

}
