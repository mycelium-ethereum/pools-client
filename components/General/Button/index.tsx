import React from 'react';
import { classNames } from '@libs/utils/functions';

const SIZE: Record<ButtonSize, string> = {
    xs: 'px-2 py-1 text-xs ',
    sm: 'px-4 py-3 text-sm ',
    default: 'px-4 py-3 text-base ',
    lg: 'px-6 py-4 text-base ',
    none: 'p-0 text-base ',
};

const VARIANT: Record<ButtonVariant, string> = {
    default: 'bg-transparent opacity-80 hover:opacity-100',
    primary:
        'bg-tracer-500 matrix:bg-theme-primary matrix:text-theme-background dark:bg-tracer-500 text-white w-full hover:bg-opacity-70 matrix:hover:bg-opacity-70 dark:disabled:hover:bg-tracer-500 matrix:disabled:hover:bg-theme-primary disabled:hover:bg-tracer-500 disabled:opacity-50 focus:ring focus:ring-tracer-300',
    'primary-light':
        'bg-tracer-100 dark:bg-tracer-800 matrix:bg-transparent border border-tracer-500 matrix:border-theme-border text-theme-text w-full hover:bg-opacity-50 dark:hover:bg-opacity-50 matrix:hover:opacity-50 disabled:opacity-50',
    transparent:
        'bg-white bg-opacity-20 border border-white text-white w-full disabled:bg-opacity-50 focus:border-solid',
    unselected:
        'bg-tracer-100 dark:bg-theme-button-bg dark:hover:bg-theme-button-bg-hover matrix:bg-theme-button-bg border-none text-white w-full disabled:bg-opacity-50 focus:border-none',
};
type ButtonSize = 'xs' | 'sm' | 'lg' | 'default' | 'none';

type ButtonVariant = 'primary' | 'primary-light' | 'transparent' | 'default' | 'unselected';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: ButtonSize;
    variant?: ButtonVariant;
    ref?: React.Ref<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    size = 'default',
    variant = 'default',
    ...rest
}) => {
    return (
        <button
            className={classNames(
                VARIANT[variant],
                SIZE[size],
                className,
                'rounded whitespace-nowrap disabled:cursor-not-allowed focus:outline-none',
            )}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
