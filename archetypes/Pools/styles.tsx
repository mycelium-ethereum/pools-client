import styled from 'styled-components';
import { Container as UnstyledContainer } from '~/components/General/Container';
import { default as UnstyledLoading } from '~/components/General/Loading';
import { device } from '~/store/ThemeSlice/themes';

export const Header = styled.div`
    margin-bottom: 2rem;

    @media ${device.lg} {
        display: flex;
        gap: 20px;
    }
`;

export const Heading = styled.h1`
    color: ${({ theme }) => theme.text};
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

    @media (min-width: 1024px) {
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
    background-color: ${({ theme }) => theme.background};

    @media (min-width: 640px) {
        border-radius: 1rem;
    }
    @media (min-width: 768px) {
        padding: 2rem;
        border-radius: 1.5rem;
    }
`;
