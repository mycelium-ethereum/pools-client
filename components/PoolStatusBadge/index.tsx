import React from 'react';
import styled from 'styled-components';
import { Theme } from '~/store/ThemeSlice/themes';

import { PoolStatus } from '~/types/pools';

export const PoolStatusBadgeContainer = styled.div`
    position: relative;
    width: fit-content;
    display: flex;
`;

const sharedBadgeStyles = `
    background: #3535dc;
    color: #fff;
    font-size: 13px;
    padding: 0.25rem 0.5rem;
    top: 0;
    line-height: 150%;
    border-radius: 3px;
    font-weight: 700;
`;

const DeprecatedPoolBadge = styled.div`
    ${sharedBadgeStyles}
    ${({ theme }) => {
        switch (theme.theme) {
            case Theme.Light:
                return `background: #FFF1E2; color: #FF5621; border-color: #FF931E`;
            default:
                return `background: ${theme.primary}; color: #fff; border-color: #fff`;
        }
    }};
`;

const LivePoolBadge = styled.div`
    ${sharedBadgeStyles}
    background: #1c64f2;
    color: #fff;
    border-color: #1c64f2;
`;

export const PoolStatusBadge = ({ status, text }: { status: PoolStatus; text?: string }): JSX.Element => {
    switch (status) {
        case PoolStatus.Deprecated:
            return <DeprecatedPoolBadge>{text || 'Deprecated'}</DeprecatedPoolBadge>;
        case PoolStatus.Live:
        default:
            return <LivePoolBadge>{text || 'Live'}</LivePoolBadge>;
    }
};
