import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styled from 'styled-components';
import shallow from 'zustand/shallow';
import { Container } from '~/components/General/Container';
import Show from '~/components/General/Show';
import TracerNavLogo from '~/components/Nav/Navbar/TracerNavLogo';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';

import AccountDropdown from './AccountDropdown';
import MobileMenu from './MobileMenu';
import NetworkDropdown from './NetworkDropdown';
import { classNames } from '~/utils/helpers';
// import ThemeSwitcher from './ThemeSwitcher';
// import VersionToggle from './VersionToggle';
import SettingsSVG from '/public/img/general/settings.svg';

import RevisitOnboard from '/public/img/general/onboard-revisit.svg';

const NavBar: React.FC<{
    setShowOnboardModal?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowOnboardModal }) => {
    return (
        <div
            className={classNames(
                'relative bg-tracer-900 bg-mobile-nav-bg bg-cover bg-no-repeat matrix:bg-transparent matrix:bg-none dark:bg-theme-background xl:bg-nav-bg',
            )}
        >
            <NavBarContent setShowOnboardModal={setShowOnboardModal} />
        </div>
    );
};

export const NavBarContent: React.FC<{
    setShowOnboardModal?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowOnboardModal }) => {
    const routes = useRouter().asPath.split('/');
    const route = routes[1];
    const { account, network } = useStore(selectWeb3Info, shallow);

    const listItemStyles = 'flex';
    const linkStyles = 'flex transition-all items-center px-4 py-2 text-base cursor-pointer whitespace-nowrap';
    const selectedStyles = 'font-bold';

    return (
        <nav className={`h-[60px] text-base`}>
            <Container className={'flex h-full justify-between'}>
                <TracerNavLogo />

                <div className="ml-auto flex items-center">
                    <ul className="mr-auto ml-4 mb-0 hidden font-aileron text-sm text-white xl:flex">
                        <li className={listItemStyles}>
                            <Link href="/" passHref>
                                <a
                                    id="browse-pools"
                                    className={classNames(linkStyles, route === '' ? selectedStyles : '')}
                                >
                                    Pools
                                </a>
                            </Link>
                        </li>
                        <li className={listItemStyles}>
                            <Link href="/portfolio" passHref>
                                <a className={classNames(linkStyles, route === 'portfolio' ? selectedStyles : '')}>
                                    Portfolio
                                </a>
                            </Link>
                        </li>
                        <li className={listItemStyles}>
                            <Link href="/stake" passHref>
                                <a className={classNames(linkStyles, route === 'stake' ? selectedStyles : '')}>Stake</a>
                            </Link>
                        </li>
                        <li className={listItemStyles}>
                            <a
                                href="https://pools.docs.tracer.finance"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={linkStyles}
                            >
                                <span>Docs</span>
                            </a>
                        </li>
                    </ul>

                    {/* <VersionToggle /> */}
                    <Show.LG display="flex">
                        {!!network ? <NetworkDropdown className="relative my-auto ml-4 whitespace-nowrap" /> : null}
                    </Show.LG>
                    <Show.MD display="flex">
                        <AccountDropdown account={account ?? ''} className="my-auto ml-4" />
                    </Show.MD>
                    <SettingsButton />
                    <Show.LG display="flex">
                        {/* <ThemeSwitcher /> */}
                        <AppLaunchButton />
                    </Show.LG>

                    <MobileMenu account={account ?? ''} network={network} />
                </div>
            </Container>
        </nav>
    );
};

export const AppLaunchButton: React.FC = () => {
    return (
        <AppLaunchNavButton>
            <CubeGrid>
                {Array.from({ length: 9 }).map((_, i) => (
                    <Cube key={i} />
                ))}
            </CubeGrid>
        </AppLaunchNavButton>
    );
};

export const SettingsButton: React.FC = () => {
    return (
        <PopoutContainer>
            <SettingsNavButton>
                <SettingsSVG alt="Settings icon" />
            </SettingsNavButton>
            <SettingsPopout />
        </PopoutContainer>
    );
};

export const SettingsPopout: React.FC = () => {
    const [v2selected, setV2Selected] = React.useState(false);

    const handleSwitch = () => {
        setV2Selected(!v2selected);
    };

    return (
        <Popout>
            <VersionSelector>
                <PopoutText>Version Selector</PopoutText>
                <ToggleSwitch onClick={handleSwitch}>
                    <SwitchOption selected={!v2selected}>V1</SwitchOption>
                    <SwitchOption selected={v2selected}>V2</SwitchOption>
                    <Slider isSwitchedOn={v2selected} />
                </ToggleSwitch>
            </VersionSelector>
        </Popout>
    );
};

const NavButton = styled.button`
    border: 1px solid #1c64f2;
    display: flex;
    height: 36px;
    width: 41px;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    background-color: #fff;
    transition: background-color 0.3s ease-in-out;
    margin-left: 16px;
    color: #1c64f2;
    &:hover {
        background-color: #1c64f2;
        color: #fff;
    }
`;

const AppLaunchNavButton = styled(NavButton)`
    &:hover span > span {
        background-color: #fff;
    }
`;

const SettingsNavButton = styled(NavButton)`
    > svg {
        transition: color 0.3s ease;
    }
`;

const CubeGrid = styled.span`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-gap: 4px;
`;

const Cube = styled.span`
    height: 4px;
    width: 4px;
    background-color: #1c64f2;
    transition: background-color 0.3s ease-in-out;
`;

const PopoutContainer = styled.div`
    position: relative;
`;

const Popout = styled.div`
    position: absolute;
    top: 50px;
    right: 0;
    z-index: 50;
    display: flex;
    flex-direction: column;
    font-family: 'Aileron', sans-serif;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    > div {
        /* transform: translate(-16px, -16px); */
        /* opacity: 0; */
    }
    /* Active */
    &.active > div {
        transform: translate(0, 0);
        opacity: 1;
        transition-property: all;
    }
    &.active > div:nth-child(1) {
        transition-delay: 100ms;
    }
    &.active > div:nth-child(2) {
        transition-delay: 200ms;
    }
    &.active > div:nth-child(3) {
        transition-delay: 300ms;
    }

    /* Inactive */
    > div:nth-child(1) {
        transition-delay: 300ms;
    }
    > div:nth-child(2) {
        transition-delay: 200ms;
    }
    > div:nth-child(3) {
        transition-delay: 100ms;
    }
`;

const PopoutText = styled.span`
    color: #1c64f2;
    font-size: 16px;
    line-height: 24px;
`;

const ToggleSwitch = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    width: 140px;
    height: 40px;
    border: thin solid rgba(28, 100, 242, 0.2);
    border-radius: 4px;
`;

const SwitchOption = styled.span<{ selected: boolean }>`
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

const Slider = styled.span<{ isSwitchedOn: boolean }>`
    position: absolute;
    top: 50%;
    left: ${({ isSwitchedOn }) => (isSwitchedOn ? '70px' : '1px')};
    transform: translateY(-50%);
    display: flex;
    width: 68px;
    height: 36px;
    border-radius: 3px;
    z-index: 0;
    background-color: #1c64f2;
    transition: left 0.3s ease;
`;

const PopoutOption = styled.div<{ borderBottom?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    width: 320px;
    height: 72px;
    background: linear-gradient(97.74deg, rgba(28, 100, 242, 0.1) -59.53%, rgba(28, 100, 242, 0) 74.27%), #ffffff;
    border: ${({ borderBottom }) => (borderBottom ? '1px solid rgba(28, 100, 242, 0.2)' : 'none')};
`;
const VersionSelector = styled(PopoutOption)`
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
`;

export default NavBar;
