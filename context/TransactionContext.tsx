import React, { createContext, useContext, useState } from 'react';
import { AppearanceTypes, useToasts } from 'react-toast-notifications';
import { Children, Result } from '@libs/types/General';
import { ContractTransaction, ContractReceipt } from 'ethers';
import BigNumber from 'bignumber.js';
import PendingCommit from '@components/General/Notification/PendingCommit';
import { PENDING_COMMIT } from '@libs/constants';

export type Options = {
    onSuccess?: (receipt?: ContractReceipt | Result) => any; // eslint-disable-line
    onError?: (error?: Error | Result) => any;
    afterConfirmation?: (hash: string) => any;
    statusMessages?: {
        waiting?: string; // transaction message for when we are waiting for the user to confirm
        error?: string; // transaction message for when the transaction fails
        success?: string; // transaction message for when the transaction succeeds
        pending?: string; // transaction message for when the transaction is pending
        userConfirmed?: string; // transaction method for when user confirms through provider
    };
};
type HandleTransactionType =
    | ((
          callMethod: (...args: any) => Promise<ContractTransaction>,
          params: any[], // eslint-disable-line
          options?: Options,
      ) => void)
    | undefined;

type HandleAsyncType =
    | ((
          callMethod: (...args: any) => Promise<Result>,
          params: any[], // eslint-disable-line
          options?: Options,
      ) => void)
    | undefined;

interface TransactionContextProps {
    handleTransaction: HandleTransactionType;
    handleAsync: HandleAsyncType;
}
interface CommitContextProps {
    addCommit: (
        id: number,
        commitInfo: {
            tokenName: string;
            amount: BigNumber;
            value: BigNumber;
            timeTillUpkeep: number;
            timeTillFrontRunning: number;
            action: {
                text: string; // button text
                onClick: any; // on button click
            };
        },
    ) => void;
    removeCommit: (id: number) => void;
}

export const TransactionContext = createContext<Partial<TransactionContextProps>>({});
export const CommitContext = createContext<Partial<CommitContextProps>>({});

// type Status = 'INITIALIZED' | 'PROCESSING' | 'ERROR' | 'SUCCESS'

/**
 * TransactionStore which makes creating and updating Toasters easier when calling transactions.
 * Call handleTransaction with the required params to automatically update the toaster as the transaction
 *  moves through the various stages of its lifestile.
 * TODO store a list of transactions with a transaction state so the user can view all pending transactions
 * TODO populate the current pending transactions when the user visits the page
 */
export const TransactionStore: React.FC = ({ children }: Children) => {
    const { addToast, updateToast } = useToasts();
    // maps the commit id to a toast notification id
    const [pendingCommits, setPendingCommits] = useState<Record<number, string>>({});

    /** Specifically handles transactions */
    const handleTransaction: HandleTransactionType = async (callMethod, params, options) => {
        const { statusMessages, onError, onSuccess, afterConfirmation } = options ?? {};
        // actually returns a string error in the library
        const toastId = addToast(
            ['Pending Transaction', statusMessages?.waiting ?? 'Approve transaction with provider'],
            {
                appearance: 'loading' as AppearanceTypes,
                autoDismiss: false,
            },
        );
        const res = callMethod(...params);
        res.then(async (contractTransaction) => {
            afterConfirmation ? afterConfirmation(contractTransaction.hash) : null;
            updateToast(toastId as unknown as string, {
                content: [
                    'Transaction submitted',
                    statusMessages?.userConfirmed ?? `Waiting for confirmation ${contractTransaction.hash}`,
                ],
                appearance: 'loading' as AppearanceTypes,
                autoDismiss: false,
            });
            const receipt = await contractTransaction.wait();
            updateToast(toastId as unknown as string, {
                content: [
                    'Transaction Successful',
                    statusMessages?.success ?? (
                        <a href={`https://kovan.etherscan/tx/${receipt.transactionHash}`}>View transaction</a>
                    ),
                ],
                appearance: 'success',
                autoDismiss: true,
            });
            onSuccess ? onSuccess(receipt) : null;
        }).catch((error) => {
            console.error('Failed transaction', error);
            updateToast(toastId as unknown as string, {
                // confirmed this is a string
                content: ['Transaction Cancelled', statusMessages?.error ?? `Transaction cancelled: ${error.message}`],
                appearance: 'error',
                autoDismiss: true,
            });
            console.log(error, 'Error');
            onError ? onError(error) : null;
        });
    };

    /** Very similiar function to above but handles regular async functions, mainly signing */
    const handleAsync: HandleAsyncType = async (callMethod, params, options) => {
        const { statusMessages, onError, onSuccess } = options ?? {};
        // actually returns a string error in the library
        const toastId = addToast(
            ['Pending Transaction', statusMessages?.waiting ?? 'Approve transaction with provider'],
            {
                appearance: 'loading' as AppearanceTypes,
                autoDismiss: false,
            },
        );

        const res = callMethod(...params);
        Promise.resolve(res).then((res) => {
            if (res.status === 'error') {
                updateToast(toastId as unknown as string, {
                    // confirmed this is a string
                    content: statusMessages?.error ?? `Transaction cancelled. ${res.message}`,
                    appearance: 'error',
                    autoDismiss: true,
                });
                onError ? onError(res) : null;
            } else {
                updateToast(toastId as unknown as string, {
                    content: statusMessages?.success ?? `${res.message}`,
                    appearance: 'success',
                    autoDismiss: true,
                });
                onSuccess ? onSuccess(res) : null;
            }
        });
    };

    const addCommit: (
        id: number,
        commitInfo: {
            tokenName: string;
            amount: BigNumber;
            value: BigNumber;
            timeTillUpkeep: number;
            timeTillFrontRunning: number;
            action: {
                text: string; // button text
                onClick: any; // on button click
            };
        },
    ) => void = (id, commitInfo) => {
        const toastID = addToast(
            [
                commitInfo.tokenName,
                <PendingCommit
                    key={`pending-commit-${id}`}
                    amount={commitInfo.amount.toFixed(2)}
                    value={commitInfo.value}
                    action={commitInfo.action}
                    timeTillFrontRunning={commitInfo.timeTillFrontRunning}
                    timeTillUpkeep={commitInfo.timeTillUpkeep}
                />,
            ],
            {
                appearance: 'pendingCommit' as unknown as AppearanceTypes,
                autoDismiss: false,
                type: PENDING_COMMIT,
            },
        );

        setPendingCommits({
            ...pendingCommits,
            [id]: toastID as unknown as string,
        });
    };

    const removeCommit: (id: number) => void = (id) => {
        const toastID = pendingCommits[id];
        updateToast(toastID as unknown as string, {
            content: 'Cancelled commit',
            appearance: 'pendingCommit' as unknown as AppearanceTypes,
            autoDismiss: true,
            type: PENDING_COMMIT,
        });
        const newPending = { ...pendingCommits };
        delete newPending[id];
        setPendingCommits({
            ...newPending,
        });
    };

    return (
        <TransactionContext.Provider
            value={{
                handleTransaction,
                handleAsync,
            }}
        >
            <CommitContext.Provider
                value={{
                    addCommit,
                    removeCommit,
                }}
            >
                {children}
            </CommitContext.Provider>
        </TransactionContext.Provider>
    );
};

export const useCommitActions: () => Partial<CommitContextProps> = () => {
    const context = useContext(CommitContext);
    if (context === undefined) {
        throw new Error(`useCommitActions must be called within CommitContext`);
    }
    return context;
};

export const useTransactionContext: () => Partial<TransactionContextProps> = () => {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error(`useTransactionContext must be called within TransactionContext`);
    }
    return context;
};
