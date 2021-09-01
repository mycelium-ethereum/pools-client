import { CommitType } from '@libs/types/General';
import { BigNumber } from 'bignumber.js';

type PendingCommitInfo = {
    pool: string;
    id: number;
    type: CommitType;
    amount: BigNumber;
};
export type CommitsState = {
    commits: Record<string, PendingCommitInfo>; // id is {POOL_ADDRESS}-{COMMIT_ID}
    updateCommits: boolean; // trigger that can be used to listen on commit updates
    showCommits: boolean; // opens and closes commit modal
};

export const initialCommitState: CommitsState = {
    commits: {},
    updateCommits: false,
    showCommits: true,
};

export type CommitAction =
    | { type: 'addCommit'; commitInfo: PendingCommitInfo }
    | { type: 'removeCommit'; id: number; pool: string }
    | { type: 'setShow'; value: boolean }
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
        case 'setShow':
            return {
                ...state,
                showCommits: action.value,
            };
        default:
            throw new Error('Unexpected action');
    }
};
