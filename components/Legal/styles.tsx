import TWPopup from '@components/General/TWPopup';
import { device } from '@context/ThemeContext/themes';
import styled from 'styled-components';

export const MenuItem = styled.div<{
    selected: boolean;
}>`
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    font-size: 1rem; /* 16px */
    line-height: 1.5rem; /* 24px */
    cursor: pointer;
    white-space: nowrap;
    text-decoration-line: underline;
    opacity: ${(props) => (props.selected ? 1 : 0.6)};
`;

export const MainContentWrap = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 1.25rem;

    @media ${device.lg} {
        width: 80%;
        padding: 0;
    }
`;
export const MainContent = styled.div`
    margin: 0 auto;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;

    max-width: 768px;

    & a {
        text-decoration: underline;
        cursor: pointer;
        color: var(--secondary);
    }

    & a:hover {
        opacity: 0.8;
    }
`;

export const MainTitle = styled.div`
    font-weight: bold;
    padding-top: 4rem;
    padding-bottom: 0.75rem;
    font-size: 1.875rem; /* 30px */
    line-height: 2.25rem; /* 36px */
`;

export const Title = styled.div`
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-size: 1.25rem; /* 20px */
    line-height: 1.75rem; /* 28px */
`;

export const Subtitle = styled.div`
    padding-bottom: 1rem;
`;

export const Paragraph = styled.div`
    padding: 0.5rem 0;
`;

export const List = styled.ul`
    margin-bottom: 1rem;
    list-style-type: disc;
    padding-left: 1rem;
`;

export const LegalDropdown = styled(TWPopup)`
    margin-top: 1.5rem;
    margin-left: 1rem;
    margin-right: auto;
    text-align: left;
    color: ${({ theme }) => theme['text']};
    position: relative;
    display: block;
    width: 175px;

    @media ${device.lg} {
        display: none;
    }
`;

export const Desktop = styled.div`
    display: flex;
    margin-bottom: 2rem;
`;

export const DesktopHeader = styled.div`
    display: flex;
    flex-direction: column;
    width: 20%;
    display: none;
    @media ${device.lg} {
        display: flex;
    }
    margin: 0 auto;
`;
export const HeaderTitle = styled.div`
    padding-top: 4rem;
    padding-bottom: 0.75rem;
    font-weight: 700;
    font-size: 1.875rem; /* 30px */
    line-height: 2.25rem; /* 36px */
`;
