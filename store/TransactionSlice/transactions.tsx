import React from 'react';
import { CommitPendingNotification, CommitSuccessNotification } from '@components/General/Notification/Commit';
import { ToastContent, ToastOptions, UpdateOptions } from 'react-toastify';
import { TransactionType } from './types';

const AUTO_DISMISS = 5000; // 4 seconds

const knownTransactionErrors: (error: any) => UpdateOptions | undefined = (error) => {
    console.log('error', error);
    if (error?.code === 4001) {
        // user denied txn
        return {
            render: 'Transaction Dismissed',
            type: 'warning',
            isLoading: false,
            autoClose: AUTO_DISMISS,
        };
    } else if (error?.data?.message === 'not enough funds for gas') {
        // this error uses error.code === -32603 and error.data.code === -32000
        // which are both broad error codes unfortunately so cant be used for the checks
        return {
            render: 'Insufficient funds for gas',
            type: 'error',
            isLoading: false,
            autoClose: AUTO_DISMISS,
        };
    }
};

export const transactionMap: Record<
    TransactionType,
    {
        pending: (props: any) => [ToastContent, ToastOptions?];
        success: (props: any) => UpdateOptions;
        error: ({ props, error }: { props?: any; error: any }) => UpdateOptions;
    }
> = {
    DEFAULT: {
        pending: () => ['Transaction Pending'],
        success: () => ({
            render: 'Order Submitted',
        }),
        error: ({ error }) =>
            knownTransactionErrors(error) ?? {
                render: 'Transaction Failed',
                type: 'error',
            },
    },
    APPROVE: {
        pending: (props) => [`Approving ${props.tokenSymbol}`],
        success: (props) => ({
            render: `${props.settlementToken} Unlocked`,
            type: 'success',
            isLoading: false,
            autoClose: AUTO_DISMISS,
        }),
        error: ({ props, error }) =>
            knownTransactionErrors(error) ?? {
                render: `Unlock ${props.tokenSymbol}`,
                type: 'error',
                isLoading: false,
                autoClose: AUTO_DISMISS,
            },
    },
    COMMIT: {
        pending: (props) => [
            <>
                <CommitPendingNotification {...props} />
            </>,
        ],
        success: (props) => ({
            render: <CommitSuccessNotification {...props} />,
            type: 'success',
            isLoading: false,
            autoClose: props.nextRebalance * 1000 - Date.now(), // seconds till next rebalance
        }),
        error: ({ error }) =>
            knownTransactionErrors(error) ?? {
                render: 'Transaction Failed',
                type: 'error',
                isLoading: false,
                autoClose: AUTO_DISMISS,
            },
    },
    CLAIM: {
        pending: (props) => [`Claiming ${props.poolName} tokens`],
        success: (props) => ({
            render: `${props.poolName} Claim Queued`,
            type: 'success',
            isLoading: false,
            autoClose: AUTO_DISMISS,
        }),
        error: ({ props, error }) =>
            knownTransactionErrors(error) ?? {
                render: `Claim from ${props.poolName} Failed`,
                type: 'error',
                isLoading: false,
                autoClose: AUTO_DISMISS,
            },
    },
};
