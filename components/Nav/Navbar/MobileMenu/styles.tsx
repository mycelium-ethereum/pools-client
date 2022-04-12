import styled from 'styled-components';

export const Menu = styled.div`
    width: 100vw;
    position: relative;
`;

export const MenuContent = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
`;

export const MenuBackground = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: -1;
    left: 0;
    top: 0;
    background-position-y: -60px;
    background-size: 100%;
`;
