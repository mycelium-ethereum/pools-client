import React from 'react';
import styled from 'styled-components';
import { useTheme } from '@context/ThemeContext';

export default (({ onClick, isChecked, className, label, subtext }) => {
    const { isDark } = useTheme();
    return (
        <Container className={className}>
            <Input type="checkbox" name="checkbox" checked={isChecked} />
            <HoverPointer onClick={onClick}>
                <Checkmark isChecked={isChecked} isDarkTheme={isDark} />
                <Label htmlFor="checkbox">{label}</Label>
            </HoverPointer>
            {subtext && <Subtext>{subtext}</Subtext>}
        </Container>
    );
}) as React.FC<{
    onClick: () => void;
    isChecked: boolean;
    className?: string;
    label: string;
    subtext: string;
}>;

const Container = styled.div`
    display: block;
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const HoverPointer = styled.div`
    width: min-content;
    white-space: nowrap;
    cursor: pointer;
`;

const Input = styled.input`
    position: absolute;
    opacity: 0;
    height: 0;
    width: 0;
`;

const Label = styled.label`
    margin-left: 30px;
    cursor: pointer;
    color: ${({ theme }) => theme.text};
    font-weight: 600;
`;

const Checkmark = styled.span<{ isChecked: boolean; isDarkTheme: boolean }>`
    position: absolute;
    top: 0.25em;
    left: 0;
    width: 18px;
    height: 18px;
    border: 2px solid ${({ isChecked, isDarkTheme }) => (isChecked && !isDarkTheme ? '#1c64f2' : '#374151')};
    border-radius: 4px;
    background-color: ${({ isChecked, isDarkTheme }) => (isChecked && !isDarkTheme ? '#1c64f2' : 'transparent')};

    &:after {
        content: '';
        position: absolute;
        display: ${({ isChecked }) => (isChecked ? 'block' : 'none')};
        left: 5px;
        top: 1px;
        width: 5px;
        height: 8px;
        border: solid white;
        border-width: 0 2px 2px 0;
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
`;

const Subtext = styled.p`
    font-size: 12px;
    margin-left: 30px;
    color: ${({ theme }) => (theme['is-dark'] ? '#D1D5DB' : '#6b7280')};
`;
