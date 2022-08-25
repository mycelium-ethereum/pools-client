import React from 'react';
import { ToastContent, ToastOptions, UpdateOptions } from 'react-toastify';
import { Notification } from '~/components/General/Notification';
import { CommitPendingNotification, CommitSuccessNotification } from '~/components/General/Notification/Commit';
import {
    ApproveProps,
    ArbBridgeProps,
    ClaimProps,
    CommitProps,
    FarmStakeWithdrawProps,
    TransactionType,
} from './types';

const AUTO_DISMISS = 5000; // 4 seconds

const knownTransactionErrors: (error: any) => UpdateOptions | undefined = (error) => {
    if (error?.code === 4001) {
        // user denied txn
        return {
            render: <Notification title="Order Dismissed" />,
            type: 'warning',
            isLoading: false,
            autoClose: AUTO_DISMISS,
            closeButton: true,
        };
    } else if (error?.data?.message === 'not enough funds for gas') {
        // this error uses error.code === -32603 and error.data.code === -32000
        // which are both broad error codes unfortunately so cant be used for the checks
        return {
            render: <Notification title="Insufficient funds for gas" />,
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
        error: ({ props, error }: { props: any; error: any }) => UpdateOptions;
    }
> = {
    DEFAULT: {
        pending: () => [
            <>
                <Notification title="Order Pending" />
            </>,
        ],
        success: () => ({
            render: <Notification title="Order Submitted" />,
            type: 'success',
            isLoading: false,
            closeButton: true,
        }),
        error: ({ error }) =>
            knownTransactionErrors(error) ?? {
                render: <Notification title="Order Failed" />,
                type: 'error',
                isLoading: false,
            },
    },
    APPROVE: {
        pending: (props: ApproveProps) => [
            <>
                <Notification title={`Approving ${props.tokenSymbol}`} />
            </>,
        ],
        success: (props: ApproveProps) => ({
            render: <Notification title={`${props.tokenSymbol} Unlocked`} />,
            type: 'success',
            isLoading: false,
            autoClose: AUTO_DISMISS,
            closeButton: true,
        }),
        error: ({ props, error }: { props: ApproveProps; error: any }) =>
            knownTransactionErrors(error) ?? {
                render: <Notification title={`Unlock ${props.tokenSymbol} Failed`} />,
                type: 'error',
                isLoading: false,
                autoClose: AUTO_DISMISS,
            },
    },
    COMMIT: {
        pending: (props: CommitProps) => [
            <>
                <CommitPendingNotification {...props} />
            </>,
        ],
        success: (props: CommitProps) => ({
            render: <CommitSuccessNotification {...props} />,
            type: 'success',
            isLoading: false,
            autoClose: props.expectedExecution - Math.floor(Date.now() / 1000), // seconds till expectedExecution
            closeButton: true,
        }),
        error: ({ error }) =>
            knownTransactionErrors(error) ?? {
                render: <Notification title={`Order Failed`} />,
                type: 'error',
                isLoading: false,
                autoClose: AUTO_DISMISS,
            },
    },
    CLAIM: {
        pending: (props: ClaimProps) => [
            <>
                <Notification title={`Claiming ${props.poolName} Tokens`} />
            </>,
        ],
        success: (props: ClaimProps) => ({
            render: <Notification title={`${props.poolName} Claim Queued`} />,
            type: 'success',
            isLoading: false,
            autoClose: AUTO_DISMISS,
            closeButton: true,
        }),
        error: ({ props, error }: { props: ClaimProps; error: any }) =>
            knownTransactionErrors(error) ?? {
                render: <Notification title={`Claim from ${props.poolName} Failed`} />,
                type: 'error',
                isLoading: false,
                autoClose: AUTO_DISMISS,
            },
    },
    ARB_ETH_DEPOSIT: {
        pending: (props: ArbBridgeProps) => [
            <>
                <Notification title={`Submitting ${props.tokenSymbol} ${props.type} from ${props.networkName}`} />
            </>,
        ],
        success: (props: ArbBridgeProps) => ({
            render: <Notification title={`Submitted ${props.tokenSymbol} ${props.type} from ${props.networkName}`} />,
            type: 'success',
            isLoading: false,
            autoClose: AUTO_DISMISS,
            closeButton: true,
        }),
        error: ({ props, error }: { props: ArbBridgeProps; error: any }) =>
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
        pending: (props: ArbBridgeProps) => [
            <>
                <Notification title={`Submitting ${props.tokenSymbol} ${props.type} from ${props.networkName}`} />
            </>,
        ],
        success: (props: ArbBridgeProps) => ({
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
            closeButton: true,
        }),
        error: ({ props, error }: { props: ArbBridgeProps; error: any }) =>
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
    FARM_CLAIM: {
        pending: () => [
            <>
                <Notification title="Claiming Rewards" />
            </>,
        ],
        success: () => ({
            render: <Notification title="Rewards Claimed" />,
            type: 'success',
            isLoading: false,
            closeButton: true,
        }),
        error: ({ error }) =>
            knownTransactionErrors(error) ?? {
                render: <Notification title="Claim Rewards Failed" />,
                type: 'error',
            },
    },
    FARM_STAKE_WITHDRAW: {
        pending: (props: FarmStakeWithdrawProps) => [
            <>
                <Notification title={`${props.type === 'withdraw' ? 'Unstaking' : 'Staking'} ${props.farmName}`} />
            </>,
        ],
        success: (props: FarmStakeWithdrawProps) => ({
            render: <Notification title={`${props.farmName} ${props.type === 'withdraw' ? 'Unstaked' : 'Staked'}`} />,
            type: 'success',
            isLoading: false,
            closeButton: true,
        }),
        error: ({ props, error }: { props: FarmStakeWithdrawProps; error: any }) =>
            knownTransactionErrors(error) ?? {
                render: <Notification title={`${props.type === 'withdraw' ? 'Unstake' : 'Stake'} ${props.farmName}`} />,
                type: 'error',
                isLoading: false,
                closeButton: true,
                autoClose: AUTO_DISMISS,
            },
    },
};
