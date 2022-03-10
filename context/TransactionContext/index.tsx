import React, { createContext, useContext, useState } from 'react';
import { AppearanceTypes, useToasts } from 'react-toast-notifications';
import { Children, Result } from '@libs/types/General';
import { ContractReceipt, ContractTransaction } from 'ethers';
import {
    AvailableNetwork,
    // networkConfig
} from '@context/Web3Context/Web3Context.Config';
// import { ARBITRUM, CommitsFocusEnum } from '@libs/constants';
import TimeLeft from '@components/TimeLeft';
import { useRouter } from 'next/router';
import { Logo, tokenSymbolToLogoTicker } from '@components/General';

type Content = {
    title?: React.ReactNode;
    body?: React.ReactNode;
    autoDismiss?: boolean;
};

export type Options = {
    onSuccess?: (receipt?: ContractReceipt | Result) => any; // eslint-disable-line
    onError?: (error?: Error | Result) => any;
    afterConfirmation?: (hash: string) => any;
    network?: AvailableNetwork; // network number;
    statusMessages?: {
        waiting?: Content; // transaction message for when we are waiting for the user to confirm
        error?: Content; // transaction message for when the transaction fails
        success?: Content; // transaction message for when the transaction succeeds
        nextRebalance?: number;
        symbol?: string;
        type?: 'mint' | 'burn' | 'flip';
        poolName?: string;
    };
};
type HandleTransactionType =
    | ((
          callMethod: (...args: any) => Promise<ContractTransaction>,
          params: any[], // eslint-disable-line
          options?: Options,
      ) => void)
    | undefined;

interface TransactionActionsContextProps {
    handleTransaction: HandleTransactionType;
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
    const router = useRouter();
    const { addToast, updateToast } = useToasts();
    const [pendingCount, setPendingCount] = useState(0);

    const handleClick = (focus: 'mint' | 'burn' | 'flip') =>
        router.push({
            pathname: '/portfolio/commits',
            query: {
                focus: focus,
            },
        });

    /** Specifically handles transactions */
    const handleTransaction: HandleTransactionType = async (callMethod, params, options) => {
        const {
            onError,
            onSuccess,
            afterConfirmation,
            // network = 0,
            statusMessages,
        } = options ?? {};

        const toastId: unknown = addToast(
            [statusMessages?.waiting?.title ?? 'Pending Transaction', statusMessages?.waiting?.body ?? ''],
            {
                appearance: 'loading' as AppearanceTypes,
                autoDismiss: false,
            },
        );

        setPendingCount((previousValue) => previousValue + 1);
        const res = callMethod(...params);

        res.then(async (contractTransaction) => {
            afterConfirmation ? afterConfirmation(contractTransaction.hash) : null;

            const contractReceipt = await contractTransaction.wait();

            updateToast(toastId as unknown as string, {
                content: [
                    statusMessages?.success?.title ?? 'Order Submitted',
                    statusMessages?.success?.body ?? (
                        <>
                            {statusMessages?.nextRebalance !== undefined ? (
                                <div className="whitespace-nowrap">
                                    {statusMessages?.type === 'mint' || statusMessages?.type === 'flip' ? (
                                        <div className="flex items-center mb-2">
                                            <Logo
                                                className="mr-2"
                                                size="md"
                                                ticker={tokenSymbolToLogoTicker(statusMessages?.symbol)}
                                            />
                                            <div>{statusMessages?.symbol} ready to claim in</div>
                                            <TimeLeft
                                                className="ml-2 px-3 py-1 border rounded bg-gray-50 dark:bg-cool-gray-800"
                                                targetTime={statusMessages?.nextRebalance ?? 0}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center mb-2">
                                            <div>USDC ready to claim in</div>
                                            <TimeLeft
                                                className="ml-2 px-3 py-1 border rounded bg-gray-50 dark:bg-cool-gray-800"
                                                targetTime={statusMessages?.nextRebalance ?? 0}
                                            />
                                        </div>
                                    )}
                                    <div
                                        className="text-tracer-400 underline cursor-pointer"
                                        onClick={() => handleClick(statusMessages?.type ?? 'mint')}
                                    >
                                        View order
                                    </div>
                                </div>
                            ) : null}
                            {/*<div>*/}
                            {/*    <a*/}
                            {/*        key={contractReceipt.transactionHash}*/}
                            {/*        href={`${networkConfig[network ?? ARBITRUM]?.previewUrl}/${*/}
                            {/*            contractReceipt.transactionHash*/}
                            {/*        }`}*/}
                            {/*        className="text-tracer-400 underline"*/}
                            {/*        target="_blank"*/}
                            {/*        rel="noreferrer"*/}
                            {/*    >*/}
                            {/*        View order*/}
                            {/*    </a>*/}
                            {/*</div>*/}
                        </>
                    ),
                ],
                appearance: 'success',
                autoDismiss: statusMessages?.success?.autoDismiss ?? true,
                autoDismissTimeout:
                    statusMessages?.nextRebalance !== undefined
                        ? (statusMessages?.nextRebalance - Date.now() / 1000) * 1000
                        : 0,
            });

            setPendingCount((previousValue) => previousValue - 1);
            onSuccess ? onSuccess(contractReceipt) : null;
        }).catch((error) => {
            console.error('Failed transaction', error, error.code);
            if (error?.code === 4001) {
                // user denied txn
                updateToast(toastId as unknown as string, {
                    content: ['Transaction Dismissed'],
                    appearance: 'warning',
                    autoDismiss: true,
                });
            } else if (error?.data?.message === 'not enough funds for gas') {
                // this error uses error.code === -32603 and error.data.code === -32000
                // which are both broad error codes unfortunately so cant be used for the checks
                updateToast(toastId as unknown as string, {
                    content: ['Insufficient funds for gas'],
                    appearance: 'error',
                    autoDismiss: true,
                });
            } else {
                updateToast(toastId as unknown as string, {
                    content: [
                        statusMessages?.error?.title ?? 'Transaction failed',
                        statusMessages?.error?.body ?? error.message,
                    ],
                    appearance: 'error',
                    autoDismiss: true,
                });
            }
            setPendingCount((previousValue) => previousValue - 1);
            onError ? onError(error) : null;
        });
    };

    return (
        <TransactionActionsContext.Provider
            value={{
                handleTransaction,
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
