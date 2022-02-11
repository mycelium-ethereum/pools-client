import { classNames } from '@libs/utils/functions';
import React from 'react';

export const Table: React.FC<{ showDivider?: boolean; className?: string }> = ({
    showDivider = true,
    className,
    children,
}) => {
    return (
        <div className={classNames('flex flex-col overflow-hidden h-full', className ?? '')}>
            <div className="overflow-x-auto h-full">
                <div className="py-2 align-middle inline-block min-w-full">
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
    default: 'p-3',
    sm: 'px-3 py-0',
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
            'text-left text-sm font-semibold text-theme-text-secondary uppercase tracking-wider',
        )}
    >
        {children}
    </th>
);

type TableRowProps = JSX.IntrinsicElements['tr'] & {
    rowNumber: number;
};

export const TableRow: React.FC<TableRowProps> = ({ rowNumber, children }) => {
    return (
        <tr
            className={
                rowNumber % 2 === 0
                    ? 'bg-theme-background'
                    : 'bg-cool-gray-50 dark:bg-cool-gray-800 matrix:bg-theme-button-bg'
            }
        >
            {children}
        </tr>
    );
};

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
