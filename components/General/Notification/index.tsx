import React from 'react';
import Icon, { InfoCircleFilled } from '@ant-design/icons';
import styled from 'styled-components';
import { PENDING_COMMIT } from '@libs/constants';
import { PendingCommitInfo } from '@libs/types/General';
import BigNumber from 'bignumber.js';
import { classNames } from '@libs/utils/functions';

import Close from '@public/img/general/close.svg';
import Success from '@public/img/notifications/success.svg';
import Warning from '@public/img/notifications/warning.svg';
import Error from '@public/img/notifications/error.svg';
import Loading from '@public/img/loading-large.svg';

type PlacementType = 'bottom-left' | 'bottom-center' | 'bottom-right' | 'top-left' | 'top-center' | 'top-right';
type AppearanceTypes = 'success' | 'error' | 'warning' | 'info' | 'loading';
type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

const icon = 'text-2xl leading-none text-transparent align-baseline';
const appearances: Record<
    string,
    {
        icon: any;
        text: string;
        fg: string;
        bg: string;
    }
> = {
    success: {
        icon: <Icon className={icon} component={Success} />,
        text: '#05CB3A',
        fg: '#36B37E',
        bg: '#E3FCEF',
    },
    error: {
        icon: <Icon className={icon} component={Error} />,
        text: '#F15025',
        fg: '#FF5630',
        bg: '#FFEBE6',
    },
    pendingCommit: {
        icon: <></>, // pending commit notification will have no icon
        text: '#F15025',
        fg: '#FF5630',
        bg: '#FFEBE6',
    },
    warning: {
        icon: <Icon className={icon} component={Warning} />,
        text: '#FF8B00',
        fg: '#FFAB00',
        bg: '#FFFAE6',
    },
    info: {
        icon: <InfoCircleFilled className={icon} />,
        text: '#505F79',
        fg: '#2684FF',
        bg: '#00156C',
    },
    loading: {
        icon: <Icon className={`${icon} text-tracer-700 dark:text-white`} component={Loading} />,
        text: '#111928',
        fg: '#2684FF',
        bg: '#00156C',
    },
};

const getTranslate: (placement: PlacementType) => string = (placement: PlacementType) => {
    const pos: string[] = placement.split('-');
    const relevantPlacement = pos[1] === 'center' ? pos[0] : pos[1];
    const translateMap: Record<string, string> = {
        right: 'translate3d(120%, 0, 0)',
        left: 'translate3d(-120%, 0, 0)',
        bottom: 'translate3d(0, 120%, 0)',
        top: 'translate3d(0, -120%, 0)',
    };

    return translateMap[relevantPlacement];
};

const hashieStates = (placement: PlacementType) => ({
    entering: { transform: getTranslate(placement) },
    entered: { transform: 'translate3d(0, 0, 0)' },
    exiting: { transform: 'scale(0.66)', opacity: 0 },
    exited: { transform: 'scale(0.66)', opacity: 0 },
});

const Content = styled((props: any) => (
    <div className={classNames(`react-toast-notifications__toast__content`, props.className)} {...props}>
        {props.children}
    </div>
))`
    flex-grow: 1;
    line-height: 1.4;
    width: 100%;
    margin-top: 0.5rem;
    word-break: break-word;
    font-size: 1rem;
`;

type HProps = {
    appearance: AppearanceTypes;
    autoDismiss: boolean; // may be inherited from ToastProvider
    autoDismissTimeout: number; // inherited from ToastProvider
    children: Node;
    isRunning: boolean;
    onDismiss: (args: any) => any; // its a func
    placement: PlacementType; // this is default but its what we want anyway
    transitionDuration: number; // inherited from ToastProvider
    transitionState: TransitionState; // inherited from ToastProvider
    type?: typeof PENDING_COMMIT;
    commitInfo?: PendingCommitInfo;
};
const Hashie: React.FC<HProps | any> = ({
    transitionDuration,
    transitionState,
    onDismiss,
    appearance: appearance_,
    placement,
    // autoDismiss,
    // autoDismissTimeout,
    // type,
    // commitInfo,
    // isRunning,
    children,
}: HProps) => {
    const appearance = appearances[appearance_] ?? appearances['info']; //default info
    const children_ = React.Children.toArray(children);
    return (
        <div
            className={classNames(
                'relative flex  flex-col overflow-hidden rounded-3xl mb-2 mr-2 p-6 w-[25rem] bg-theme-background shadow  ',
            )}
            style={{
                transition: `transform ${transitionDuration}ms cubic-bezier(0.2, 0, 0, 1), opacity ${transitionDuration}ms`,
                cursor: 'default',
                ...hashieStates(placement)[transitionState],
            }}
        >
            <Close className="absolute h-3 w-3 top-8 right-6 cursor-pointer" onClick={onDismiss} />
            <div className="text-theme-text text-base font-bold mr-5 mb-2">
                <span className="mr-2">{appearance.icon}</span>
                {/* title */}
                <span>{children_[0]}</span>
            </div>
            <Content>{children_[1]}</Content>
        </div>
    );
};

Hashie.defaultProps = {
    transitionDuration: 220,
    autoDismiss: false,
    appearance: 'info',
    placement: 'top-right',
    autoDismissTimeout: 5000,
    commitInfo: {
        tokenName: '',
        amount: new BigNumber(0),
        value: new BigNumber(0),
        updateInterval: new BigNumber(0),
        frontRunningInterval: new BigNumber(0),
        lastUpdate: new BigNumber(0),
        action: {
            text: '', // button text
            onClick: () => undefined, // on button click
        },
    },
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const Notification = ({ children, ...props }: any) => <Hashie {...props}>{children}</Hashie>;
