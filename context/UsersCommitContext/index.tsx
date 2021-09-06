import React, { createContext, useContext } from 'react';
import { Children, CommitsFocus, PendingCommitInfo } from '@libs/types/General';
import { useReducer } from 'react';
import { CommitAction, initialCommitState, reducer } from './commitDispatch';

interface CommitActionsProps {
    commitDispatch: React.Dispatch<CommitAction>;
}

interface CommitContextProps {
    commits: Record<string, PendingCommitInfo>;
    showCommits: boolean;
    focus: CommitsFocus;
}
// type AddCommit = (id: number, commitInfo: PendingCommitInfo) => void;
// interface CommitContextProps {
//     addCommit: AddCommit;
//     removeCommit: (id: number) => void;
//     updatePoolInfo: (
//         id: number,
//         info: {
//             lastUpdate: BigNumber;
//         },
//     ) => void;
// }

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
                showCommits: state.showCommits,
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
