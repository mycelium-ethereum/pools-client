import { DownOutlined } from '@ant-design/icons';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import { Children } from '@libs/types/General';
import React, { useRef } from 'react';
import styled from 'styled-components';

export const Input = styled.input`
    color: #000;
    background: #f9fafb;
    border: 1px solid #d1d5db;
    box-sizing: border-box;
    border-radius: 7px;
    padding: 12px 20px;
    height: 3.44rem; // 55px

    position: relative;

    &::placeholder {
        /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: #6b7280;
        opacity: 1; /* Firefox */
    }

    &:-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #6b7280;
    }

    &::-ms-input-placeholder {
        /* Microsoft Edge */
        color: #6b7280;
    }

    &:focus {
        border: none;
        outline: none;
        box-shadow: none;
    }
`;

export const InputWrapper = styled.div`
    position: relative;
    ${Input} {
        width: 100%;
    }
`;

export const InnerInputText = (({ className, children }) => (
    <div className={`${className ?? ''} absolute flex m-auto top-0 bottom-0 right-5 h-1/2 text-tracer-800`}>
        {children}
    </div>
)) as React.FC<{
    className?: string
} & Children>

export const CheckboxContainer = styled.div`
    display: flex;
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

export const SelectDropdown = styled.div`
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1);
    opacity: 0;
    background: #fff;
    border-radius: 6px;
    transform-origin: top center;
    transform: scale(1, 0);
    transition: all 300ms ease-in-out;
    z-index: 10;
`;

export const Select = styled(({ preview, onChange, icon, className, children }) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleClick = (e: any) => {
        if (e.target.value) {
            onChange(e);
        }
        ref?.current?.classList?.toggle('open');
    };

    return (
        <div ref={ref} className={className} onClick={handleClick}>
            {preview}
            {icon ? icon : <DownOutlined />}
            <SelectDropdown>{children}</SelectDropdown>
        </div>
    );
})<{
    preview: React.ReactNode;
    onChange: React.MouseEventHandler<HTMLDivElement>;
    icon?: AntdIconProps;
}>`
    border: 1px solid #d1d5db;
    box-sizing: border-box;
    border-radius: 7px;
    padding-left: 1rem;
    color: #6b7280;
    cursor: pointer;
    position: relative;

    > .anticon {
        vertical-align: 0;
    }

    & svg {
        width: 1rem;
        height: 0.8rem;
        position: absolute;
        top: 40%;
        right: 1rem;
        margin: auto;
        transition: 0.3s;
        transform: rotate(0);
    }

    &.open {
        ${SelectDropdown} {
            transform: none;
            opacity: 1;
        }
        & svg {
            transform: rotate(180deg);
        }
    }
`;

export const SelectOption = styled.option`
    padding: 12px 1rem;
    line-height: 1rem;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
        background: #d1d5db;
    }
`;
