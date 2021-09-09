import { Children } from '@libs/types/General';
import { classNames } from '@libs/utils/functions';
import React from 'react';
// @ts-ignore
import ReactSimpleTooltip from 'react-simple-tooltip';

const SELECTED = {
    tracer: 'z-10 bg-tracer-500 text-white border-none focus:border-none ',
    default: 'z-10 bg-tracer-800 text-white border-none focus:border-none ',
};

const SIZE = {
    default: 'px-4 py-2 text-sm font-medium ',
    lg: 'py-3 px-8 md:px-10 text-base font-normal',
    xl: 'py-3 px-16 md:px-18 text-base font-normal',
};

const DISABLED = 'cursor-not-allowed opacity-50';
const BORDERS = 'first:rounded-l-md last:rounded-r-md ';
const DEFAULT_BUTTON =
    'relative inline-flex items-center border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-solid ';

type Option = {
    key: number;
    text: string;
    color?: '';
    disabled?: {
        text: React.ReactNode;
    };
};

type Color = 'tracer' | 'default';
type ButtonSize = 'lg' | 'xl' | 'default';

export default (({ options, value, color = 'default', size = 'default', onClick }) => {
    const buttonClass = classNames(SIZE[size], DEFAULT_BUTTON);
    return (
        <span className="relative z-0 inline-flex shadow-sm">
            {options.map((option, index) =>
                option.disabled ? (
                    <DisabledTooltip text={option.disabled.text}>
                        <button
                            type="button"
                            data-tip
                            data-for={`${option.text}`}
                            onClick={() => onClick(option.key)}
                            className={classNames(
                                DISABLED,
                                buttonClass,
                                index === options.length - 1 ? 'rounded-r-md' : '',
                            )}
                        >
                            {option.text}
                        </button>
                    </DisabledTooltip>
                ) : (
                    <button
                        type="button"
                        onClick={() => onClick(option.key)}
                        className={classNames(value === option.key ? SELECTED[color] : '', buttonClass, BORDERS)}
                    >
                        {option.text}
                    </button>
                ),
            )}
        </span>
    );
}) as React.FC<{
    onClick: (key: number) => any;
    color?: Color;
    size?: ButtonSize;
    options: Option[];
    value: number; // key
}>;

const DisabledTooltip: React.FC<
    {
        text: React.ReactNode;
    } & Children
> = ({ text, children }) => {
    return (
        <>
            <ReactSimpleTooltip
                content={`${text}`}
                arrow={6}
                background="#f9fafb"
                border="rgba(209, 213, 219)"
                color="#000"
                customCss={{
                    whiteSpace: 'nowrap',
                }}
                fadeDuration={300}
                fadeEasing="linear"
                fixed={false}
                fontSize="12px"
                padding={8}
                radius={6}
                placement="top"
                zIndex={1}
            >
                {children}
            </ReactSimpleTooltip>
        </>
    );
};
