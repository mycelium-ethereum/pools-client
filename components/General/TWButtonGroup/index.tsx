import React, { useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

const SELECTED = 'z-10 ring-1 ring-blue-700 border-blue-700';
const DISABLED = 'opacity-50 cursor-not-allowed';

const DEFAULT_BUTTON =
    'relative inline-flex items-center px-4 py-2 first:rounded-l-md last:rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none';

type Option = {
    key: number;
    text: string;
    disabled?: {
        text: React.ReactNode;
    };
};

export default (({ options, value, onClick }) => {
    return (
        <span className="relative z-0 inline-flex shadow-sm rounded-md">
            {options.map((option) =>
                option.disabled ? (
                    <ComingSoon onClick={onClick} option={option} />
                ) : (
                    <button
                        type="button"
                        onClick={() => onClick(option.key)}
                        className={`${value === option.key ? SELECTED : ''} ${
                            option.disabled ? DISABLED : ''
                        } ${DEFAULT_BUTTON} }`}
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
}> = ({ option, onClick }) => {
    const ref = useRef(null);
    return (
        <>
            <StyledTooltip className="shadow bg-gray-50" id={`${option.text}`} effect={'solid'}>
                {option?.disabled?.text}
            </StyledTooltip>
            <button
                ref={ref}
                type="button"
                data-tip
                data-for={`${option.text}`}
                onClick={() => onClick(option.key)}
                className={`${DISABLED} ${DEFAULT_BUTTON} }`}
            >
                {option.text}
            </button>
        </>
    );
};

const StyledTooltip = styled(ReactTooltip)`
    &.show {
        opacity: 1 !important;
    }
`;
