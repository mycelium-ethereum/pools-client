import React, { createContext, useContext, useState } from 'react';
import { AppearanceTypes, useToasts } from 'react-toast-notifications';
import { Children, Result } from '@libs/types/General';
import { ContractReceipt, ContractTransaction } from 'ethers';
import Toast, { ToastKeyAction, ToastKeyEnum } from '@components/General/Notification/Toast';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';

export type Options = {
    onSuccess?: (receipt?: ContractReceipt | Result) => any; // eslint-disable-line
    onError?: (error?: Error | Result) => any;
    afterConfirmation?: (hash: string) => any;
    network?: number; // network number;
    statusMessage?: ToastKeyAction;
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
        const { onError, onSuccess, afterConfirmation, network = '0', statusMessage } = options ?? {};

        let toastId: unknown;
        if (statusMessage) {
            toastId = addToast(Toast(statusMessage.waiting), {
                appearance: 'loading' as AppearanceTypes,
                autoDismiss: false,
            });
        }

        setPendingCount(pendingCount + 1);
        const res = callMethod(...params);
        res.then(async (contractTransaction) => {
            afterConfirmation ? afterConfirmation(contractTransaction.hash) : null;

            const contractReceipt = await contractTransaction.wait();

            if (statusMessage) {
                updateToast(toastId as unknown as string, {
                    content: Toast({
                        key: ToastKeyEnum.Committed,
                        props: {
                            poolName: statusMessage?.success?.props?.poolName,
                            actionType: statusMessage?.success?.props?.actionType,
                            network: statusMessage?.success?.props?.network,
                            receipt: contractReceipt,
                        },
                    }),
                    appearance: 'success',
                    autoDismiss: true,
                });
            } else {
                updateToast(toastId as unknown as string, {
                    content: [
                        'Transaction Successful',
                        <a
                            key={contractReceipt.transactionHash}
                            href={`${networkConfig[network].previewUrl}/${contractReceipt.transactionHash}`}
                            className="text-tracer-400 underline"
                            target="_blank"
                            rel="noreferrer"
                        >
                            View transaction
                        </a>,
                    ],
                    appearance: 'success',
                    autoDismiss: true,
                });
            }

            setPendingCount(pendingCount - 1);
            onSuccess ? onSuccess(contractReceipt) : null;
        }).catch((error) => {
            console.error('Failed transaction', error);
            updateToast(toastId as unknown as string, {
                // confirmed this is a string
                content: ['Transaction Failed', `Transaction failed: ${error.message}`],
                appearance: 'error',
                autoDismiss: true,
            });
            setPendingCount(pendingCount - 1);
            onError ? onError(error) : null;
        });
    };

    /** Very similar function to above but handles regular async functions, mainly signing */
    const handleAsync: HandleAsyncType = async (callMethod, params, options) => {
        const { onError, onSuccess } = options ?? {};
        // actually returns a string error in the library
        const toastId = addToast(['Pending Transaction', 'Approve transaction with provider'], {
            appearance: 'loading' as AppearanceTypes,
            autoDismiss: false,
        });

        setPendingCount(pendingCount + 1);

        const res = callMethod(...params);
        Promise.resolve(res).then((res) => {
            if (res.status === 'error') {
                updateToast(toastId as unknown as string, {
                    // confirmed this is a string
                    content: `Transaction cancelled. ${res.message}`,
                    appearance: 'error',
                    autoDismiss: true,
                });
                onError ? onError(res) : null;
            } else {
                updateToast(toastId as unknown as string, {
                    content: `${res.message}`,
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
