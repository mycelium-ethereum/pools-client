import { classNames } from '@libs/utils/functions';
import React from 'react';
import TooltipSelector, { TooltipKeys } from '@components/Tooltips/TooltipSelector';

// the difference here is the bg on unselected
const SELECTED = {
    tracer: 'z-10 bg-tracer-500 hover:bg-tracer-500 matrix:bg-theme-primary matrix:text-black text-white border-tracer-500 matrix:border-theme-primary',
    default:
        'z-10 bg-tracer-500 hover:bg-tracer-500 matrix:bg-theme-primary matrix:text-black text-white border-tracer-500 matrix:border-theme-primary',
    greyed: 'z-10 bg-theme-background hover:bg-theme-background matrix:bg-theme-primary text-cool-gray-600 dark:text-white matrix:text-black matrix:border-theme-primary rounded-full focus:border-solid',
};

const UNSELECTED = {
    tracer: 'bg-tracer-50 hover:tracer-100 dark:bg-theme-button-bg dark:hover:bg-theme-button-bg-hover matrix:bg-theme-button-bg matrix:hover:bg-theme-button-bg-hover text-theme-text',
    default: 'bg-theme-button-bg hover:bg-theme-button-bg-hover text-theme-text',
    greyed: 'bg-cool-gray-100 dark:bg-cool-gray-600 matrix:bg-theme-button-bg text-cool-gray-400 dark:text-cool-gray-800 focus:border-transparent',
};

const BORDER_COLORS = {
    default: '',
    greyed: 'border border-cool-gray-100 dark:border-cool-gray-600 matrix:border-theme-button-bg',
    tracer: 'border border-theme-border focus:border-solid',
};

const BORDERS = {
    rounded: 'first:rounded-l-full last:rounded-r-full',
    default: 'first:rounded-l-md last:rounded-r-md',
};

const SIZE = {
    default: 'px-4 py-2.5 text-sm font-medium ',
    lg: 'py-3 px-8 md:px-10 text-base font-normal',
    xl: 'py-3 px-16 md:px-18 text-base font-normal',
};

const OVERALL_BACKGROUND = {
    default: '',
    tracer: '',
    greyed: 'bg-cool-gray-100 dark:bg-cool-gray-600 matrix:bg-theme-button-bg rounded-full',
};

const DISABLED = 'cursor-not-allowed opacity-50';
const DEFAULT_BUTTON = 'relative inline-flex items-center transition-all no-focus-outline';
const FULL_WIDTH_BUTTONS = 'w-full justify-center';

type Option = {
    key: number;
    text: string | React.ReactNode;
    color?: '';
    disabled?: {
        optionKey: TooltipKeys;
    };
};

type Color = 'tracer' | 'greyed' | 'default';
type Borders = 'rounded' | 'default';
type ButtonSize = 'lg' | 'xl' | 'default';

export default (({
    options,
    value,
    color = 'default',
    size = 'default',
    borderColor = 'default',
    border = 'default',
    onClick,
    fullWidthButtons = false,
}) => {
    const buttonClass = classNames(SIZE[size], DEFAULT_BUTTON);
    return (
        <span className={classNames('relative z-0 inline-flex w-full', OVERALL_BACKGROUND[color])}>
            {options.map((option, index) =>
                option.disabled ? (
                    <TooltipSelector key={`twbg-${option.key}`} tooltip={{ key: option.disabled.optionKey }}>
                        <button
                            type="button"
                            data-tip
                            disabled={true}
                            data-for={`${option.text}`}
                            onClick={() => onClick(option.key)}
                            className={classNames(
                                DISABLED,
                                buttonClass,
                                BORDER_COLORS[borderColor],
                                index === options.length - 1 ? 'rounded-r-md' : '',
                                fullWidthButtons ? FULL_WIDTH_BUTTONS : '',
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
                        className={classNames(
                            value === option.key ? SELECTED[color] : UNSELECTED[color],
                            buttonClass,
                            BORDER_COLORS[borderColor],
                            BORDERS[border],
                            fullWidthButtons ? FULL_WIDTH_BUTTONS : '',
                        )}
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
    borderColor?: Color;
    border?: Borders;
    options: Option[];
    value: number; // key
    fullWidthButtons?: boolean;
}>;
