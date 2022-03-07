import { classNames } from '@libs/utils/functions';
import { Children } from 'libs/types/General';
import React from 'react';
import styled from 'styled-components';

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
    font-size: 14px;
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

    @media (min-width: 640px) {
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
                font-size: 12px;
                line-height: 18px;
                font-weight: 400;
            `;
        }
    }}

    @media (min-width: 640px) {
        font-size: 15px;

        ${({ showSectionDetails }) => {
            if (showSectionDetails) {
                return `
                    max-width: 100%;
                    font-size: 14px;
                `;
            }
        }}
    }
`;

const Content = styled.span`
    width: 100%;
    text-align: right;
    padding-left: 0.25rem;
    font-size: 12px;
    white-space: nowrap;

    @media (min-width: 640px) {
        font-size: 14px;
    }
`;

export * from './Dropdown';
export * from './Logo';
export * from './Button';
// export * from './Input';
// export * from './Notification';
// export * from './';
