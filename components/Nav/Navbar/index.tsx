import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import HeaderSiteSwitcher from './HeaderSiteSwitcher';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import AccountDropdown from './AccountDropdown';
import MobileMenu from './MobileMenu';
import CommitDropdown from './CommitDropdown';
import NetworkDropdown from './NetworkDropdown';
import AccountBalance from './AccountBalance';
import { classNames } from '@libs/utils/functions';
import ThemeSwitcher from './ThemeSwitcher';

import RevisitOnboard from '/public/img/general/onboard-revisit.svg';

const NavBar: React.FC<{
    setShowOnboardModal?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowOnboardModal }) => {
    return (
        <div
            className={classNames(
                'relative bg-tracer-900 matrix:bg-transparent matrix:bg-none dark:bg-theme-background bg-mobile-nav-bg bg-cover lg:bg-nav-bg bg-no-repeat',
            )}
        >
            <NavBarContent setShowOnboardModal={setShowOnboardModal} />
            <style>{`
                background-position-x:
            `}</style>
        </div>
    );
};

export const NavBarContent: React.FC<{
    setShowOnboardModal?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowOnboardModal }) => {
    const routes = useRouter().asPath.split('/');
    const route = routes[1];
    const { account } = useWeb3();

    // controls displaying queued commits
    const [showQueued, setShowQueued] = useState(false);

    const linkStyles = 'flex transition-all mx-2 py-2 px-2 text-base hover:opacity-80';

    return (
        <nav className={`container text-base h-[60px]`}>
            <div className={'flex h-full px-4 md:px-0'}>
                <HeaderSiteSwitcher />
                <ul className="hidden md:flex mr-auto ml-4 mb-0 text-white text-sm ">
                    <li className={classNames(linkStyles, route === '' || route === 'browse' ? 'underline' : '')}>
                        <Link href="/">
                            <a className="m-auto">Trade</a>
                        </Link>
                    </li>
                    <li className={classNames(linkStyles, route.startsWith('stake') ? ' underline' : '')}>
                        <Link href="/stakepooltoken">
                            <a className="m-auto">Stake</a>
                        </Link>
                    </li>
                </ul>

                {setShowOnboardModal ? (
                    <div
                        className="ml-auto my-auto cursor-pointer"
                        onClick={() => {
                            setShowOnboardModal(true);
                        }}
                    >
                        <RevisitOnboard />
                    </div>
                ) : null}

                {/* DESKTOP */}
                <span className="hidden lg:flex">
                    {account ? <NetworkDropdown className="relative my-auto ml-4 whitespace-nowrap" /> : null}

                    <AccountDropdown account={account ?? ''} className="my-auto ml-4" />

                    {/* Hide if showing queued */}
                    <AccountBalance hide={showQueued} className="my-auto mx-2" />

                    <CommitDropdown hide={!showQueued} setShowQueued={setShowQueued} />
                    <ThemeSwitcher />
                </span>
                <MobileMenu account={account ?? ''} />
            </div>
        </nav>
    );
};

export default NavBar;
