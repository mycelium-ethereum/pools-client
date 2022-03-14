import { classNames } from '@libs/utils/functions';
import React from 'react';
import TooltipSelector, { TooltipKeys } from '@components/Tooltips/TooltipSelector';
import styled from 'styled-components';

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
    sm: 'px-5 py-2 text-sm font-normal',
    default: 'px-8 py-3 text-sm font-medium',
    lg: 'py-3 px-8 md:px-10 text-base font-normal',
    xl: 'py-3 px-10 sm:px-16 md:px-18 text-base font-normal',
};

const OVERALL_BACKGROUND = {
    default: '',
    tracer: '',
    greyed: 'bg-cool-gray-100 dark:bg-cool-gray-600 matrix:bg-theme-button-bg rounded-full',
};

const DISABLED = 'cursor-not-allowed bg-cool-gray-100 dark:bg-theme-background opacity-60';
const DEFAULT_BUTTON = 'relative inline-flex items-center justify-center transition-all no-focus-outline';
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
type ButtonSize = 'sm' | 'lg' | 'xl' | 'default';

export default (({
    options,
    value,
    color = 'default',
    size = 'default',
    borderColor = 'default',
    border = 'default',
    onClick,
    fullWidthButtons = false,
    className = '',
}) => {
    const buttonClass = classNames(SIZE[size], DEFAULT_BUTTON);

    return (
        <Container className={classNames(className, OVERALL_BACKGROUND[color])}>
            {options.map((option, index) =>
                option.disabled ? (
                    <TooltipSelector key={`twbg-${option.key}`} tooltip={{ key: option.disabled.optionKey }}>
                        <button
                            type="button"
                            data-tip=""
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
                    <React.Fragment key={`twbg-${option.key}`}>
                        {option.text === 'Flip' && <NewCallOut>NEW</NewCallOut>}
                        <button
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
                    </React.Fragment>
                ),
            )}
        </Container>
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
    className?: string;
}>;

const Container = styled.span`
    position: relative;
    display: inline-flex;
    white-space: nowrap;
`;

const NewCallOut = styled.span`
    position: absolute;
    background-color: #5555e9;
    top: -0.8em;
    right: 0;
    z-index: 11;
    color: #fff;
    font-weight: 700;
    font-size: 10px;
    border-radius: 4px;
    width: 41px;
    height: 17px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
