import { classNames } from '@libs/utils/functions';
import React from 'react';
import TooltipSelector, { TooltipKeys } from '@components/Tooltips/TooltipSelector';
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
        optionKey: TooltipKeys;
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
                    <TooltipSelector key={`twbg-${option.key}`} tooltip={{ key: option.disabled.optionKey }}>
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
                    </TooltipSelector>
                ) : (
                    <button
                        key={`twbg-${option.key}`}
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
