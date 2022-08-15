import styled from 'styled-components';
import { Logo as UnstyledLogo } from '~/components/General';

export const Container = styled.div`
    overflow: hidden;
    position: relative;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    border: 1px solid ${({ theme }) => theme.border.primary};
`;

export const Background = styled.div`
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
`;

export const Card = styled.div`
    position: relative;
    display: flex;
`;

export const Vector = styled.div`
    padding: 4rem 2.5rem;
    background: ${({ theme }) => theme.background.primary};
    @media ${({ theme }) => theme.device.md} {
        padding: 4rem 3rem;
    }
`;

export const Wrapper = styled.div`
    margin: auto;
    padding: 10px;
`;

export const Content = styled.div`
    display: flex;

    &:first-child {
        margin-bottom: 1.25rem;
    }
`;

export const Text = styled.div`
    color: #ffffff;
    margin: auto 0;
`;

export const Logo = styled(UnstyledLogo)`
    margin: auto 1.25rem auto 0;
`;
