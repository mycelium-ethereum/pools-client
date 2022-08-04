import React, { useCallback, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import shallow from 'zustand/shallow';
import { Container } from '~/components/General/Container';
import Hide from '~/components/General/Hide';
import Show from '~/components/General/Show';
import { LauncherToggle } from '~/components/Nav/Navbar/Buttons';
import HamburgerMenu from '~/components/Nav/Navbar/MobileMenus/HamburgerMenu';
import LauncherMenu from '~/components/Nav/Navbar/MobileMenus/LauncherMenu';
import { PopoutButtons } from '~/components/Nav/Navbar/Popouts/Buttons';
import { ANIMATION_DURATION } from '~/components/Nav/Navbar/Popouts/styles';
import TracerNavLogo from '~/components/Nav/Navbar/TracerNavLogo';
import { NavContext, NavContextProvider } from '~/context/NavContext';
import { useStore } from '~/store/main';
import { BreakpointEnum } from '~/store/ThemeSlice/themes';
import { selectWeb3Info } from '~/store/Web3Slice';

import { classNames } from '~/utils/helpers';
import AccountDropdown from './AccountDropdown';
import MobileNav from './MobileMenus/MobileNav';
import NetworkDropdown from './NetworkDropdown';

const NavBar: React.FC = () => {
    return (
        <NavContextProvider>
            <NavBarContent />
        </NavContextProvider>
    );
};

const NavBarContent: React.FC = () => {
    const { navMenuOpen, setNavMenuOpen, launcherMenuOpen, setLauncherMenuOpen } = useContext(NavContext);
    const [navBackdrop, setNavBackdrop] = useState<boolean>(true);
    const routes = useRouter().asPath.split('/');
    const route = routes[routes.length - 2];
    const { account, network } = useStore(selectWeb3Info, shallow);

    const listItemStyles = 'flex';
    const linkStyles =
        'flex transition-all duration-300 items-center px-4 py-2 text-base cursor-pointer whitespace-nowrap dark:text-white text-tracer-650 hover:text-tracer-midblue dark:hover:text-tracer-650';
    const selectedStyles = 'font-bold';

    const handleScroll = (scrollContainer: HTMLDivElement) => {
        if ((!!scrollContainer && scrollContainer.scrollTop >= 1) || window.innerWidth < BreakpointEnum.DesktopSml) {
            setNavBackdrop(true);
        } else {
            setNavBackdrop(false);
        }
    };

    useEffect(() => {
        const scrollContainer = document.getElementById('__next') as HTMLDivElement;
        handleScroll(scrollContainer);
        scrollContainer && scrollContainer.addEventListener('scroll', () => handleScroll(scrollContainer));
        return () => {
            scrollContainer && scrollContainer.removeEventListener('scroll', () => handleScroll(scrollContainer));
        };
    }, [handleScroll]);

    const handleMenuOpen = () => {
        if (launcherMenuOpen) {
            setLauncherMenuOpen(false);
            setTimeout(() => {
                setNavMenuOpen(true);
            }, ANIMATION_DURATION * 1000 * 2); // Double animation time in milliseconds
        } else {
            setLauncherMenuOpen(false);
            setNavMenuOpen(true);
        }
    };

    const handleLauncherOpen = () => {
        if (navMenuOpen) {
            setNavMenuOpen(false);
            setTimeout(() => {
                setLauncherMenuOpen(true);
            }, ANIMATION_DURATION * 1000 * 2);
        } else {
            setNavMenuOpen(false);
            setLauncherMenuOpen(true);
        }
    };

    const handleMenuClose = useCallback(() => {
        setNavMenuOpen(false);
    }, []);

    const handleLauncherClose = useCallback(() => {
        setLauncherMenuOpen(false);
    }, []);

    // Close nav after hitting desktop breakpoint
    const handleResize = () => {
        if (window.innerWidth > BreakpointEnum.DesktopSml) {
            setNavMenuOpen(false);
        }
        if (window.innerWidth > BreakpointEnum.Tablet) {
            setLauncherMenuOpen(false);
        }
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const root = document.getElementById('__next');
        if (navMenuOpen || launcherMenuOpen) {
            root?.classList.add('overflow-hidden');
        } else {
            root?.classList.remove('overflow-hidden');
        }
    }, [navMenuOpen, launcherMenuOpen]);

    const activeStyles = `${
        navMenuOpen || launcherMenuOpen
            ? 'bg-opacity-0'
            : 'bg-opacity-40 dark:bg-opacity-40 bg-white dark:bg-tracer-800'
    }`;
    const inactiveStyles = 'dark:bg-opacity-0 bg-opacity-0';

    return (
        <>
            <nav
                className={`sticky top-0 left-0 z-50 h-[60px] text-base backdrop-blur-sm transition-[background-color] duration-300  dark:text-white ${
                    navBackdrop ? activeStyles : inactiveStyles
                }  ${navMenuOpen || launcherMenuOpen ? 'text-white' : 'text-tracer-650'}`}
            >
                <Container className={'relative z-10 flex h-full justify-between'}>
                    <TracerNavLogo onClick={handleMenuClose} />
                    <div className="ml-auto flex items-center">
                        <ul className="mr-auto ml-4 mb-0 hidden font-aileron text-sm text-white lg:flex">
                            <li className={listItemStyles}>
                                <Link href="/" passHref>
                                    <a
                                        id="buy-tokens"
                                        className={classNames(linkStyles, route === '' ? selectedStyles : '')}
                                    >
                                        Buy
                                    </a>
                                </Link>
                            </li>
                            <li className={listItemStyles}>
                                <Link href="/trade" passHref>
                                    <a
                                        id="browse-pools"
                                        className={classNames(linkStyles, route === 'trade' ? selectedStyles : '')}
                                    >
                                        Trade
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
                                    <a className={classNames(linkStyles, route === 'stake' ? selectedStyles : '')}>
                                        Stake
                                    </a>
                                </Link>
                            </li>
                            <li className={listItemStyles}>
                                <a
                                    href="https://pools.docs.tracer.finance"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={linkStyles}
                                    onClick={handleMenuClose}
                                >
                                    <span>Docs</span>
                                </a>
                            </li>
                        </ul>
                        <div className="flex justify-end">
                            <Show.MD display="flex">
                                {!!network ? (
                                    <NetworkDropdown className="relative my-auto ml-4 whitespace-nowrap" />
                                ) : null}
                                <AccountDropdown account={account ?? ''} className="my-auto ml-4" />
                                <PopoutButtons />
                            </Show.MD>
                            <Hide.LG display="flex">
                                <Hide.MD display="flex">
                                    <LauncherToggle
                                        onClick={launcherMenuOpen ? handleLauncherClose : handleLauncherOpen}
                                        isSelected={launcherMenuOpen}
                                        navMenuOpen={navMenuOpen || launcherMenuOpen}
                                    />
                                </Hide.MD>
                                <HamburgerMenu
                                    onClick={navMenuOpen ? handleMenuClose : handleMenuOpen}
                                    isSelected={navMenuOpen}
                                    navMenuOpen={navMenuOpen || launcherMenuOpen}
                                />
                            </Hide.LG>
                        </div>
                    </div>
                </Container>
            </nav>
            <MobileNav
                account={account ?? ''}
                network={network}
                navMenuOpen={navMenuOpen}
                handleMenuClose={handleMenuClose}
            />
            <LauncherMenu launcherMenuOpen={launcherMenuOpen} />
        </>
    );
};

export default NavBar;
