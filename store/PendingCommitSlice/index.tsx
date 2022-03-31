import { StateSlice } from '@store/types';
import { StoreState } from '..';
import { IPendingCommitSlice } from './types';

export const createPendingCommitSlice: StateSlice<IPendingCommitSlice> = (set) => ({
    commits: {},

    addCommit: (commitInfo) => {
        const { txnHash, pool } = commitInfo;
        const poolLower = pool.toLowerCase();
        console.debug('Adding commit', commitInfo);
        // immer set
        set((state) => {
            if (!state.commits[poolLower]) {
                state.commits[poolLower] = {};
            }
            state.commits[poolLower][txnHash.toLowerCase()] = commitInfo;
        });
    },
    resetCommits: (pool) => {
        set((state) => void (state.commits[pool.toLowerCase()] = {}));
    },
});

export const selectCommits: (state: StoreState) => IPendingCommitSlice['commits'] = (state) =>
    state.pendingCommitSlice.commits;

export const selectUserCommitActions: (state: StoreState) => {
    addCommit: IPendingCommitSlice['addCommit'];
    resetCommits: IPendingCommitSlice['resetCommits'];
} = (state) => ({
    addCommit: state.pendingCommitSlice.addCommit,
    resetCommits: state.pendingCommitSlice.resetCommits,
});
