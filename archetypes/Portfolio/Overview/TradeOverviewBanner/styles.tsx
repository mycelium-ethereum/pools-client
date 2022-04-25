import styled from 'styled-components';

export const Banner = styled.div<{ showFullWidth?: boolean }>`
    padding: 1.25rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    background: ${({ theme }) => theme.background.primary};
`;

export const Text = styled.div<{ isBold?: boolean; showOpacity?: boolean }>`
    font-size: 1.5rem;
    line-height: 2rem;
    margin: 0;
    font-weight: ${({ isBold }) => (isBold ? '700' : '600')};
    opacity: ${({ showOpacity }) => (showOpacity ? '0.5' : '1')};
`;

export const BannerContent = styled.div`
    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.75rem;
    }
`;

export const Card = styled.div`
    padding: 2.5rem 1.25rem 1.5rem;
    margin-top: 1.25rem;
    border-radius: 0.75rem;
    background-color: ${({ theme }) => theme.background.secondary};
`;

export const CardTitle = styled.div`
    font-weight: 700;
    opacity: 0.5;
    font-size: 16px;
    color: #6b7280;
`;
