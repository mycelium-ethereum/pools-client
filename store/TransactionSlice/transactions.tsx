import React from 'react';
import { CommitPendingNotification, CommitSuccessNotification } from '@components/General/Notification/Commit';
import { ToastContent, ToastOptions, UpdateOptions } from 'react-toastify';
import { TransactionType } from './types';
import { Notification } from '@components/General/Notification';

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
        pending: () => [
            <>
                <Notification title="Transaction Pending" />
            </>,
        ],
        success: () => ({
            render: <Notification title="Order Submitted" />,
            type: 'success',
            isLoading: false,
        }),
        error: ({ error }) =>
            knownTransactionErrors(error) ?? {
                render: <Notification title="Transaction Failed" />,
                type: 'error',
            },
    },
    APPROVE: {
        pending: (props) => [
            <>
                <Notification title={`Approving ${props.settlementToken}`} />
            </>,
        ],
        success: (props) => ({
            render: <Notification title={`${props.settlementToken} Unlocked`} />,
            type: 'success',
            isLoading: false,
            autoClose: AUTO_DISMISS,
        }),
        error: ({ props, error }) =>
            knownTransactionErrors(error) ?? {
                render: <Notification title={`Unlock ${props.settlementToken} Failed`} />,
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
                render: <Notification title={`Transaction Failed`} />,
                type: 'error',
                isLoading: false,
                autoClose: AUTO_DISMISS,
            },
    },
    CLAIM: {
        pending: (props) => [
            <>
                <Notification title={`Claiming ${props.poolName} Tokens`} />,
            </>,
        ],
        success: (props) => ({
            render: <Notification title={`${props.poolName} Claim Queued`} />,
            type: 'success',
            isLoading: false,
            autoClose: AUTO_DISMISS,
        }),
        error: ({ props, error }) =>
            knownTransactionErrors(error) ?? {
                render: <Notification title={`Claim from ${props.poolName} Failed`} />,
                type: 'error',
                isLoading: false,
                autoClose: AUTO_DISMISS,
            },
    },
    ARB_ETH_DEPOSIT: {
        pending: (props) => [
            <>
                <Notification title={`Submitting ${props.tokenSymbol} ${props.type} from ${props.networkName}`} />,
            </>,
        ],
        success: (props) => ({
            render: <Notification title={`Submitted ${props.tokenSymbol} ${props.type} from ${props.networkName}`} />,
            type: 'success',
            isLoading: false,
            autoClose: AUTO_DISMISS,
        }),
        error: ({ props, error }) =>
            knownTransactionErrors(error) ?? {
                render: (
                    <Notification
                        title={`Failed to submit ${props.tokenSymbol} ${props.type} from ${props.networkName}`}
                    />
                ),
                type: 'error',
                isLoading: false,
                autoClose: AUTO_DISMISS,
            },
    },
    ARB_BRIDGE: {
        pending: (props) => [
            <>
                <Notification title={`Submitting ${props.tokenSymbol} ${props.type} from ${props.networkName}`} />,
            </>,
        ],
        success: (props) => ({
            render: (
                <Notification title={`Submitted ${props.tokenSymbol} ${props.type} from ${props.networkName}`}>
                    {props.type === 'deposit'
                        ? 'It may take up to 10 minutes to receive your funds on Arbitrum. To view pending deposits, visit the official Arbitrum bridge.'
                        : 'It will take approximately 8 days to receive your funds on Ethereum. To view pending withdrawals, visit the official Arbitrum bridge.'}
                </Notification>
            ),
            type: 'success',
            isLoading: false,
            autoClose: AUTO_DISMISS,
        }),
        error: ({ props, error }) =>
            knownTransactionErrors(error) ?? {
                render: (
                    <Notification
                        title={`Failed to submit ${props.tokenSymbol} ${props.type} from ${props.networkName}`}
                    />
                ),
                type: 'error',
                isLoading: false,
                autoClose: AUTO_DISMISS,
            },
    },
};
