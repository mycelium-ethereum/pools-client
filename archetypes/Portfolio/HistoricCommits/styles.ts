import styled from 'styled-components';
import { device } from '~/store/ThemeSlice/themes';

export const PaginationWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem 1rem;
    @media ${device.sm} {
        padding: 0.75rem 1.5rem;
    }
`;
