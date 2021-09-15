import React from 'react';
import Icon, { CloseOutlined, InfoCircleFilled } from '@ant-design/icons';
import styled from 'styled-components';
// @ts-ignore
import TracerLoading from 'public/img/logos/tracer/tracer_loading.svg';
// @ts-ignore
import Error from 'public/img/general/error.svg';
// @ts-ignore
import Success from 'public/img/general/success.svg';
// @ts-ignore
import Warning from 'public/img/general/warning.svg';
import { PENDING_COMMIT } from '@libs/constants';
import { PendingCommitInfo } from '@libs/types/General';
import BigNumber from 'bignumber.js';
import { classNames } from '@libs/utils/functions';

type PlacementType = 'bottom-left' | 'bottom-center' | 'bottom-right' | 'top-left' | 'top-center' | 'top-right';
type AppearanceTypes = 'success' | 'error' | 'warning' | 'info' | 'loading';
type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

/* eslint-disable */

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
        icon: <Icon component={Success} />,
        text: '#05CB3A',
        fg: '#36B37E',
        bg: '#E3FCEF',
    },
    error: {
        icon: <Icon component={Error} />,
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
        icon: <Icon component={Warning} />,
        text: '#FF8B00',
        fg: '#FFAB00',
        bg: '#FFFAE6',
    },
    info: {
        icon: <InfoCircleFilled />,
        text: '#505F79',
        fg: '#2684FF',
        bg: '#00156C',
    },
    loading: {
        icon: <Icon style={{color: '#000'}} component={TracerLoading} />,
        text: '#111928',
        fg: '#2684FF',
        bg: '#00156C',
    },
};


const IconWrap = styled.span`
    display: inline-flex;
    justify-content: center;
    margin-right: 0.5rem;
    vertical-align: 0.125rem;
    color: transparent;
    svg {
        width: 26px;
        height: 26px;
    }
`;
const Close = styled(CloseOutlined)`
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    height: 1rem;
    width: 1rem;
    color: #111928;
    cursor: pointer;
`;

const Content = styled((props: any) => (
    <div className={classNames(
            `react-toast-notifications__toast__content`,
            props.className,
        )}
        {...props}>
        {props.children}
    </div>
))`
    flex-grow: 1;
    font-size: var(--font-size-medium);
    line-height: 1.4;
    width: 100%;
    margin-top: 0.5rem;

    word-break: break-word;
    font-size: 1rem;
    color: #3DA8F5;
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
    let children_ = React.Children.toArray(children);
    return (
        <ToastWrapper
            style={{
                transition: `transform ${transitionDuration}ms cubic-bezier(0.2, 0, 0, 1), opacity ${transitionDuration}ms`,
                cursor: 'default',
                ...hashieStates(placement)[transitionState],
            }}
        >
            <div className="text-cool-gray-900 text-xl">
                <IconWrap>{appearance.icon}</IconWrap>
                {/* title */}
                <span>
                    {children_[0]}
                </span>
                <Close onClick={onDismiss}/>
            </div>
            <Content>{children_[1]}</Content>
        </ToastWrapper>
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
            onClick: () => undefined // on button click
        }
    }
};

const ToastWrapper = styled.div`
    position: relative;
    overflow: hidden;
    margin-bottom: 0.5rem;
    margin-right: 0.5rem;
    border-radius: 0.375rem;
    max-width: 24rem;
    width: 24rem;
    display: flex;
    flex-direction: column;

    background: #FFFFFF;
    box-shadow: 4px 4px 50px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1.5rem;

    &:hover ${Close} {
        opacity: 1;
    }
`

export const Notification = ({ children, ...props }: any) => <Hashie {...props}>{children}</Hashie>;

