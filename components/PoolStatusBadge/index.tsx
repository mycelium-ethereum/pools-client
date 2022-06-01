import React from 'react';
import styled from 'styled-components';
import { Theme } from '~/store/ThemeSlice/themes';

import { PoolStatus } from '~/types/pools';

export const PoolStatusBadgeContainer = styled.div`
    position: relative;
    width: fit-content;
`;

const sharedBadgeStyles = `
    border-radius: 0.75rem;
    padding: 0.3rem 0.5rem;
    border-width: 0.063rem;
    font-weight: 700;
`;

const DeprecatedPoolBadge = styled.div`
    ${sharedBadgeStyles}
    ${({ theme }) => {
        switch (theme.theme) {
            case Theme.Light:
                return `background: #FFF1E2; color: #FF5621; border-color: #FF931E`;
            default:
                return `background: #FF5621; color: #fff; border-color: #fff`;
        }
    }};
`;

const LivePoolBadge = styled.div`
    ${sharedBadgeStyles}
    background: #1c64f2;
    color: #fff;
    border-color: #1c64f2;
`;

export const PoolStatusBadge = ({ status }: { status: PoolStatus }): JSX.Element => {
    switch (status) {
        case PoolStatus.Deprecated:
            return <DeprecatedPoolBadge>Deprecated</DeprecatedPoolBadge>;
        case PoolStatus.Live:
        default:
            return <LivePoolBadge>Live</LivePoolBadge>;
    }
};
