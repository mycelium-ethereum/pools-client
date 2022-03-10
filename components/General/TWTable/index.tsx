import { Theme } from '@context/ThemeContext/themes';
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

type Size = 'default' | 'default-x' | 'sm' | 'sm-x';
type Align = 'bottom' | 'top';

const HEADER_CELL_SIZES: Record<Size, string> = {
    default: '1rem',
    ['default-x']: '0 1rem',
    sm: '1rem 0.5rem',
    ['sm-x']: '0 0.5rem',
};

export const TableHeaderCell = styled.th.attrs((props) => ({
    ...props,
    scope: 'col',
}))<{
    size?: Size;
    twAlign?: Align;
}>`
    font-size: 0.75rem; /* 12px */
    line-height: 1rem; /* 16px */
    text-align: left;
    font-weight: 500;
    color: ${({ theme }) => theme['text-secondary']};
    letter-spacing: 0.05em;
    text-transform: uppercase;

    vertical-align: ${(props) => props.twAlign};
    padding: ${({ size }) => HEADER_CELL_SIZES[size as Size]};
`;

TableHeaderCell.defaultProps = {
    size: 'default',
    twAlign: 'top',
};

export const TableRow = styled.tr<{ lined?: boolean }>`
    &:nth-child(even) {
        background: ${({ theme }) => theme.background};
    }
    &:nth-child(odd) {
        background: ${({ theme, lined }) => {
            if (!lined) {
                return theme.background;
            }
            switch (theme.theme) {
                case Theme.Dark:
                    return '#1F2A37';
                case Theme.Matrix:
                    return '#003b00';
                case Theme.Light:
                default:
                    return '#F9FAFB';
            }
        }};
    }
`;

const CELL_SIZES = {
    default: 'p-4',
    ['default-x']: '0 1rem',
    sm: 'px-2 py-1',
    ['sm-x']: '0 0.5rem',
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
