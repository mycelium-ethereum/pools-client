import { StateSlice } from '~/store/types';
import { IPendingCommitSlice } from './types';
import { StoreState } from '..';

export const createPendingCommitSlice: StateSlice<IPendingCommitSlice> = (set) => ({
    commits: {},

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
        });
    },

    removeCommits: (pool, updateIntervalId) => {
        const poolLower = pool.toLowerCase();
        console.debug(`Removing commit ${poolLower}-${updateIntervalId}`);
        // immer delete
        set((state) => {
            let commits = state.commits[poolLower];
            if (commits) {
                Object.values(commits)?.map((commit) => { 
                    if (commit.appropriateIntervalId === updateIntervalId) {
                        delete state.commits[poolLower][commit.txnHash];
                    }
                })
            }
        });
    },
});

export const selectCommits: (state: StoreState) => IPendingCommitSlice['commits'] = (state) =>
    state.pendingCommitSlice.commits;

export const selectUserCommitActions: (state: StoreState) => {
    addCommit: IPendingCommitSlice['addCommit'];
    removeCommits: IPendingCommitSlice['removeCommits'];
} = (state) => ({
    addCommit: state.pendingCommitSlice.addCommit,
    removeCommits: state.pendingCommitSlice.removeCommits,
});
