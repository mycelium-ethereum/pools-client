import React from 'react';
import styled from 'styled-components';

export const Input = styled.input`
    color: #fff;

    &::placeholder {
        /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: #fff;
        opacity: 1; /* Firefox */
    }

    &:-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #fff;
    }

    &::-ms-input-placeholder {
        /* Microsoft Edge */
        color: #fff;
    }

    &:focus {
        border: none;
        outline: none;
        box-shadow: none;
    }
`;

interface CBCProps {
    display?: boolean;
}

export const CheckboxContainer = styled.div<CBCProps>`
    display: ${(props) => (props.display ? 'flex' : 'none')};
    cursor: pointer;
    width: fit-content;
`;

export const CheckboxTitle = styled.span`
    margin-left: 0.5rem;
    margin-top: -0.2rem;
    font-size: var(--font-size-small);
`;

type CBProps = {
    className?: string;
    checked?: boolean;
    onClick?: any;
};
export const Checkbox: React.FC<CBProps> = styled(({ className, checked, onClick }: CBProps) => {
    return (
        <span className={className} onClick={onClick}>
            <input type="checkbox" checked={checked} readOnly />
            <span className="checkmark" />
        </span>
    );
})`
    border: 1px solid var(--color-primary);
    width: 1.7rem;
    height: 1.1rem;
    display: block;
    position: relative;
    border-radius: 10px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    transition: 0.3s;

    /* Hide the browser's default checkbox */
    & > input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    /* Create a custom checkbox */
    & > .checkmark {
        position: absolute;
        transition: 0.3s;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 5px;
    }

    /* On mouse-over, add a grey background color */
    &:hover {
        opacity: 0.8;
    }

    /* When the checkbox is checked, add a blue background */
    & > input:checked ~ .checkmark {
        background-color: var(--color-primary);
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    & > .checkmark:after {
        content: '';
        position: absolute;
        display: none;
    }

    /* Show the checkmark when checked */
    & > input:checked ~ .checkmark:after {
        display: block;
    }

    /* Style the checkmark/indicator */
    & > .checkmark:after {
        left: 10px;
        top: 3px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
`;

export * from './select';
