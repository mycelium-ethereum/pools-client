import styled from 'styled-components';
import CTABackground from '@public/img/cta-bg.svg';
import { Logo as UnstyledLogo } from '@components/General';

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
    padding: 4rem;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.23) 6.59%, rgba(0, 0, 0, 0.73) 96.04%);
`;

export const Wrapper = styled.div`
    margin: auto;
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
