import styled from 'styled-components';
import { InputContainer } from '@components/General/Input';
import { Input } from '@components/General/Input/Numeric';

export const Container = styled.div`
    @media (min-width: 640px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-gap: 15px;
    }
`;

export const Wrapper = styled.div<{ hasMargin?: boolean }>`
    width: 100%;
    margin-bottom: ${({ hasMargin }) => (hasMargin ? '1rem' : '0')};
`;

export const InputContainerStyled = styled(InputContainer)`
    width: 100%;
    border-color: ${({ theme }) => theme['border']};
    border-radius: 7px;
`;

export const Label = styled.p`
    margin-bottom: 0.25rem;
    @media (min-width: 640px) {
        margin-bottom: 0.5rem;
    }
`;

export const InputStyled = styled(Input)`
    width: 60%;
    height: 100%;
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.5rem;
`;

export const Subtext = styled.p<{ showContent: boolean; isAmountValid?: boolean }>`
    display: ${({ showContent }) => (showContent ? 'block' : 'none')};
    color: ${({ isAmountValid, theme }) => (isAmountValid ? '#ef4444' : theme.text)};
    font-size: 15px;
    opacity: 0.7;

    @media (min-width: 640px) {
        margin-top: 0.5rem;
    }
`;
