import styled from 'styled-components';

export const Container = styled.div`
    margin-top: 20px;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-gap: 30px;
`;

export const Wrapper = styled.div<{ isFullWidth?: boolean }>`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-gap: 30px;

    @media (min-width: 1280px) {
        display: grid;
        grid-template-columns: ${({ isFullWidth }) =>
            isFullWidth ? 'minmax(0, 1fr)' : 'minmax(0, 2fr) minmax(0, 1fr)'};
    }
`;

export const Banner = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 30px;
    @media (min-width: 768px) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
`;
