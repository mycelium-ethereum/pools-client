import {Theme} from '@context/ThemeContext/themes';
import { classNames } from '@libs/utils/functions';
import React from 'react';
import styled from 'styled-components';

export const Table: React.FC<{ showDivider?: boolean; className?: string }> = ({
    showDivider = true,
    className,
    children,
}) => {
    return (
        <div className={classNames('flex flex-col overflow-hidden h-full', className ?? '')}>
            <div className="overflow-x-auto h-full">
                <div className="align-middle inline-block min-w-full">
                    <div className={`${showDivider ? 'border-b border-theme-border sm:rounded-lg' : ''}`}>
                        <table className={`min-w-full ${showDivider ? 'divide-y divide-theme-border' : ''}`}>
                            {children}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TableHeader: React.FC<JSX.IntrinsicElements['thead']> = ({ children, className }) => {
    return (
        <thead
            className={classNames('bg-cool-gray-100 dark:bg-cool-gray-700 matrix:bg-theme-button-bg', className ?? '')}
        >
            {children}
        </thead>
    );
};

const HEADER_CELL_SIZES = {
    default: 'p-4',
    sm: 'px-2 py-4',
};

type Size = 'default' | 'sm';

export const TableHeaderCell: React.FC<JSX.IntrinsicElements['th'] & { size?: Size; twAlign?: 'bottom' }> = ({
    children,
    className,
    twAlign = 'top',
    size = 'default',
    ...props
}) => (
    <th
        {...props}
        scope="col"
        className={classNames(
            className ?? '',
            `align-${twAlign}`,
            HEADER_CELL_SIZES[size],
            'text-left text-xs font-medium text-theme-text-secondary uppercase tracking-wider',
        )}
    >
        {children}
    </th>
);

export const TableRow = styled.tr<{ lined?: boolean }>`
    &:nth-child(even) {
        background: ${({ theme }) => theme.background};
    }
    &:nth-child(odd) {
        background: ${({ theme, lined }) => {
            if (!lined) return theme.background
            switch (theme.theme) {
                case Theme.Dark:
                    return '#1F2A37';
                case Theme.Matrix:
                    return '#003b00'
                case Theme.Light:
                default:
                    return '#F9FAFB'
            }

        }};
    }
`

const CELL_SIZES = {
    default: 'p-4',
    sm: 'px-2 py-1',
};

export const TableRowCell: React.FC<JSX.IntrinsicElements['td'] & { size?: Size }> = ({
    children,
    className,
    size = 'default',
    ...props
}) => (
    <td
        {...props}
        className={classNames(className ?? '', CELL_SIZES[size], 'whitespace-nowrap text-sm text-theme-text')}
    >
        {children}
    </td>
);
