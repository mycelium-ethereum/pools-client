import React, { forwardRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

interface SearchInputProps {
    className?: string;
    placeholder?: string;
    value: string;
    onChange: (input: string) => void;
}

export const InputWrapper = styled.div`
    position: relative;
    width: 100%;
    border: 1px ${({ theme }) => theme.border.primary} solid;
    border-radius: 0.375rem; /* 6px */
    background-color: ${({ theme }) => theme.button.bg}
    color: ${({ theme }) => theme.fontColor.secondary};
    font-weight: 500;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
        background-color: ${({ theme }) => theme.button.hover};
    }
`;

export const SearchIconWrap = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    height: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    padding-left: 0.75rem;
    padding-top: 0.25rem;
    pointer-events: none;
`;

const SearchIcon = styled(SearchOutlined)`
    height: 1.25rem;
    width: 1.25rem;

    // text-gray-400
    color: rgb(156 163 175);
`;

export const InnerSearchInput = styled.input`
    display: block;
    width: 100%;
    // -1 px for the border top and bottom
    padding: calc(0.7rem - 1px) 1rem calc(0.7rem - 1px) 2.5rem;

    border-color: ${({ theme }) => theme.border.primary};
    border-radius: inherit;

    &:focus-visible {
        outline: 1px solid ${({ theme }) => theme.colors.primary};
    }

    @media ${({ theme }) => theme.device.sm} {
        // TODO create font-size css variables
        font-size: 0.875rem; /* 14px */
        line-height: 1.25rem; /* 20px */
    }
`;

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ placeholder, onChange, value, className }, ref) => {
        return (
            <InputWrapper className={className}>
                <SearchIconWrap>
                    <SearchIcon aria-hidden="true" />
                </SearchIconWrap>
                <InnerSearchInput
                    ref={ref}
                    type="text"
                    name="email"
                    id="email"
                    autoComplete="off"
                    value={value}
                    placeholder={placeholder}
                    onChange={(ev) => onChange(ev.target.value)}
                />
            </InputWrapper>
        );
    },
);

SearchInput.displayName = 'SearchInput';
