import React from 'react';
import Icon, { InfoCircleFilled } from '@ant-design/icons';
import { ToastOptions } from 'react-toastify';
import styled from 'styled-components';
import { Theme } from '@store/ThemeSlice/themes';
import Success from '@public/img/notifications/success.svg';
import Warning from '@public/img/notifications/warning.svg';
import Error from '@public/img/notifications/error.svg';
import Loading from '@public/img/loading-large.svg';

const StyledIcon = styled(Icon)`
    font-size: 1.5rem; /* 24px */

    &.loading {
        color: ${({ theme: { theme } }) => {
            switch (theme) {
                case Theme.Light:
                    return '#0d29ff';
                default:
                    return '#fff';
            }
        }};
    }
`;

const StyledInfo = styled(InfoCircleFilled)`
    font-size: 1.5rem; /* 24px */
`;

export const NotificationIcon = ({ type }: { type: ToastOptions['type'] }): JSX.Element => {
    switch (type) {
        case 'success':
            return <StyledIcon component={Success} />;
        case 'error':
            return <StyledIcon component={Error} />;
        case 'warning':
            return <StyledIcon component={Warning} />;
        case 'info':
            return <StyledInfo />;
        default:
            return <StyledIcon className="loading" component={Loading} />;
    }
};
