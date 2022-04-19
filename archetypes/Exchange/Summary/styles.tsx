import styled from 'styled-components';

import { HiddenExpand as UnstyledHiddenExpand } from '~/components/General';
import Button from '~/components/General/Button';
import { default as UnstyledTimeLeft } from '~/components/TimeLeft';
import { device, fontSize } from '~/store/ThemeSlice/themes';

export const HiddenExpand = styled(UnstyledHiddenExpand)<{ showBorder: boolean }>`
    margin-bottom: 2rem !important;
    font-size: ${fontSize.md};
    line-height: 1.5rem;
    border-width: 1px;
    background-color: ${({ theme }) => theme.background};
    border-color: ${({ showBorder, theme }) => (showBorder ? theme['border-secondary'] : 'transparent')};
`;

export const Wrapper = styled.div`
    padding: 1.5rem 1rem 0;
    position: relative;
`;

export const SectionDetails = styled.div`
    margin-bottom: 5px;
    margin-top: -4px;
`;

export const Countdown = styled.div`
    position: absolute;
    top: -1rem;
    left: 1.5rem;
    padding: 0.375rem;
    line-height: 1.25rem;
    border-radius: 0.25rem;
    background-color: ${({ theme }) => theme.background};
    z-index: 2;
    font-size: ${fontSize.sm};
    text-transform: capitalize;
`;

export const TimeLeft = styled(UnstyledTimeLeft)`
    display: inline;
    padding: 0.25rem 0.375rem;
    margin-left: 0.375rem;
    border-radius: 0.5rem;
    border-width: 1px;
    background-color: ${({ theme }) => theme['button-bg']};
    border-color: ${({ theme }) => theme['border-secondary']};
`;

export const SumText = styled.span<{ setColor?: string }>`
    font-size: ${fontSize.xs};
    font-weight: 600;

    ${({ setColor }) => {
        if (setColor === 'green') {
            return `
                color: #10b981;
            `;
        } else if (setColor === 'red') {
            return `
                color: #ef4444;
            `;
        }
    }}

    @media ${device.sm} {
        font-size: ${fontSize.sm};
    }
`;

export const Divider = styled.hr`
    margin: 10px 0;
`;

export const ShowDetailsButton = styled(Button)`
    width: calc(100% + 2rem);
    margin: 23px -1rem 0;
    background-color: ${({ theme }) => theme['border-secondary']} !important;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
    height: 30px;
    text-align: center;

    svg {
        margin: 0 auto;
        path {
            fill: ${({ theme }) => theme.text} !important;
        }
    }

    .open {
        -webkit-transform: rotateX(180deg);
        transform: rotateX(180deg);
    }
`;

export const Transparent = styled.div<{
    inline?: boolean;
}>`
    opacity: 50%;
    ${({ inline }) => (inline ? `display: inline` : '')};
`;
