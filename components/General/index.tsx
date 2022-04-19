import React from 'react';
import styled from 'styled-components';
import { device, fontSize } from '~/store/ThemeSlice/themes';
import { Children } from '~/types/general';
import { classNames } from '~/utils/helpers';

type SProps = {
    className?: string;
    label: string;
    showSectionDetails?: boolean;
} & Children;

export const Section: React.FC<SProps> = styled(
    ({ className, children, label, showSectionDetails = false }: SProps) => {
        return (
            <div className={classNames(className ?? '')}>
                <Label showSectionDetails={showSectionDetails}>{label}</Label>
                <Content>{children}</Content>
            </div>
        );
    },
)`
    display: grid;
    grid-template-columns: 3fr 1fr;
    width: 100%;
    font-size: ${fontSize.xs};
    line-height: 18px;
    box-sizing: border-box;
    color: ${({ theme }) => theme['text-secondary']};
    margin-bottom: 3px;
    &:not(.header) {
        margin-bottom: 1px;
    }

    &:last-child {
        padding-bottom: 0;
    }

    &.header {
        padding-bottom: 3px;
    }

    @media ${device.sm} {
        margin-bottom: 3px;
    }
`;

const Label = styled.div<{ showSectionDetails: boolean }>`
    text-align: left;
    font-weight: 600;

    ${({ showSectionDetails }) => {
        if (showSectionDetails) {
            return `
                opacity: 0.5;
                margin-left: 0.75rem;
                margin-bottom: 0;
                max-width: 140px;
                font-size: ${fontSize.xxs};
                line-height: 18px;
                font-weight: 400;
            `;
        }
    }}

    @media ${device.sm} {
        font-size: ${fontSize.sm};

        ${({ showSectionDetails }) => {
            if (showSectionDetails) {
                return `
                    max-width: 100%;
                    font-size: ${fontSize.xs};
                `;
            }
        }}
    }
`;

const Content = styled.span`
    width: 100%;
    text-align: right;
    padding-left: 0.25rem;
    font-size: ${fontSize.xxs};
    white-space: nowrap;

    @media ${device.sm} {
        font-size: ${fontSize.xs};
    }
`;

export * from './Dropdown';
export * from './Logo';
export * from './Button';
// export * from './Input';
// export * from './Notification';
// export * from './';
