import { CommitEnum } from '@tracer-protocol/pools-js';
import { DEFAULT_PENDING_COMMIT_AMOUNTS } from '~/constants/commits';
import { StateSlice } from '~/store/types';
import { CommitTypeString } from '~/types/commits';
import { IPendingCommitSlice } from './types';
import { StoreState } from '..';

export const createPendingCommitSlice: StateSlice<IPendingCommitSlice> = (set) => ({
    commits: {},
    userPending: {},

    addCommit: (commitInfo) => {
        const { txnHash, pool } = commitInfo;
        const [poolLower, txnHashLower] = [pool.toLowerCase(), txnHash.toLowerCase()];
        console.debug('Adding commit', commitInfo);
        // immer set
        set((state) => {
            if (!state.commits[poolLower]) {
                state.commits[poolLower] = {};
            }
            state.commits[poolLower][txnHashLower] = commitInfo;

            const key = CommitEnum[commitInfo.type] as CommitTypeString;
            try {
                // add to pending user balance amounts
                if (!state.userPending[poolLower]) {
                    state.userPending[poolLower] = {};
                }
                if (!state.userPending[poolLower][commitInfo.from]) {
                    state.userPending[poolLower][commitInfo.from] = { ...DEFAULT_PENDING_COMMIT_AMOUNTS };
                }
                state.userPending[poolLower][commitInfo.from][key] = state.userPending[poolLower][commitInfo.from][
                    key
                ].plus(commitInfo.amount);
            } catch (err) {
                console.error(
                    `Failed to add to pending commit amount: ${commitInfo.amount.toNumber()}, pool: ${poolLower}`,
                    err,
                );
            }
        });
    },
    addMultipleCommits: (commits) => {
        console.debug('Adding multiple commits', commits);
        // immer set
        set((state) => {
            commits.forEach((commitInfo) => {
                const [poolLower, txnHashLower] = [commitInfo.pool.toLowerCase(), commitInfo.txnHash.toLowerCase()];
                if (!state.commits[poolLower]) {
                    state.commits[poolLower] = {};
                }
                state.commits[poolLower][txnHashLower] = commitInfo;

                const key = CommitEnum[commitInfo.type] as CommitTypeString;
                try {
                    // update userCommitAmounts
                    if (!state.userPending[poolLower]) {
                        state.userPending[poolLower] = {};
                    }
                    if (!state.userPending[poolLower][commitInfo.from]) {
                        state.userPending[poolLower][commitInfo.from] = { ...DEFAULT_PENDING_COMMIT_AMOUNTS };
                    }
                    state.userPending[poolLower][commitInfo.from][key] = state.userPending[poolLower][commitInfo.from][
                        key
                    ].plus(commitInfo.amount);
                } catch (err) {
                    console.error(
                        `Failed to add to pending commit amount: ${commitInfo.amount.toNumber()}, pool: ${poolLower}, key: ${key}`,
                        err,
                    );
                }
            });
        });
    },

    removeCommits: (pool, updateIntervalId) => {
        const poolLower = pool.toLowerCase();
        console.debug(`Removing commit ${poolLower}-${updateIntervalId}`);
        // immer delete
        set((state) => {
            const commits = state.commits[poolLower];
            if (commits) {
                Object.values(commits)?.map((commit) => {
                    if (commit.appropriateIntervalId === updateIntervalId) {
                        const commitToDelete = state.commits[poolLower][commit.txnHash];

                        // update userCommitAmounts
                        const key = CommitEnum[commitToDelete.type] as CommitTypeString;
                        try {
                            if (!state.userPending[poolLower]) {
                                state.userPending[poolLower] = {};
                            }
                            if (!state.userPending[poolLower][commitToDelete.from]) {
                                state.userPending[poolLower][commitToDelete.from] = {
                                    ...DEFAULT_PENDING_COMMIT_AMOUNTS,
                                };
                            }
                            state.userPending[poolLower][commitToDelete.from][key] = state.userPending[poolLower][
                                commitToDelete.from
                            ][key].plus(commitToDelete.amount);
                        } catch (err) {
                            console.error(
                                `Failed to remove pending commit amount: ${commitToDelete.amount.toNumber()}, pool: ${poolLower}, key: ${key}`,
                                err,
                            );
                        }

                        // delete commit entry
                        delete state.commits[poolLower][commit.txnHash];
                    }
                });
            }
        });
    },
});

export const selectCommits: (state: StoreState) => IPendingCommitSlice['commits'] = (state) =>
    state.pendingCommitSlice.commits;
export const selectUserPendingCommitAmounts: (state: StoreState) => IPendingCommitSlice['userPending'] = (state) =>
    state.pendingCommitSlice.userPending;
export const selectAddCommit: (state: StoreState) => IPendingCommitSlice['addCommit'] = (state) =>
    state.pendingCommitSlice.addCommit;

export const selectUserCommitActions: (state: StoreState) => {
    addCommit: IPendingCommitSlice['addCommit'];
    addMultipleCommits: IPendingCommitSlice['addMultipleCommits'];
    removeCommits: IPendingCommitSlice['removeCommits'];
} = (state) => ({
    addCommit: state.pendingCommitSlice.addCommit,
    addMultipleCommits: state.pendingCommitSlice.addMultipleCommits,
    removeCommits: state.pendingCommitSlice.removeCommits,
});
