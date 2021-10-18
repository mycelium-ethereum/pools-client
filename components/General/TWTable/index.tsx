import { classNames } from '@libs/utils/functions';
import React from 'react';

export const Table: React.FC<{ className?: string }> = ({ className, children }) => {
    return (
        <div className={classNames('flex flex-col overflow-hidden h-full', className ?? '')}>
            <div className="overflow-x-auto h-full">
                <div className="py-2 align-middle inline-block min-w-full">
                    <div className="border-b border-theme-border sm:rounded-lg">
                        <table className="min-w-full divide-y divide-theme-border">{children}</table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TableHeader: React.FC<{ className?: string }> = ({ children, className }) => {
    return (
        <thead
            className={classNames('bg-cool-gray-100 dark:bg-cool-gray-700 matrix:bg-theme-button-bg', className ?? '')}
        >
            <tr>{children}</tr>
        </thead>
    );
};

export const TableHeaderCell: React.FC<{ className?: string; align?: 'bottom' }> = ({
    children,
    className,
    align = 'top',
}) => (
    <th
        scope="col"
        className={classNames(
            className ?? '',
            `align-${align}`,
            'px-4 pt-4 pb-2 text-left text-xs font-medium text-theme-text-secondary uppercase tracking-wider',
        )}
    >
        {children}
    </th>
);

interface TableRowProps {
    rowNumber: number;
}

export const TableRow: React.FC<TableRowProps> = ({ rowNumber, children }) => {
    return (
        <tbody>
            <tr
                className={
                    rowNumber % 2 === 0
                        ? 'bg-theme-background'
                        : 'bg-cool-gray-50 dark:bg-cool-gray-800 matrix:bg-theme-button-bg'
                }
            >
                {children}
            </tr>
        </tbody>
    );
};

export const TableRowCell: React.FC<{ className?: string }> = ({ children, className }) => (
    <td className={classNames(className ?? '', 'px-4 py-4 whitespace-nowrap text-sm text-theme-text')}>{children}</td>
);
