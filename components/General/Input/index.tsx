import { Children } from '@libs/types/General';
import { classNames } from '@libs/utils/functions';
import React from 'react';

export const InputContainer: React.FC<{
    className?: string;
    error?: boolean;
    warning?: boolean;
}> = ({ error, warning, className = '', children }) => (
    <div
        className={classNames(
            'relative py-3 px-3 border rounded bg-theme-button-bg',
            warning
                ? 'border-yellow-500 text-yellow-600 focus-within:ring-yellow-600'
                : error
                ? 'border-red-300 text-red-500 focus-within:ring-red-500'
                : 'border-theme-border text-theme-text opacity-80 focus-within:ring-theme-primary',
            'focus-within:ring-2 focus-within:ring-opacity-50 ',
            className,
        )}
    >
        {children}
    </div>
);

export const InnerInputText = (({ className, children }) => (
    <div className={`${className ?? ''} absolute flex m-auto top-0 bottom-0 right-5 h-1/2 text-theme-primary`}>
        {children}
    </div>
)) as React.FC<
    {
        className?: string;
    } & Children
>;
