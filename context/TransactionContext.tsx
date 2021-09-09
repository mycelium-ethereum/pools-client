import React, { createContext, useContext, useState } from 'react';
import { AppearanceTypes, useToasts } from 'react-toast-notifications';
import { Children, Result } from '@libs/types/General';
import { ContractTransaction, ContractReceipt } from 'ethers';
import { networkConfig } from './Web3Context/Web3Context.Config';

export type Options = {
    onSuccess?: (receipt?: ContractReceipt | Result) => any; // eslint-disable-line
    onError?: (error?: Error | Result) => any;
    afterConfirmation?: (hash: string) => any;
    network?: number; // network number;
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

interface TransactionActionsContextProps {
    handleTransaction: HandleTransactionType;
    handleAsync: HandleAsyncType;
}
interface TransactionContextProps {
    pendingCount: number;
}

export const TransactionContext = createContext<Partial<TransactionContextProps>>({});
export const TransactionActionsContext = createContext<Partial<TransactionActionsContextProps>>({});

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
    const [pendingCount, setPendingCount] = useState(0);

    /** Specifically handles transactions */
    const handleTransaction: HandleTransactionType = async (callMethod, params, options) => {
        const { statusMessages, onError, onSuccess, afterConfirmation, network = '0' } = options ?? {};
        
        // actually returns a string error in the library
        const toastId = addToast(
            ['Pending Transaction', statusMessages?.waiting ?? 'Approve transaction with provider'],
            {
                appearance: 'loading' as AppearanceTypes,
                autoDismiss: false,
            },
        );
        setPendingCount(pendingCount + 1);
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
                        <a href={`${networkConfig[network].previewUrl}/${receipt.transactionHash}`}>View transaction</a>
                    ),
                ],
                appearance: 'success',
                autoDismiss: true,
            });
            setPendingCount(pendingCount - 1);
            onSuccess ? onSuccess(receipt) : null;
        }).catch((error) => {
            console.error('Failed transaction', error);
            updateToast(toastId as unknown as string, {
                // confirmed this is a string
                content: ['Transaction Cancelled', statusMessages?.error ?? `Transaction cancelled: ${error.message}`],
                appearance: 'error',
                autoDismiss: true,
            });
            setPendingCount(pendingCount - 1);
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

        setPendingCount(pendingCount + 1);

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
            setPendingCount(pendingCount - 1);
        });
    };

    return (
        <TransactionActionsContext.Provider
            value={{
                handleTransaction,
                handleAsync,
            }}
        >
            <TransactionContext.Provider
                value={{
                    pendingCount,
                }}
            >
                {children}
            </TransactionContext.Provider>
        </TransactionActionsContext.Provider>
    );
};

export const useTransactionContext: () => Partial<TransactionActionsContextProps> = () => {
    const context = useContext(TransactionActionsContext);
    if (context === undefined) {
        throw new Error(`useTransactionContext must be called within TransactionContext`);
    }
    return context;
};

export const useTransactionState: () => Partial<TransactionContextProps> = () => {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error(`useTransactionContext must be called within TransactionContext`);
    }
    return context;
};
