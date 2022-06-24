import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import shallow from 'zustand/shallow';
import { Container } from '~/components/General/Container';
import Show from '~/components/General/Show';
import { LauncherToggle, SettingsToggle } from '~/components/Nav/Navbar/Buttons';
import { PopoutButtons } from '~/components/Nav/Navbar/Popouts/Buttons';
import TracerNavLogo from '~/components/Nav/Navbar/TracerNavLogo';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';

import { classNames } from '~/utils/helpers';
import AccountDropdown from './AccountDropdown';
import MobileMenu from './MobileMenu';
import NetworkDropdown from './NetworkDropdown';
import HelpIconSVG from '/public/img/general/onboard-revisit.svg';

const NavBar: React.FC<{
    setShowOnboardModal?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowOnboardModal }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [navBackdrop, setNavBackdrop] = useState<boolean>(true);
    const routes = useRouter().asPath.split('/');
    const route = routes[1];
    const { account, network } = useStore(selectWeb3Info, shallow);

    const listItemStyles = 'flex';
    const linkStyles =
        'flex transition-all items-center px-4 py-2 text-base cursor-pointer whitespace-nowrap dark:text-white text-tracer-650';
    const selectedStyles = 'font-bold';

    const handleScroll = (scrollContainer: HTMLDivElement) => {
        if ((!!scrollContainer && scrollContainer.scrollTop >= 1) || window.innerWidth < 1024) {
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

    const handleRoute = () => {
        const root = document.getElementById('__next');
        root?.classList.remove('overflow-hidden');
        setIsOpen(false);
    };

    const handleOpen = useCallback(() => {
        const root = document.getElementById('__next');
        root?.classList.add('overflow-hidden');
        setIsOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        const root = document.getElementById('__next');
        root?.classList.remove('overflow-hidden');
        setIsOpen(false);
    }, []);

    // Close nav after hitting desktop breakpoint
    const handleResize = () => {
        if (window.innerWidth > 1280) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const activeStyles = 'bg-opacity-40 dark:bg-opacity-40';
    const inactiveStyles = 'dark:bg-opacity-0 bg-opacity-0';

    return (
        <>
            <nav
                className={`sticky top-0 left-0 z-50 h-[60px] bg-white text-base backdrop-blur-sm transition-colors duration-300 dark:bg-[#00005E] dark:text-white ${
                    navBackdrop ? activeStyles : inactiveStyles
                }  ${isOpen ? 'text-white' : 'text-tracer-650'}`}
            >
                <Container className={'relative z-10 flex h-full justify-between'}>
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
                                >
                                    <span>Docs</span>
                                </a>
                            </li>
                        </ul>

                        {/* <VersionToggle /> */}
                        <Show.LG display="flex">
                            {!!network ? <NetworkDropdown className="relative my-auto ml-4 whitespace-nowrap" /> : null}
                            <AccountDropdown account={account ?? ''} className="my-auto ml-4" />
                            <PopoutButtons />
                        </Show.LG>
                        <div className="flex lg:hidden">
                            <SettingsToggle
                                onClick={isOpen ? handleClose : handleOpen}
                                isSelected={isOpen}
                                navMenuOpen={isOpen}
                            />
                            <LauncherToggle
                                onClick={isOpen ? handleClose : handleOpen}
                                isSelected={isOpen}
                                navMenuOpen={isOpen}
                            />
                        </div>
                    </div>
                </Container>
                <MobileMenu account={account ?? ''} network={network} isOpen={isOpen} />
            </nav>
            {!isOpen && setShowOnboardModal && <HelpIcon setShowOnboardModal={setShowOnboardModal} />}
        </>
    );
};

const HelpIcon: React.FC<{
    setShowOnboardModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowOnboardModal }) => {
    return (
        <div
            className="fixed bottom-5 right-5 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-tracer-500 lg:right-8 lg:bottom-8"
            onClick={() => {
                setShowOnboardModal(true);
            }}
        >
            <HelpIconSVG />
        </div>
    );
};

export default NavBar;
