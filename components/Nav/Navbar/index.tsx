import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import shallow from 'zustand/shallow';
import { Container } from '~/components/General/Container';
import Show from '~/components/General/Show';
import { AppLaunchButton, SettingsButton } from '~/components/Nav/Navbar/Popouts/Buttons';
import TracerNavLogo from '~/components/Nav/Navbar/TracerNavLogo';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';

import { classNames } from '~/utils/helpers';
import AccountDropdown from './AccountDropdown';
import MobileMenu from './MobileMenu';
import NetworkDropdown from './NetworkDropdown';

const NavBar: React.FC<{
    setShowOnboardModal?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowOnboardModal }) => {
    return (
        <div
            className={classNames(
                'sticky top-0 left-0 z-50 h-[60px] w-full bg-tracer-900 bg-mobile-nav-bg bg-cover bg-no-repeat matrix:bg-transparent matrix:bg-none dark:bg-theme-background xl:bg-nav-bg',
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
        <nav className={`h-full text-base`}>
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
                        <AppLaunchButton />
                    </Show.LG>

                    <MobileMenu account={account ?? ''} network={network} />
                </div>
            </Container>
        </nav>
    );
};

export default NavBar;
