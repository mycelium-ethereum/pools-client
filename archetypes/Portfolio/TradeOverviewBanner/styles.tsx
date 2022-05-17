import styled from 'styled-components';
import { Dropdown as UnstyledDropdown } from '~/components/General';
import Arrow from '~/public/img/general/arrow.svg';
import { Theme } from '~/store/ThemeSlice/themes';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media ${({ theme }) => theme.device.xl} {
        flex-direction: row;
    }
`;

export const Banner = styled.div`
    padding: 1.25rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    background: ${({ theme }) => theme.background.primary};
    justify-content: space-between;
    gap: 20px;
    display: flex;
    flex-direction: column;
    width: 100%;

    @media ${({ theme }) => theme.device.xl} {
        width: 75%;

        &.empty-state {
            width: 50%;
        }
    }
`;

export const BannerContent = styled.div`
    display: flex;
    gap: 20px;
    justify-content: space-between;
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
        ${({ theme }) => {
            switch (theme.theme) {
                case Theme.Light:
                    return `
                        background-color: #f3f4f6 !important;
                        border-color: #f3f4f6 !important;
                        padding: 5px 15px !important;
                    `;
                default:
                    return `
                        background-color: #1F2A37 !important;
                        border-color: #1F2A37 !important;
                        padding: 5px 15px !important;
                    `;
            }
        }}
    }
    span {
        font-size: 12px !important;
        font-weight: 600;
    }
`;

export const Currency = styled.div`
    &::before {
        content: '$';
        font-size: 20px;
        font-weight: 700;
        @media ${({ theme }) => theme.device.sm} {
            margin-right: 5px;
        }

        @media ${({ theme }) => theme.device.md} {
            font-size: 32px;
        }
    }
`;

export const Value = styled.div`
    font-size: 28px;
    font-weight: 700;
    display: flex;
    align-items: baseline;
    font-family: 'Inter', 'sans-serif';

    &.up {
        color: #0e9f6e;
    }

    &.down {
        color: #ef4444;
    }

    @media ${({ theme }) => theme.device.sm} {
        font-size: 40px;
    }

    @media ${({ theme }) => theme.device.lg} {
        font-size: 80px;
    }
`;

export const ArrowIcon = styled(Arrow)<{ large?: boolean }>`
    align-self: center;
    display: flex;
    height: 28px;
    width: 28px;

    @media ${({ theme }) => theme.device.lg} {
        height: ${({ large }) => (large ? '65px' : '54px')};
        width: ${({ large }) => (large ? '62px' : '51px')};
    }

    stroke-width: 35px;

    stroke-linecap: round;

    &.down {
        transform: rotate(180deg);
    }
`;

export const CardContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media ${({ theme }) => theme.device.sm} {
        flex-direction: row;
        background-color: light-blue;
    }

    @media ${({ theme }) => theme.device.xl} {
        flex-direction: column;
        width: 25%;
    }
`;

export const CardTitle = styled.div<{ variant?: string }>`
    font-weight: 400;
    font-size: 16px;
    white-space: nowrap;
`;

export const CardValue = styled.div<{ variant?: string }>`
    font-family: 'Inter', 'sans-serif';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
`;

export const Card = styled.div`
    border-radius: 10px;
    padding: 15px 20px;

    background: rgba(243, 244, 246, 0.05);
    border: 1px solid #6b7280;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    color: #9ca3af; // default color

    &.arrow {
        div {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
        }

        flex-direction: row;
        justify-content: space-between;
    }

    &.down {
        background: linear-gradient(270deg, rgba(239, 68, 68, 0.2) -14.15%, rgba(239, 68, 68, 0) 22.33%),
            rgba(255, 77, 93, 0.2);
        border: 1px solid #ef4444;
        color: #ef4444;
    }
    &.up {
        background: linear-gradient(270deg, rgba(5, 122, 85, 0.2) -14.15%, rgba(5, 122, 85, 0) 22.33%),
            rgb(243, 250, 247, 0.1);
        border: 1px solid #0e9f6e;
        color: #0e9f6e;
    }

    @media ${({ theme }) => theme.device.sm} {
        width: 50%;
    }

    @media ${({ theme }) => theme.device.lg} {
        width: 100%;
    }
`;
