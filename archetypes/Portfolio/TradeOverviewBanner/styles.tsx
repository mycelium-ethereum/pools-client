import styled from 'styled-components';
import { Dropdown as UnstyledDropdown } from '~/components/General';
import Arrow from '~/public/img/general/arrow.svg';
import { device } from '~/store/ThemeSlice/themes';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (min-width: 1200px) {
        flex-direction: row;
    }
`;

export const Banner = styled.div<{ showFullWidth?: boolean }>`
    padding: 1.25rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    background: ${({ theme }) => theme.background};
    justify-content: space-between;
    gap: 20px;
    display: flex;
    flex-direction: column;
    width: 100%;

    @media (min-width: 1200px) {
        width: 75%;
    }
`;

export const Text = styled.div<{ isBold?: boolean; showOpacity?: boolean }>`
    font-size: 1.5rem;
    line-height: 2rem;
    margin: 0;
    font-weight: ${({ isBold }) => (isBold ? '700' : '600')};
    opacity: ${({ showOpacity }) => (showOpacity ? '0.5' : '1')};
`;

export const BannerContent = styled.div`
    display: flex;
    gap: 20px;
    justify-content: space-between;
`;

export const Title = styled.h1`
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text};
`;

export const Subtitle = styled.h2`
    font-size: 1rem;
    font-weight: 400;
    color: #9ca3af;
`;

export const Header = styled.h2`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const Actions = styled.h2`
    display: flex;
    justify-content: space-between;
    gap: 8px;
`;

export const Dropdown = styled(UnstyledDropdown)`
    button {
        background-color: #f3f4f6 !important;
        border-color: #f3f4f6 !important;
        padding: 5px 15px !important;
    }

    span {
        font-size: 12px !important;
        color: #111928 !important;
        font-weight: 600;
    }
`;

export const Currency = styled.div`
    font-size: 20px;
    font-weight: 700;
    margin-right: 5px;

    @media ${device.md} {
        font-size: 32px;
    }
`;

export const Value = styled.div`
    font-size: 40px;
    font-weight: 700;
    display: flex;
    align-items: center;
    font-family: 'Inter', 'sans-serif';

    color: #111928;

    &.up {
        color: #0e9f6e;
    }

    &.down {
        color: #ef4444;
    }

    @media ${device.md} {
        font-size: 60px;
    }

    @media ${device.lg} {
        font-size: 80px;
    }
`;

export const ArrowIcon = styled(Arrow)`
    // default is down
    -webkit-transform: rotateX(180deg) scale(0.5);
    transform: rotateX(180deg) scale(0.5);
    path {
        fill: #111928;
    }
    &.down {
        path {
            fill: #ef4444;
        }
    }

    &.up {
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        path {
            fill: #0e9f6e;
        }
    }

    @media ${device.md} {
        -webkit-transform: rotateX(180deg) scale(0.75);
        transform: rotateX(180deg) scale(0.75);
        &.up {
            -webkit-transform: scale(0.75);
            transform: scale(0.75);
        }
    }
    @media ${device.lg} {
        -webkit-transform: rotateX(180deg) scale(1);
        transform: rotateX(180deg) scale(1);
        &.up {
            -webkit-transform: scale(1);
            transform: scale(1);
        }
    }
`;

export const CardContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media ${device.sm} {
        flex-direction: row;
        background-color: light-blue;
    }

    @media (min-width: 1200px) {
        flex-direction: column;
        width: 25%;
    }
`;

export const CardTitle = styled.div<{ variant?: string }>`
    font-weight: 400;
    font-size: 16px;
    color: #9ca3af;
`;

export const CardValue = styled.div<{ variant?: string }>`
    font-family: 'Inter', 'sans-serif';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    color: #111928;
`;

export const Card = styled.div`
    border-radius: 10px;
    padding: 15px 20px;

    background: #f3f4f6;
    border: 1px solid #6b7280;

    &.down {
        background: linear-gradient(270deg, rgba(239, 68, 68, 0.2) -14.15%, rgba(239, 68, 68, 0) 22.33%), #faf3f3;
        border: 1px solid #ef4444;
        ${CardTitle} {
            color: #ef4444;
        }
        ${CardValue} {
            color: #ef4444;
        }
    }
    &.up {
        background: linear-gradient(270deg, rgba(5, 122, 85, 0.2) -14.15%, rgba(5, 122, 85, 0) 22.33%), #f3faf7;
        border: 1px solid #0e9f6e;
        ${CardTitle} {
            color: #0e9f6e;
        }
        ${CardValue} {
            color: #0e9f6e;
        }
    }

    @media ${device.sm} {
        width: 50%;
    }

    @media (min-width: 1024px) {
        width: 100%;
    }
`;
