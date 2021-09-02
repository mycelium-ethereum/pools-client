import { BUYS } from '@libs/constants';
import { CommitsFocus, PendingCommitInfo } from '@libs/types/General';

export type CommitsState = {
    commits: Record<string, PendingCommitInfo>; // id is {POOL_ADDRESS}-{COMMIT_ID}
    updateCommits: boolean; // trigger that can be used to listen on commit updates
    showCommits: boolean; // opens and closes commit modal
    focus: CommitsFocus; // show buys or show sells
};

export const initialCommitState: CommitsState = {
    commits: {},
    updateCommits: false,
    showCommits: false,
    focus: BUYS,
};

export type CommitAction =
    | { type: 'addCommit'; commitInfo: PendingCommitInfo }
    | { type: 'removeCommit'; id: number; pool: string }
    | { type: 'hide' }
    | { type: 'show'; focus: CommitsFocus }
    | { type: 'updateCommits' };

export const reducer: (state: CommitsState, action: CommitAction) => CommitsState = (state, action) => {
    switch (action.type) {
        case 'addCommit':
            const { id, pool } = action.commitInfo;
            console.log('Adding commit', action.commitInfo);
            return {
                ...state,
                commits: {
                    ...state.commits,
                    [`${pool.toLowerCase()}-${id}`]: action.commitInfo,
                },
            };
        case 'removeCommit':
            const { [`${action.pool.toLowerCase()}-${action.id}`]: _value, ...commitsWithout } = state.commits;
            return {
                ...state,
                commits: commitsWithout,
            };
        case 'show':
            return {
                ...state,
                showCommits: true,
                focus: action.focus,
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
