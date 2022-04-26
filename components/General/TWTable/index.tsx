import React from 'react';
import styled from 'styled-components';
import { Theme } from '~/store/ThemeSlice/themes';
import { classNames } from '~/utils/helpers';

export const Table: React.FC<{ showDivider?: boolean; className?: string }> = ({
    showDivider = false,
    className,
    children,
}) => {
    return (
        <div className={classNames('flex h-full flex-col overflow-hidden', className ?? '')}>
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
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
            className={classNames('bg-cool-gray-100 matrix:bg-theme-button-bg dark:bg-cool-gray-700', className ?? '')}
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
    color: ${({ theme }) => theme.fontColor.secondary};
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
        background: ${({ theme }) => theme.background.primary};
    }
    &:nth-child(odd) {
        background: ${({ theme, lined }) => {
            if (!lined) {
                return theme.background.primary;
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

/* Cheat to span all cols https://stackoverflow.com/questions/398734/colspan-all-columns */
const MAX_COLS = 100;

export const FullSpanCell: React.FC<JSX.IntrinsicElements['td']> = ({ children, className, ...props }) => (
    <td {...props} className={classNames(className ?? '')} colSpan={MAX_COLS}>
        <div className="my-20 text-center">{children}</div>
    </td>
);
