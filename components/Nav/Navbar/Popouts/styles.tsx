import styled from 'styled-components';

export const NavButton = styled.button<{ selected: boolean }>`
    border: 1px solid #1c64f2;
    display: flex;
    height: 36px;
    width: 41px;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    background-color: ${({ selected }) => (selected ? '#1c64f2' : '#fff')};
    color: ${({ selected }) => (selected ? '#fff' : '#1c64f2')};
    transition: background-color 0.3s ease-in-out;
    margin-left: 16px;
    &:hover {
        background-color: #1c64f2;
        color: #fff;
    }
`;

export const AppLaunchNavButton = styled(NavButton)`
    &:hover span > span {
        background-color: #fff;
    }
`;

export const SettingsNavButton = styled(NavButton)`
    > svg {
        transition: color 0.3s ease;
    }
`;

export const CubeGrid = styled.span`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-gap: 4px;
`;

export const Cube = styled.span`
    height: 4px;
    width: 4px;
    background-color: #1c64f2;
    transition: background-color 0.3s ease-in-out;
`;

export const PopoutContainer = styled.div`
    position: relative;
`;

export const Popout = styled.div<{ isActive: boolean }>`
    position: absolute;
    top: 50px;
    right: 0;
    z-index: 50;
    display: flex;
    flex-direction: column;
    font-family: 'Aileron', sans-serif;
    /* transition: all 0.3s ease; */
    pointer-events: ${({ isActive }) => (isActive ? 'all' : 'none')};

    /* Active/inactive states */
    > div {
        transition-property: all;
        transition-duration: 500ms;
        transform: ${({ isActive }) => (isActive ? 'translate(0, 0)' : 'translate(16px, 16px)')};
        opacity: ${({ isActive }) => (isActive ? '1' : '0')};
    }
    > div:nth-child(1) {
        transition-delay: ${({ isActive }) => (isActive ? '100ms' : '300ms')};
    }
    > div:nth-child(2) {
        transition-delay: 200ms;
    }
    > div:nth-child(3) {
        transition-delay: ${({ isActive }) => (isActive ? '300ms' : '100ms')};
    }
`;

export const PopoutText = styled.span`
    color: #1c64f2;
    font-size: 16px;
    line-height: 24px;
`;

export const ToggleSwitch = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    width: 140px;
    height: 40px;
    border: 1px solid rgba(28, 100, 242, 0.2);
    border-radius: 4px;
    &:focus {
        border: 1px solid rgba(28, 100, 242, 0.2);
    }
`;

export const SwitchOption = styled.span<{ selected: boolean }>`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 68px;
    height: 40px;
    border-radius: 3px;
    color: ${({ selected }) => (selected ? 'white' : '#1c64f2')};
    transition: color 0.3s ease;
    z-index: 1;
`;

export const Slider = styled.span<{ isSwitchedOn: boolean }>`
    position: absolute;
    top: 50%;
    left: ${({ isSwitchedOn }) => (isSwitchedOn ? '68px' : '1px')};
    transform: translateY(-50%);
    display: flex;
    width: 68px;
    height: 36px;
    border-radius: 3px;
    z-index: 0;
    background-color: #1c64f2;
    transition: left 0.3s ease;
`;

export const PopoutOption = styled.div<{ borderBottom?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    width: 320px;
    height: 72px;
    background: linear-gradient(97.74deg, rgba(28, 100, 242, 0.1) -59.53%, rgba(28, 100, 242, 0) 74.27%), #ffffff;
    border: 1px solid rgba(28, 100, 242, 0.2);
    border-bottom: ${({ borderBottom }) => (borderBottom ? '1px solid rgba(28, 100, 242, 0.2)' : 'none')};
    overflow: hidden;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

export const VersionSelector = styled(PopoutOption)`
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
`;

export const DarkModeSelector = styled(PopoutOption)`
    border: 1px solid rgba(28, 100, 242, 0.2);
    border-top: none;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
`;
