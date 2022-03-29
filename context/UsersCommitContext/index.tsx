import React, { createContext, useContext, useReducer } from 'react';
import { CommitActionEnum } from '@tracer-protocol/pools-js';
import { Children } from '~/types/general';
import { PendingCommitInfo } from '~/types/pools';
import { CommitAction, initialCommitState, reducer } from './commitDispatch';

interface CommitActionsProps {
    commitDispatch: React.Dispatch<CommitAction>;
}
interface CommitContextProps {
    commits: Record<string, Record<string, PendingCommitInfo>>;
    focus: CommitActionEnum;
}

export const CommitContext = createContext<Partial<CommitContextProps>>({});
export const CommitActionsContext = createContext<Partial<CommitActionsProps>>({});

/**
 */
export const UsersCommitStore: React.FC = ({ children }: Children) => {
    const [state, commitDispatch] = useReducer(reducer, initialCommitState);

    return (
        <CommitContext.Provider
            value={{
                commits: state.commits,
                focus: state.focus,
            }}
        >
            <CommitActionsContext.Provider
                value={{
                    commitDispatch,
                }}
            >
                {children}
            </CommitActionsContext.Provider>
        </CommitContext.Provider>
    );
};

export const useCommits: () => Partial<CommitContextProps> = () => {
    const context = useContext(CommitContext);
    if (context === undefined) {
        throw new Error(`usePendingCommits must be called within CommitContext`);
    }
    return context;
};

export const useCommitActions: () => Partial<CommitActionsProps> = () => {
    const context = useContext(CommitActionsContext);
    if (context === undefined) {
        throw new Error(`useCommitActions must be called within CommitActionsContext`);
    }
    return context;
};
