import styled from 'styled-components';
import { device } from '~/store/ThemeSlice/themes';

export const Header = styled.div`
    margin-bottom: 2rem;

    @media ${device.lg} {
        display: flex;
        gap: 20px;
    }
`;
