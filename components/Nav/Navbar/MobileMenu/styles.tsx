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
    overflow: hidden;
    transition: height 0.5s ease;
    height: ${({ isOpen }) => (isOpen ? '100vh' : '0vh')};
    background-color: #1c64f2;
    margin: 0;
    z-index: 0;
`;

export const NavContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    padding: 92px 16px 28px;
`;

export const NavItem = styled.menu`
    border: 0.5px solid;
    width: 100%;
    height: 2px;
    border-image-source: linear-gradient(90deg, #3da8f5 50%, rgba(61, 168, 245, 0) 100.15%);
`;
