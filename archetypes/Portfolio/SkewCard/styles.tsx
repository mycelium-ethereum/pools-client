import styled from 'styled-components';
import { Logo as UnstyledLogo } from '~/components/General';
import CTABackground from '~/public/img/cta-bg.svg';

export const Container = styled.div`
    overflow: hidden;
    position: relative;
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
`;

export const Background = styled(CTABackground)`
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
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.23) 6.59%, rgba(0, 0, 0, 0.73) 96.04%);

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
