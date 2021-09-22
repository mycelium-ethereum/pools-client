import React, { ReactNode } from 'react';
import { CommitActionEnum } from '@libs/constants';
import { ContractReceipt } from 'ethers';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';

export enum ToastKeyEnum {
    Unlocking = 'unlocking',
    Unlocked = 'unlocked',
    Commit = 'commit',
    Committed = 'committed',
}

export interface ToastKeyAction {
    waiting: ToastKey;
    success: ToastKey;
}

export interface ToastKey {
    key?: ToastKeyEnum;
    props?: {
        poolName?: string;
        actionType?: CommitActionEnum;
        network?: number | undefined;
        receipt?: ContractReceipt | undefined;
    };
}

const Toast: ({ key, props }: ToastKey) => ReactNode[] = ({ key, props }: ToastKey) => {
    switch (key) {
        case ToastKeyEnum.Unlocking:
            return ['Unlocking USDC', 'This may take a few moments'];

        case ToastKeyEnum.Unlocked:
            return [
                'USDC Unlocked',
                <a
                    key={props?.receipt?.transactionHash}
                    href={`${networkConfig[props?.network ?? '0'].previewUrl}/${props?.receipt?.transactionHash}`}
                    className="text-tracer-400 underline"
                    target="_blank"
                    rel="noreferrer"
                >
                    View transaction
                </a>,
            ];

        case ToastKeyEnum.Commit:
            return [
                'Queueing' +
                    ` ${props?.poolName} ` +
                    `${props?.actionType === CommitActionEnum.mint ? 'Mint' : 'Burn'}`,
            ];

        case ToastKeyEnum.Committed:
            return [
                `${props?.poolName} ` + `${props?.actionType === CommitActionEnum.mint ? 'Mint' : 'Burn'} ` + 'Queued',
                <a
                    key={props?.receipt?.transactionHash}
                    href={`${networkConfig[props?.network ?? '0'].previewUrl}/${props?.receipt?.transactionHash}`}
                    className="text-tracer-400 underline"
                    target="_blank"
                    rel="noreferrer"
                >
                    View transaction
                </a>,
            ];

        default:
            return ['Pending Transaction'];
    }
};

export default Toast;
