import { ReactNode } from 'react';
import { CommitActionEnum } from '@libs/constants';

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
    };
}

const Toast: ({ key, props }: ToastKey) => ReactNode[] = ({ key, props }: ToastKey) => {
    switch (key) {
        case ToastKeyEnum.Unlocking:
            return ['Unlocking USDC', 'This may take a few moments'];

        case ToastKeyEnum.Unlocked:
            return ['USDC Unlocked'];

        case ToastKeyEnum.Commit:
            return [
                'Queueing' +
                    ` ${props?.poolName} ` +
                    `${props?.actionType === CommitActionEnum.mint ? 'Mint' : 'Burn'}`,
            ];

        case ToastKeyEnum.Committed:
            return [
                `${props?.poolName} ` + `${props?.actionType === CommitActionEnum.mint ? 'Mint' : 'Burn'} ` + 'Queued',
            ];

        default:
            return ['Pending Transaction'];
    }
};

export default Toast;
