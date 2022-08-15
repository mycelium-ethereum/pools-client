import styled from 'styled-components';
import { Container as UnstyledContainer } from '~/components/General/Container';

export const Header = styled.div`
    margin-bottom: 2rem;
    @media ${({ theme }) => theme.device.lg} {
        display: flex;
        gap: 20px;
        justify-content: space-between;
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
    color: inherit;
`;

export const Container = styled(UnstyledContainer)`
    margin-bottom: 2.5rem;
`;

export default {
    Container,
    SubHeading,
    Heading,
    Header,
    Link,
};
