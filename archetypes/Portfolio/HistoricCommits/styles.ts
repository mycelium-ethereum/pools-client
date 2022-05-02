import styled from 'styled-components';

export const PaginationWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem 1rem;
    @media ${({ theme }) => theme.device.sm} {
        padding: 0.75rem 1.5rem;
    }
`;
