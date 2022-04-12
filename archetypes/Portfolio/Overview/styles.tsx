import styled from 'styled-components';
import { device } from '~/store/ThemeSlice/themes';

export const Container = styled.div`
    margin-top: 12px;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-gap: 30px;

    @media ${device.md} {
        margin-top: 20px;
    }
`;

export const Wrapper = styled.div<{ isFullWidth?: boolean }>`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-gap: 30px;

    @media ${device.xl} {
        display: grid;
        grid-template-columns: ${({ isFullWidth }) =>
            isFullWidth ? 'minmax(0, 1fr)' : 'minmax(0, 2fr) minmax(0, 1fr)'};
    }
`;

export const Banner = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 30px;
    @media ${device.md} {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
`;
