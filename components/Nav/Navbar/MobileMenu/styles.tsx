import styled from 'styled-components';
import { Container } from '~/components/General/Container';

export const Menu = styled.div`
    width: 100vw;
    position: relative;
`;

export const MenuContent = styled(Container)`
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

export const MobileLink = styled.div<{ selected: boolean }>`
    width: 100%;
    color: #fff;
    background: ${({ selected }) => (selected ? 'rgba(0, 0, 0, 0.5)' : 'transparent')};
    margin: 0.5rem 0;
    padding: 0.5rem 1.25rem;
    border-radius: 0.5rem;
    cursor: pointer;
`;
