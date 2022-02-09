import { CommitActionEnum } from '@libs/constants';
import { PendingCommitInfo } from '@libs/types/General';

export type CommitsState = {
    commits: Record<string, Record<string, PendingCommitInfo>>; // id is {POOL_ADDRESS}-{COMMIT_ID}
    updateCommits: boolean; // trigger that can be used to listen on commit updates
    showCommits: boolean; // opens and closes commit modal
    focus: CommitActionEnum; // show buys or show sells
};

export const initialCommitState: CommitsState = {
    commits: {},
    updateCommits: false,
    showCommits: false,
    focus: CommitActionEnum.mint,
};

export type CommitAction =
    | { type: 'addCommit'; commitInfo: PendingCommitInfo }
    | { type: 'hide' }
    | { type: 'show'; focus: CommitActionEnum }
    | { type: 'resetCommits'; pool: string }
    | { type: 'updateCommits' };

export const reducer: (state: CommitsState, action: CommitAction) => CommitsState = (state, action) => {
    switch (action.type) {
        case 'addCommit':
            const { txnHash, pool } = action.commitInfo;
            const poolLower = pool.toLowerCase();
            console.debug('Adding commit', action.commitInfo);
            return {
                ...state,
                commits: {
                    ...state.commits,
                    [`${poolLower}`]: {
                        ...state.commits[`${poolLower}`],
                        [txnHash.toLowerCase()]: action.commitInfo,
                    },
                },
            };
        case 'show':
            return {
                ...state,
                showCommits: true,
                focus: action.focus,
            };
        case 'resetCommits':
            return {
                ...state,
                commits: {
                    ...state.commits,
                    [`${action.pool.toLowerCase()}`]: {},
                },
            };
        case 'hide':
            return {
                ...state,
                showCommits: false,
            };
        default:
            throw new Error('Unexpected action');
    }
};
