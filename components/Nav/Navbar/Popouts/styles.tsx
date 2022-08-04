import styled from 'styled-components';
import { Theme } from '~/store/ThemeSlice/themes';

export const ANIMATION_DURATION = 0.3;

export const StyledLink = styled.a.attrs({
    target: '_blank',
    rel: 'noopener noreferrer',
})``;

export const NavButton = styled.button<{ selected: boolean; navMenuOpen?: boolean }>`
    display: flex;
    height: 36px;
    width: 41px;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    margin-left: 16px;
    transition: all ${ANIMATION_DURATION}s ease;

    ${({ theme, selected, navMenuOpen }) => {
        switch (true) {
            case selected && navMenuOpen:
                return `
                    border: 1px solid ${theme.colors.primary};
                    background-color: ${theme.theme === Theme.Light ? '#ffffff' : 'transparent'}
                `;
            case !selected && navMenuOpen:
                return `
                    border: 1px solid #ffffff;
                    background-color: ${theme.colors.primary};
                `;
            case selected && !navMenuOpen:
                return `
                    border: 1px solid ${theme.colors.primary};
                    background-color: ${theme.colors.primary};
                `;
            default:
                return `
                    border: 1px solid ${theme.colors.primary};
                    background-color: ${theme.theme === Theme.Light ? '#ffffff' : 'transparent'}
                `;
        }
    }}
`;

export const AppLaunchNavButton = styled(NavButton)`
    > span > span {
        ${({ theme, selected, navMenuOpen }) => {
            switch (true) {
                case selected && navMenuOpen:
                    return `
                    background-color: ${theme.colors.primary};
                `;
                case !selected && navMenuOpen:
                    return `
                    background-color: #ffffff;
                `;
                case selected && !navMenuOpen:
                    return `
                    background-color: #ffffff;
                `;
                default:
                    return `
                    background-color: ${theme.colors.primary};
                `;
            }
        }}
    }

    /* Only allow hover effect on desktop */
    @media (hover: hover) and (pointer: fine) {
        &:hover {
            background-color: ${({ theme }) => theme.colors.primary} !important;
            color: #fff;
        }
        &:hover span > span {
            background-color: #fff;
        }
    }

    @media only screen and (max-width: 768px) {
        ${({ theme, selected, navMenuOpen }) => {
            switch (true) {
                case selected && navMenuOpen:
                    return `
                    border: 1px solid #ffffff;
                    background-color: #ffffff;
                `;
                case !selected && navMenuOpen:
                    return `
                    border: 1px solid #ffffff;
                    background-color: ${theme.colors.primary};
                `;
                case selected && !navMenuOpen:
                    return `
                    border: 1px solid #ffffff;
                    background-color: #ffffff;
                `;
                default:
                    return `
                    border: 1px solid ${theme.colors.primary};
                    background-color: transparent;
                    transition: all ${ANIMATION_DURATION}s ease ${ANIMATION_DURATION}s;
                `;
            }
        }}
    }
`;

export const SettingsNavButton = styled(NavButton)`
    /* Only allow hover effect on desktop */
    @media (hover: hover) and (pointer: fine) {
        &:hover {
            background-color: ${({ theme }) => theme.colors.primary} !important;
            color: #fff;
        }
    }

    ${({ theme, selected, navMenuOpen }) => {
        switch (true) {
            case selected && navMenuOpen:
                return `
                    background-color: ${theme.colors.primary};
                `;
            case !selected && navMenuOpen:
                return `
                    background-color: ${theme.colors.primary};
                    border: 1px solid #ffffff;
                `;
            case selected && !navMenuOpen:
                return `
                    background-color: ${theme.colors.primary};
                    color: #ffffff;
                `;
            default:
                return `
                    border: 1px solid ${theme.colors.primary};
                    color: ${theme.colors.primary};
                    background-color: ${theme.theme === Theme.Light ? '#ffffff' : 'transparent'}
                `;
        }
    }}
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
    background-color: ${({ theme }) => theme.colors.primary};
    transition: background-color ${ANIMATION_DURATION}s ease;
`;

export const PopoutContainer = styled.div`
    position: relative;
    font-size: 16px;
    line-height: 24px;
    font-family: 'Aileron', sans-serif;
`;

export const Popout = styled.div<{ isActive: boolean }>`
    position: static;
    top: 50px;
    right: 0;
    z-index: 50;
    display: flex;
    flex-direction: row;
    font-family: 'Aileron', sans-serif;
    pointer-events: ${({ isActive }) => (isActive ? 'all' : 'none')};
    justify-content: space-between;
    width: 100%;
    z-index: ${({ isActive }) => (isActive ? '51' : '50')};

    /* Animate rows on open */
    > div,
    > a {
        transition-property: opacity, transform;
        transition-duration: 500ms;
        transform: ${({ isActive }) => (isActive ? 'translate(0, 0)' : 'translate(16px, 16px)')};
        opacity: ${({ isActive }) => (isActive ? '1' : '0')};
    }

    @media only screen and (min-width: 768px) {
        position: absolute;
        flex-direction: column;
        justify-content: start;
        width: auto;
    }
`;

export const PopoutOption = styled.div<{ borderBottom?: boolean }>`
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    width: 140px;
    border-bottom: ${({ borderBottom }) => (borderBottom ? '1px solid rgba(28, 100, 242, 0.2)' : 'none')};
    color: #ffffff;

    > span {
        display: block;
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 10px;

        @media only screen and (min-width: 768px) {
            margin-bottom: 0;
        }
    }

    @media only screen and (min-width: 768px) {
        align-items: center;
        flex-direction: row;
        height: 72px;
        width: 320px;
        padding: 16px;
        color: ${({ theme }) => (theme.theme === Theme.Light ? '#1c64f2' : '#ffffff')};
        background: ${({ theme }) =>
            theme.theme === Theme.Light
                ? 'linear-gradient(97.74deg, rgba(28, 100, 242, 0.1) -59.53%, rgba(28, 100, 242, 0) 74.27%), #ffffff'
                : 'tracer-800'};
        border: 1px solid rgba(28, 100, 242, 0.2);
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
`;

export const StyledSettingsPopout = styled(Popout)<{ isActive: boolean }>`
    padding-top: 16px;
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

    @media only screen and (min-width: 1024px) {
        padding-top: 0px;
    }
`;

export const ToggleSwitch = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    width: 140px;
    height: 40px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;

    @media only screen and (min-width: 768px) {
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
    transition: color ${ANIMATION_DURATION}s ease;
    z-index: 1;
    ${({ selected }) => {
        switch (true) {
            case selected:
                return `
                    color: #1c64f2;
                `;
            default:
                return `
                    color: #ffffff;
                `;
        }
    }}

    @media only screen and (min-width: 768px) {
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
    }
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
    transition: left ${ANIMATION_DURATION}s ease;
    background-color: #ffffff;

    @media only screen and (min-width: 768px) {
        background-color: ${({ theme }) => (theme.theme === Theme.Light ? '#1c64f2' : '#ffffff')};
    }
`;

export const VersionSelector = styled(PopoutOption)`
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    margin-right: 6px;

    @media only screen and (min-width: 375px) {
        margin-right: 32px;
    }
    @media only screen and (min-width: 768px) {
        margin-right: 0;
    }
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
    > a:nth-child(5) {
        transition-delay: ${({ isActive }) => (isActive ? '400ms' : '200ms')};
    }
    > div:nth-child(6) {
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
    transition: opacity ${ANIMATION_DURATION}s ease;
    background: ${({ theme }) =>
        theme.theme === Theme.Light
            ? 'linear-gradient(272.96deg, #9BC2FC -7%, rgba(26, 85, 245, 0) 150%)'
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

export const AppRowButton = styled(StyledLink)`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 100px;
    overflow: hidden;
    background-color: transparent;
    transition: color ${ANIMATION_DURATION}s ease;

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

export const GovernanceButton = styled(StyledLink)`
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
    transition: color ${ANIMATION_DURATION}s ease;

    &:hover > div {
        opacity: 1;
    }

    > svg {
        width: auto;
        height: 19px;
        margin-bottom: 8px;
    }
`;

export const LinkRow = styled(LauncherRow)<{ fullWidthSVG?: boolean }>`
    position: relative;
    padding: 16px;
    border-bottom: none;
    transition: color ${ANIMATION_DURATION}s ease;

    &:hover > div {
        opacity: 1;
    }

    > svg {
        ${({ fullWidthSVG }) =>
            fullWidthSVG
                ? `width: 124px;
                    height: 24px;
                    margin-right: 0;`
                : `width: auto;
                    height: 17px;
                    margin-right: 20px;`};
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
        transition: background-color ${ANIMATION_DURATION}s ease;

        &:hover > div {
            opacity: 1;
        }
    }

    > a svg {
        transition: all ${ANIMATION_DURATION}s ease;
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
