import { DownOutlined } from '@ant-design/icons';
import { Children } from '@libs/types/General';
import { classNames } from '@libs/utils/functions';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Button from '../Button';

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

export const InputContainer: React.FC<{
    className?: string;
    error?: boolean;
}> = ({ error, className = '', children }) => (
    <div
        className={classNames(
            'relative py-3 px-3 border rounded bg-cool-gray-50',
            error ? 'border-red-300 text-red-500 ' : 'border-cool-gray-300 text-gray-500 ',
            className,
        )}
    >
        {children}
    </div>
);

export const InnerInputText = (({ className, children }) => (
    <div className={`${className ?? ''} absolute flex m-auto top-0 bottom-0 right-5 h-1/2 text-tracer-800`}>
        {children}
    </div>
)) as React.FC<
    {
        className?: string;
    } & Children
>;

export const SelectDropdown = styled.div`
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1);
    opacity: 0;
    background: #fff;
    border-radius: 6px;
    transform-origin: top center;
    transform: scale(1, 0);
    transition: all 300ms ease-in-out;
    z-index: 10;
`;

export const Select = styled(({ preview, onChange, className, children }) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);

    const handleClick = (e: any) => {
        if (e.target.value) {
            onChange(e);
        }
        setOpen(!open);
    };

    return (
        <Button size="sm" variant="transparent" ref={ref} className={`relative ${className}`} onClick={handleClick}>
            {preview}
            <DownOutlined className={classNames('inline w-8 h-8 transform', open ? 'rotate-180' : '')} />
            <SelectDropdown className={classNames(open ? 'transform-none opacity-100 ' : '')}>
                {children}
            </SelectDropdown>
        </Button>
    );
})<{
    preview: React.ReactNode;
    onChange: React.MouseEventHandler<HTMLDivElement>;
}>`
    > .anticon {
        vertical-align: 0.125rem;
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
`;

export const SelectOption = styled.option`
    padding: 12px 1rem;
    line-height: 1rem;
    &:first-child {
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
    }
    &:last-child {
        border-bottom-left-radius: 7px;
        border-bottom-right-radius: 7px;
    }
    color: ${(props) => (props.disabled ? '' : '#374151')};
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    transition: 0.3s;

    &:hover {
        background: ${(props) => (props.disabled ? '' : '#d1d5db')};
    }
`;
