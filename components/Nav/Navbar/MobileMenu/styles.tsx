import styled from 'styled-components';
import { Theme } from '~/store/ThemeSlice/themes';

// export const Link = styled.a.attrs({
//     target: '_blank',
//     rel: 'noopener noreferrer',
// })``;

export const NavMenu = styled.menu<{ isOpen: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 0;
    overflow: hidden;
    transition: height 0.5s ease;
    height: ${({ isOpen }) => (isOpen ? '100vh' : '0vh')};
    background-color: #1c64f2;
    margin: 0;
    z-index: 0;
    font-family: 'Aileron';
`;

export const NavList = styled.div`
    position: static;
    top: 0;
    left: 16px;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 92px 0px 28px;

    @media only screen and (min-width: 768px) {
        position: absolute;
        width: calc(100% - 32px);

        /* Hide selectors and dropdowns above 768px */
        > div:nth-child(1),
        > div:nth-child(3) {
            display: none;
        }
    }
`;

export const NavItem = styled.li<{ selected: boolean }>`
    position: relative;
    width: 100%;
    font-weight: ${({ selected }) => (selected ? '700' : '300')};
    font-size: 40px;
    line-height: 44px;
    padding: 16px 0;

    &:after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0px;
        height: 1px;
        width: 100%;
        background: linear-gradient(90deg, #3da8f5 50%, rgba(61, 168, 245, 0) 100.15%);
    }

    &:last-of-type:after {
        display: none;
    }

    &:hover:before {
        opacity: 1;
    }
    &:before {
        content: '';
        position: absolute;
        left: -200px;
        top: 0;
        height: 100%;
        width: 150%;
        background: #3da8f5;
        z-index: -1;
        transition: opacity 0.3s ease;
        opacity: 0;
    }
`;
