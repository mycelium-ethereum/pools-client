import styled from 'styled-components';
import { default as UnstyledButton } from '~/components/General/Button';
import { Container as UnstyledContainer } from '~/components/General/Container';
import { default as UnstyledLoading } from '~/components/General/Loading';

export const Header = styled.div`
    margin-bottom: 2rem;

    @media ${({ theme }) => theme.device.lg} {
        display: flex;
        gap: 20px;
    }
`;

export const Heading = styled.h1`
    color: ${({ theme }) => theme.fontColor.primary};
    margin: 2rem 0 0.5rem;
    font-size: 1.875rem;
    line-height: 2.25rem;
    font-weight: 600;
`;

export const SubHeading = styled.div`
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 300;

    @media ${({ theme }) => theme.device.lg} {
        margin-bottom: 0;
    }
`;

export const Link = styled.a.attrs({
    target: '_blank',
    rel: 'noreferrer',
})`
    text-decoration: underline;
    color: #3da8f5;
`;

export const Container = styled(UnstyledContainer)`
    margin-bottom: 2.5rem;
`;

export const Loading = styled(UnstyledLoading)`
    margin: 2.5rem auto 0;
    width: 2.5rem;
`;

export const DataRow = styled.div`
    padding: 1rem;
    margin-bottom: 2.5rem;
    border-radius: 0.25rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    background-color: ${({ theme }) => theme.background.primary};

    @media ${({ theme }) => theme.device.sm} {
        border-radius: 1rem;
    }
    @media ${({ theme }) => theme.device.md} {
        padding: 2rem;
        border-radius: 1.5rem;
    }
`;

export const AltPoolRow = styled.div`
    position: relative;
`;

export const AltPoolTitle = styled.div`
    display: flex;
    flex-direction: row;
    color: #9ca3af;
    font-weight: 400;
    font-size: 16px;
    margin-bottom: 30px;

    &:before,
    &:after {
        content: '';
        flex: 1 1;
        border-bottom: 1px solid #9ca3af;
        margin: auto;
    }
    &:before {
        margin-right: 10px;
    }
    &:after {
        margin-left: 10px;
    }
`;

export const AltPoolActions = styled.div`
    display: block;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 20px;

    @media ${({ theme }) => theme.device.sm} {
        gap: 0;
        flex-direction: row;
    }
`;

export const Button = styled(UnstyledButton)<{ disabled?: boolean }>`
    @media ${({ theme }) => theme.device.sm} {
        max-width: 220px;
    }

    ${({ disabled, theme }) => {
        if (disabled) {
            return `
                cursor: not-allowed; 
                opacity: 0.5; 

                @media ${theme.device.sm} {
                    margin-left: 1.25rem; 
                }
            `;
        }
    }};
`;
