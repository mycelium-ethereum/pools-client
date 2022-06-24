import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import shallow from 'zustand/shallow';
import { Container } from '~/components/General/Container';
import Show from '~/components/General/Show';
import { PopoutButtons } from '~/components/Nav/Navbar/Popouts/Buttons';
import TracerNavLogo from '~/components/Nav/Navbar/TracerNavLogo';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';

import { classNames } from '~/utils/helpers';
import AccountDropdown from './AccountDropdown';
// import MobileMenu from './MobileMenu';
import NetworkDropdown from './NetworkDropdown';

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
        'flex transition-all items-center px-4 py-2 text-base cursor-pointer whitespace-nowrap dark:text-white text-tracer-650';
    const selectedStyles = 'font-bold';

    return (
        <nav
            className={`sticky top-0 left-0 z-50 h-[60px] bg-white bg-opacity-20 text-base text-tracer-650 backdrop-blur-md dark:bg-tracer-darkblue dark:bg-opacity-40 dark:text-white`}
        >
            <Container className={'flex h-full justify-between'}>
                <TracerNavLogo />

                <div className="ml-auto flex">
                    <ul className="mr-auto ml-4 mb-0 hidden font-aileron text-sm text-white lg:flex">
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

                    {/* <VersionToggle /> */}
                    <Show.LG display="flex">
                        {!!network ? <NetworkDropdown className="relative my-auto ml-4 whitespace-nowrap" /> : null}
                        <AccountDropdown account={account ?? ''} className="my-auto ml-4" />
                    </Show.LG>
                    <PopoutButtons />
                    {/* <MobileMenu account={account ?? ''} network={network} /> */}
                </div>
            </Container>
        </nav>
    );
};

export default NavBar;
