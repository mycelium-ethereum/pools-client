import React from 'react';

// @ts-ignore
import ReactSimpleTooltip from 'react-simple-tooltip';

import styled from 'styled-components';

const SELECTED = 'z-10 bg-tracer-800 text-white ';
const DISABLED = 'cursor-not-allowed';
const BORDERS = 'first:rounded-l-md last:rounded-r-md';
const DEFAULT_BUTTON =
    'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 focus:outline-none';

type Option = {
    key: number;
    text: string;
    disabled?: {
        text: React.ReactNode;
    };
};

export default (({ options, value, onClick }) => {
    return (
        <span className="relative z-0 inline-flex shadow-sm">
            {options.map((option, index) =>
                option.disabled ? (
                    <ComingSoon last={index === options.length - 1} onClick={onClick} option={option} />
                ) : (
                    <button
                        type="button"
                        onClick={() => onClick(option.key)}
                        className={`${value === option.key ? SELECTED : ''} ${
                            option.disabled ? DISABLED : ''
                        } ${DEFAULT_BUTTON} ${BORDERS}}`}
                    >
                        {option.text}
                    </button>
                ),
            )}
        </span>
    );
}) as React.FC<{
    onClick: (key: number) => any;
    options: Option[];
    value: number; // key
}>;

const ComingSoon: React.FC<{
    option: Option;
    onClick: (key: number) => any;
    last: boolean;
}> = ({ option, onClick, last }) => {
    return (
        <>
            <StyledTooltip
                content={`${option.disabled?.text}`}
                arrow={6}
                background="#f9fafb"
                border="#f9fafb"
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
                <button
                    type="button"
                    data-tip
                    data-for={`${option.text}`}
                    onClick={() => onClick(option.key)}
                    className={`${DISABLED} ${DEFAULT_BUTTON} ${last ? 'rounded-r-md' : ''} `}
                >
                    {option.text}
                </button>
            </StyledTooltip>
        </>
    );
};

const StyledTooltip = styled(ReactSimpleTooltip)`
    &.show {
        opacity: 1 !important;
    }
`;
