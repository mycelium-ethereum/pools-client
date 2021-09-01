import React, { createContext, useContext } from 'react';
import { Children, PendingCommitInfo } from '@libs/types/General';
import { useReducer } from 'react';
import { CommitAction, initialCommitState, reducer } from './commitDispatch';


interface CommitActionsProps {
    commitDispatch: React.Dispatch<CommitAction>
}

interface CommitContextProps {
    commits: Record<string, PendingCommitInfo>,
    showCommits: boolean
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

    // const addCommit: AddCommit = (id, commitInfo) => {
    //     const toastID = addToast([commitInfo.tokenName], {
    //         appearance: 'pendingCommit' as unknown as AppearanceTypes,
    //         autoDismiss: false,
    //         type: PENDING_COMMIT,
    //         commitInfo: {
    //             ...commitInfo,
    //         },
    //     });

    //     console.log('added id', id, toastID);
    //     pendingCommits.current = {
    //         ...pendingCommits.current,
    //         [id]: toastID as unknown as string,
    //     };
    // };

    // const updatePoolInfo: (
    //     id: number,
    //     info: {
    //         lastUpdate: BigNumber;
    //     },
    // ) => void = (id, info) => {
    //     const toastID = pendingCommits.current[id];
    //     if (!toastID) {
    //         return;
    //     }
    //     console.log(`Removing commit ${id}: ${toastID}`, pendingCommits);
    //     updateToast(toastID as unknown as string, {
    //         poolInfo: info,
    //     });
    // };

    // const removeCommit: (id: number) => void = (id) => {
    //     const toastID = pendingCommits.current[id];
    //     if (!toastID) {
    //         return;
    //     }
    //     console.log(`Removing commit ${id}: ${toastID}`, pendingCommits);
    //     updateToast(toastID as unknown as string, {
    //         content: 'Cancelled commit',
    //         appearance: 'pendingCommit' as unknown as AppearanceTypes,
    //         autoDismiss: true,
    //         type: PENDING_COMMIT,
    //     });
    //     delete pendingCommits.current[id];
    // };

    return (
        <CommitContext.Provider
            value={{
                ...state
            }}
        >
            <CommitActionsContext.Provider
                value={{
                    commitDispatch
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
