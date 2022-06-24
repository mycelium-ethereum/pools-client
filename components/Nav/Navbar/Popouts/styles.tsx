import styled from 'styled-components';
import { Theme } from '~/store/ThemeSlice/themes';

export const Link = styled.a.attrs({
    target: '_blank',
    rel: 'noopener noreferrer',
})``;

export const NavButton = styled.button<{ selected: boolean; navMenuOpen?: boolean }>`
    display: flex;
    height: 36px;
    width: 41px;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    ${({ selected, navMenuOpen }) => {
        switch (true) {
            case selected && navMenuOpen:
                return `
                    color: #ffffff;
                    border: 1px solid #ffffff;
                    background: transparent;

                    &:focus {
                        border: 1px solid #ffffff;
                    }
                `;
            case selected && !navMenuOpen:
                return `
                    color: #ffffff;
                    background: #1c64f2;
                    border: 1px solid #1c64f2;

                    &:focus {
                        border: 1px solid #1c64f2;
                    }
                `;
            default:
                return `
                    color: #1c64f2;
                    border: 1px solid #1c64f2;
                    background: linear-gradient(309.78deg, rgba(26, 85, 245, 0.5) -96.53%, rgba(26, 85, 245, 0) 73.43%);
                    
                    &:focus {
                        border: 1px solid #1c64f2;
                    }
                `;
        }
    }}
    transition: background-color 0.3s ease-in-out;
    margin-left: 16px;

    /* Only allow hover effect on desktop */
    @media (pointer: fine) and (hover: hover) {
        &:hover {
            background-color: #1c64f2;
            color: #fff;
        }
    }
`;

export const AppLaunchNavButton = styled(NavButton)<{ selected: boolean }>`
    > span > span {
        ${({ selected, navMenuOpen }) => {
            switch (true) {
                case selected && navMenuOpen:
                    return `
                    background-color: #ffffff;
                `;
                case selected && !navMenuOpen:
                    return `
                background-color: #ffffff;
                `;
                default:
                    return `
                background-color: #1c64f2;
                `;
            }
        }}
    }
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
    font-size: 16px;
    line-height: 24px;
    font-family: 'Aileron', sans-serif;
`;

export const Popout = styled.div<{ isActive: boolean }>`
    position: absolute;
    top: 50px;
    right: 0;
    z-index: 50;
    display: flex;
    flex-direction: column;
    font-family: 'Aileron', sans-serif;
    pointer-events: ${({ isActive }) => (isActive ? 'all' : 'none')};

    /* Animate rows on open */
    > div,
    > a {
        transition-property: opacity, transform;
        transition-duration: 500ms;
        transform: ${({ isActive }) => (isActive ? 'translate(0, 0)' : 'translate(16px, 16px)')};
        opacity: ${({ isActive }) => (isActive ? '1' : '0')};
    }
`;

export const PopoutOption = styled.div<{ borderBottom?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    width: 320px;
    height: 72px;
    border: 1px solid rgba(28, 100, 242, 0.2);
    border-bottom: ${({ borderBottom }) => (borderBottom ? '1px solid rgba(28, 100, 242, 0.2)' : 'none')};
    overflow: hidden;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    background: ${({ theme }) =>
        theme.theme === Theme.Light
            ? 'linear-gradient(97.74deg, rgba(28, 100, 242, 0.1) -59.53%, rgba(28, 100, 242, 0) 74.27%), #ffffff'
            : 'rgba(53, 53, 220, 0.9)'};
    color: ${({ theme }) => (theme.theme === Theme.Light ? '#1c64f2' : '#ffffff')};
`;

export const StyledSettingsPopout = styled(Popout)<{ isActive: boolean }>`
    /* Active/inactive states */
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
    font-size: 16px;
    line-height: 24px;
`;

export const ToggleSwitch = styled(Link)`
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
    ${({ theme, selected }) => {
        switch (true) {
            case selected && theme.theme === Theme.Light:
                return `
                    color: #ffffff;
                `;
            case selected && theme.theme === Theme.Dark:
                return `
                    color: #1c64f2;
                `;
            case theme.theme === Theme.Light:
                return `
                    color: #1c64f2;
                `;
            default:
                return `
                    color: #ffffff;
                `;
        }
    }}

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
    background-color: ${({ theme }) => (theme.theme === Theme.Light ? '#1c64f2' : '#ffffff')};
    transition: left 0.3s ease;
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

// App launcher styles
export const Launcher = styled(Popout)<{ isActive: boolean }>`
    width: 281px;
    /* Active/inactive states */
    > div:nth-child(1) {
        transition-delay: ${({ isActive }) => (isActive ? '100ms' : '500ms')};
    }
    > div:nth-child(2) {
        transition-delay: ${({ isActive }) => (isActive ? '200ms' : '400ms')};
    }
    > a:nth-child(3) {
        transition-delay: 300ms;
    }
    > a:nth-child(4) {
        transition-delay: ${({ isActive }) => (isActive ? '400ms' : '200ms')};
    }
    > div:nth-child(5) {
        transition-delay: ${({ isActive }) => (isActive ? '500ms' : '100ms')};
    }
`;

export const LauncherRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #1c64f2;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    font-size: 16px;
    line-height: 24px;
    font-family: 'Aileron', sans-serif;

    ${({ theme }) => {
        switch (theme.theme) {
            case Theme.Light:
                return `
                    background: linear-gradient(97.74deg, rgba(28, 100, 242, 0.1) -59.53%, rgba(28, 100, 242, 0) 74.27%), #ffffff;
                    color: #1c64f2;
                `;
            case Theme.Dark:
                return `
                    background: rgba(53, 53, 220, 0.9);
                    color: #fff;
                `;
            default:
                return `
                    background: linear-gradient(97.74deg, rgba(28, 100, 242, 0.1) -59.53%, rgba(28, 100, 242, 0) 74.27%), #ffffff;
                    color: #1c64f2;
                `;
        }
    }}
`;

export const GradientBackground = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: opacity 0.3s ease;
    background: ${({ theme }) =>
        theme.theme === Theme.Light
            ? 'linear-gradient(272.96deg, #1C64F2 -7%, rgba(26, 85, 245, 0) 150%)'
            : 'linear-gradient(273.08deg, #1E1E90 15%, rgba(26, 85, 245, 0) 120%)'};
    opacity: 0;
    z-index: -1;
`;

export const AppRow = styled(LauncherRow)`
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    overflow: hidden;

    > a:nth-child(1) {
        border-right: 1px solid #1c64f2;
    }
    > a:nth-child(1) svg {
        width: 73px;
        height: 17px;
    }
    > a:nth-child(2) svg {
        width: 101px;
        height: 30px;
    }
`;

export const AppRowButton = styled(Link)`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 100px;
    overflow: hidden;
    background-color: transparent;
    transition: color 0.3s ease;

    &:hover {
        color: #ffffff;
    }

    &:hover > img {
        opacity: 1;
        transform: scale(1);
    }
`;

export const AppBackgroundImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all 0.5s ease;
    transform: scale(1.1);
    opacity: 0;
    z-index: -1;
`;

export const GovernanceRow = styled(LauncherRow)`
    padding: 16px 0 8px;
    flex-direction: column;
    border-top: none;
    border-bottom: none;
`;

export const ButtonRow = styled.div`
    display: flex;
`;

export const GovernanceButton = styled(Link)`
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    height: max-content;
    margin: 8px 10px;
    padding: 8px 10px;
    border-radius: 4px;
    overflow: hidden;
    background: transparent;
    transition: color 0.3s ease;

    &:hover {
        color: #ffffff;
    }

    &:hover > div {
        opacity: 1;
    }

    > svg {
        width: auto;
        height: 19px;
        margin-bottom: 8px;
    }
`;

export const LinkRow = styled(LauncherRow)`
    position: relative;
    padding: 16px;
    border-bottom: none;
    transition: color 0.3s ease;

    &:hover {
        color: #ffffff;
    }

    &:hover > div {
        opacity: 1;
    }

    > svg {
        width: auto;
        height: 17px;
        margin-right: 20px;
    }
`;

export const SocialIconRow = styled(LauncherRow)`
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    padding: 8px 0;

    > a {
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        padding: 12px;
        transition: background-color 0.3s ease;

        &:hover {
            color: #ffffff;
        }

        &:hover > div {
            opacity: 1;
        }
    }

    > a svg {
        transition: all 0.3s ease;
    }

    /* Twitter icon */
    > a:nth-child(1) {
        margin-right: 11px;
    }
    > a:nth-child(1) svg {
        width: 18px;
        height: 15px;
    }

    /* Discord icon */
    > a:nth-child(2) {
        margin-right: 8px;
    }
    > a:nth-child(2) svg {
        width: 20px;
        height: 15px;
    }

    /* Mirror icon */
    > a:nth-child(3) svg {
        width: 24px;
        height: 14px;
    }
`;
