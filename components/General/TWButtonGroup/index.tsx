import { classNames } from '@libs/utils/functions';
import React from 'react';
import TooltipSelector, { TooltipKeys } from '@components/Tooltips/TooltipSelector';

// the difference here is the bg on unselected
const SELECTED = {
    tracer: 'z-10 bg-tracer-500 hover:bg-tracer-500 matrix:bg-theme-primary matrix:text-black text-white border-tracer-500',
    default:
        'z-10 bg-tracer-500 hover:bg-tracer-500 matrix:bg-theme-primary matrix:text-black text-white border-tracer-500',
};

const UNSELECTED = {
    tracer: 'bg-tracer-50 hover:tracer-100 dark:bg-theme-button-bg dark:hover:bg-theme-button-bg-hover matrix:bg-theme-button-bg matrix:hover:bg-theme-button-bg-hover text-theme-text',
    default: 'bg-theme-button-bg hover:bg-theme-button-bg-hover text-theme-text',
};

const BORDER_COLORS = {
    default: '',
    tracer: 'border border-theme-border focus:border-solid',
};

const BORDERS = 'first:rounded-l-md last:rounded-r-md';

const SIZE = {
    default: 'px-4 py-2 text-sm font-medium ',
    lg: 'py-3 px-8 md:px-10 text-base font-normal',
    xl: 'py-3 px-16 md:px-18 text-base font-normal',
};

const DISABLED = 'cursor-not-allowed opacity-50';
const DEFAULT_BUTTON = 'relative inline-flex items-center transition-all no-focus-outline';

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

export default (({ options, value, color = 'default', size = 'default', borderColor = 'default', onClick }) => {
    const buttonClass = classNames(SIZE[size], DEFAULT_BUTTON);
    return (
        <span className="relative z-0 inline-flex shadow-sm">
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
                            BORDERS,
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
    options: Option[];
    value: number; // key
}>;
