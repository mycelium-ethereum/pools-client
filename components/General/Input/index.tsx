import { DownOutlined } from '@ant-design/icons';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import { Children } from '@libs/types/General';
import { classNames } from '@libs/utils/functions';
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
