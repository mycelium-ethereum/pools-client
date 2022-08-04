import React from 'react';
import styled from 'styled-components';
import { Theme } from '~/store/ThemeSlice/themes';
import { classNames } from '~/utils/helpers';

const TableWrapper = styled.div<{
    fullHeight: boolean;
}>`
    display: flex;
    height: ${({ fullHeight }) => (fullHeight ? '100%' : 'auto')};
    flex-direction: column;
    overflow: hidden;
`;

export const Table: React.FC<{ showDivider?: boolean; fullHeight?: boolean; className?: string }> = ({
    showDivider = false,
    fullHeight = true,
    className,
    children,
}) => {
    return (
        <TableWrapper className={className} fullHeight={fullHeight}>
            <div className="h-full overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className={`${showDivider ? 'border-b border-theme-border sm:rounded-lg' : ''}`}>
                        <table className={`min-w-full ${showDivider ? 'divide-y divide-theme-border' : ''}`}>
                            {children}
                        </table>
                    </div>
                </div>
            </div>
        </TableWrapper>
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
    transform: translate3d(0, 0, 0) perspective(999px);

    vertical-align: ${(props) => props.twAlign};
    background: ${({ theme }) => theme.background.secondary};

    padding: ${({ size }) => HEADER_CELL_SIZES[size as Size]};
`;

TableHeaderCell.defaultProps = {
    size: 'default',
    twAlign: 'top',
};

export const ImportedIndicator = styled.div<{ isImported?: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: max-content;
    margin-bottom: 6px;
    font-family: 'Source Sans Pro', sans-serif;
    font-weight: 700;
    border-radius: 3px;
    padding: 1px 5px;
    background-color: #ffc700;
    color: black;
    font-size: 10px;
    &:before {
        content: 'IMPORTED';
    }
`;

export const TableRow = styled.tr<{ lined?: boolean; isImported?: boolean }>`
    background: ${({ theme, isImported }) => {
        switch (true) {
            case theme.theme === Theme.Dark && isImported:
                return '#111928 !important';
            case theme.theme === Theme.Light && isImported:
                return '#ffffff !important';
            default:
                return `inherit`;
        }
    }};

    border-bottom: 1px solid ${({ theme }) => theme.border.primary};

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

const CELL_SIZES: Record<Size, string> = {
    default: '12px 1rem',
    ['default-x']: '0 1rem',
    sm: '0.25rem 0.5rem',
    ['sm-x']: '0 0.5rem',
};

export const TableRowCell = styled.td<{ size?: Size }>`
    white-space: nowrap;
    color: ${({ theme }) => theme.fontColor.primary};
    ${({ size }) => size && `padding: ${CELL_SIZES[size]};`}
    font-size: 0.875rem;
`;
TableRowCell.defaultProps = {
    size: 'default',
};

/* Cheat to span all cols https://stackoverflow.com/questions/398734/colspan-all-columns */
const MAX_COLS = 100;

export const FullSpanCell: React.FC<JSX.IntrinsicElements['td']> = ({ children, className, ...props }) => (
    <td {...props} className={classNames(className ?? '')} colSpan={MAX_COLS}>
        {children}
    </td>
);
