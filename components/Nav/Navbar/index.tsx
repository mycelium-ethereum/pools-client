import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import shallow from 'zustand/shallow';
import { Container } from '~/components/General/Container';
import Show from '~/components/General/Show';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';

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
        <>
            <div
                className={classNames(
                    'relative bg-tracer-900 bg-mobile-nav-bg bg-cover bg-no-repeat matrix:bg-transparent matrix:bg-none dark:bg-theme-background xl:bg-nav-bg',
                )}
            >
                <NavBarContent />
            </div>
            {setShowOnboardModal && <HelpIcon setShowOnboardModal={setShowOnboardModal} />}
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
            <RevisitOnboard />
        </div>
    );
};

export const NavBarContent: React.FC = () => {
    const routes = useRouter().asPath.split('/');
    const route = routes[1];
    const { account, network } = useStore(selectWeb3Info, shallow);

    const listItemStyles = 'flex';
    const linkStyles =
        'flex transition-all items-center m-2 px-4 py-2 rounded-lg text-base hover:opacity-80 cursor-pointer whitespace-nowrap';
    const selectedStyles = 'bg-tracer-900 dark:bg-black dark:bg-opacity-50';

    return (
        <nav className={`h-[60px] text-base`}>
            <Container className={'flex h-full'}>
                <HeaderSiteSwitcher />
                <ul className="mr-auto ml-4 mb-0 hidden text-sm text-white xl:flex">
                    <li className={listItemStyles}>
                        <Link href="/" passHref>
                            <a id="buy-tokens" className={classNames(linkStyles, route === '' ? selectedStyles : '')}>
                                Buy
                            </a>
                        </Link>
                    </li>
                    <li className={listItemStyles}>
                        <Link href="/pools" passHref>
                            <a
                                id="browse-pools"
                                className={classNames(linkStyles, route === 'pools' ? selectedStyles : '')}
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
                            <span>Documentation</span>
                        </a>
                    </li>
                </ul>
                <div className="ml-auto flex">
                    <VersionToggle />

                    <Show.LG display="flex">
                        {!!network ? <NetworkDropdown className="relative my-auto ml-4 whitespace-nowrap" /> : null}
                    </Show.LG>
                    <Show.MD display="flex">
                        <AccountDropdown account={account ?? ''} className="my-auto mx-4" />
                    </Show.MD>

                    <Show.LG display="flex">
                        <ThemeSwitcher />
                    </Show.LG>

                    <MobileMenu account={account ?? ''} network={network} />
                </div>
            </Container>
        </nav>
    );
};

export default NavBar;
