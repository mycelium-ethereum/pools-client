import React from 'react';
import { classNames } from '@libs/utils/functions';

const SIZE: Record<ButtonSize, string> = {
    xs: 'px-2 py-1 text-xs ',
    sm: 'px-4 py-2 text-sm ',
    default: 'px-4 py-3 text-base ',
    lg: 'px-6 py-4 text-base ',
    none: 'p-0 text-base ',
};

const VARIANT: Record<ButtonVariant, string> = {
    default: 'bg-transparent opacity-80 hover:opacity-100',
    primary:
        'bg-tracer-800 text-white w-full hover:bg-tracer-900 disabled:hover:bg-tracer-800 disabled:opacity-50 focus:ring focus:ring-tracer-300',
    'primary-light':
        'bg-tracer-100 border border-tracer-500 text-cool-gray-700 w-full hover:bg-opacity-50 disabled:bg-tracer-100 disabled:opacity-50',
    transparent:
        'bg-white bg-opacity-20 border border-white text-white w-full disabled:bg-opacity-50 focus:border-solid',
};
type ButtonSize = 'xs' | 'sm' | 'lg' | 'default' | 'none';

type ButtonVariant = 'primary' | 'primary-light' | 'transparent' | 'default';

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
                'rounded disabled:cursor-not-allowed focus:outline-none',
            )}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
