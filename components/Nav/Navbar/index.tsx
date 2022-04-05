import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useStore } from '~/store/main';
import { selectAccount } from '~/store/Web3Slice';

import HeaderSiteSwitcher from './HeaderSiteSwitcher';
import AccountDropdown from './AccountDropdown';
import MobileMenu from './MobileMenu';
import NetworkDropdown from './NetworkDropdown';
import { classNames } from '~/utils/helpers';
import ThemeSwitcher from './ThemeSwitcher';
import VersionToggle from './VersionToggle';

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
    const account = useStore(selectAccount);

    const linkStyles = 'flex transition-all m-2 px-4 py-2 rounded-lg text-base hover:opacity-80 cursor-pointer';
    const selectedStyles = 'bg-tracer-900 dark:bg-black dark:bg-opacity-50';

    return (
        <nav className={`container h-[60px] text-base`}>
            <div className={'flex h-full px-4 md:px-0'}>
                <HeaderSiteSwitcher />
                <ul className="mr-auto ml-4 mb-0 hidden text-sm text-white lg:flex">
                    <Link href="/">
                        <li className={classNames(linkStyles, route === '' ? selectedStyles : '')}>
                            <a id="browse-pools" className="m-auto">
                                Pools
                            </a>
                        </li>
                    </Link>
                    <Link href="/portfolio">
                        <li className={classNames(linkStyles, route.startsWith('portfolio') ? selectedStyles : '')}>
                            <a className="m-auto">Portfolio</a>
                        </li>
                    </Link>
                    <Link href="/trading-comp">
                        <li className={classNames(linkStyles, route.startsWith('trading') ? selectedStyles : '')}>
                            <a className="m-auto">Trading Comp</a>
                        </li>
                    </Link>
                </ul>

                {setShowOnboardModal ? (
                    <div
                        className="my-auto ml-auto cursor-pointer"
                        onClick={() => {
                            setShowOnboardModal(true);
                        }}
                    >
                        <RevisitOnboard />
                    </div>
                ) : null}

                {/* DESKTOP */}
                <span className="hidden 2xl:flex">
                    <VersionToggle pushContentRight={!!setShowOnboardModal} />
                    {account ? <NetworkDropdown className="relative my-auto ml-4 whitespace-nowrap" /> : null}

                    <AccountDropdown account={account ?? ''} className="my-auto mx-4" />

                    <ThemeSwitcher />
                </span>

                <VersionToggle hideOnDesktop pushContentRight={!!setShowOnboardModal} />
                <MobileMenu account={account ?? ''} />
            </div>
        </nav>
    );
};

export default NavBar;
