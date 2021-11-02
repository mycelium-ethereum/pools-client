import { HistoricCommit } from '@libs/types/General';

export enum LoadingState {
    Idle = 0,
    Fetching = 1,
    HasFetched = 2,
}

export interface HistoricCommitsState {
    commits: HistoricCommit[];
    loadingState: LoadingState;
}

export type HistoricsAction =
    | { type: 'setCommits'; commits: HistoricCommit[] }
    | { type: 'setLoadingState'; state: LoadingState }
    | { type: 'reset' };

export const initialHistoricsState = {
    commits: [],
    loadingState: LoadingState.Fetching,
};

export const historicsReducer: (state: HistoricCommitsState, action: HistoricsAction) => HistoricCommitsState = (
    state,
    action,
) => {
    switch (action.type) {
        case 'setCommits':
            return {
                ...state,
                commits: action.commits,
            };
        case 'setLoadingState':
            return {
                ...state,
                loadingState: action.state,
            };
        case 'reset':
            return {
                ...state,
                loadingState: LoadingState.Idle,
                commits: [],
            };
        default:
            throw new Error('Unexpected action');
    }
};
