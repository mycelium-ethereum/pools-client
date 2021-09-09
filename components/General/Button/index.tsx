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
        'bg-tracer-600 text-white w-full text-high-emphesis hover:bg-tracer-900 disabled:bg-opacity-50 focus:ring focus:ring-tracer-300',
    'primary-light':
        'bg-tracer-100 border border-tracer-500 text-cool-gray-700 w-full text-high-emphesis hover:bg-tracer-900 disabled:bg-tracer-100 disabled:bg-opacity-80 focus:ring focus:ring-tracer-300',
    transparent:
        'bg-white bg-opacity-20 border border-white text-white w-fulltext-high-emphesis disabled:bg-opacity-50 focus:ring focus:ring-tracer-300',
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
                // 'rounded focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed font-medium',
            )}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;

// export const Button = styled.button<{ height?: 'medium' | 'small' | 'extra-small' }>`
//     width: 160px;
//     border: 1px solid var(--color-primary);
//     border-radius: 10px;
//     transition: 0.3s;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     text-align: center;
//     color: var(--color-primary);
//     height: var(--height-${(props) => props.height as string}-button);
//     cursor: pointer;

//     &:hover {
//         background: var(--color-primary);
//         color: var(--color-text);
//     }

//     &:focus,
//     &:active {
//         outline: none;
//         border: 1px solid var(--color-primary);
//         border-radius: 10px;
//     }

//     &.primary {
//         background: var(--color-primary);
//         color: #fff;
//     }

//     &.primary:hover {
//         background: var(--color-background);
//         color: var(--color-primary);
//     }

//     &:disabled,
//     &[disabled],
//     .button-disabled {
//         opacity: 0.5;
//         cursor: not-allowed;

//         &:hover {
//             background: none;
//             color: var(--color-text);

//             &.primary {
//                 background: var(--color-primary);
//                 color: #fff;
//             }
//         }
//     }
// `;
