import React, { useCallback, useEffect, useState } from 'react';
import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { Dialog, Transition } from '@headlessui/react';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { classNames } from '~/utils/helpers';
import Hamburger from './Hamburger';
import * as Styled from './styles';
import AccountDropdown from '../AccountDropdown';
import NetworkDropdown from '../NetworkDropdown';

import ThemeSwitcher from '../ThemeSwitcher';

export const MobileMenu = ({
    account,
    network,
    className,
}: {
    account: string;
    network: KnownNetwork | undefined;
    className?: string;
}): JSX.Element => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const route = router.asPath.split('/')[1];

    const handleRoute = (route: string) => {
        const root = document.getElementById('__next');
        root?.classList.remove('overflow-hidden');
        router.push({
            pathname: route,
        });
        setOpen(false);
    };

    const handleOpen = useCallback(() => {
        const root = document.getElementById('__next');
        root?.classList.add('overflow-hidden');
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        const root = document.getElementById('__next');
        root?.classList.remove('overflow-hidden');
        setOpen(false);
    }, []);

    // Close nav after hitting desktop breakpoint
    const handleResize = () => {
        if (window.innerWidth > 1280) {
            setOpen(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className={classNames(`relative my-auto ml-4 overflow-hidden xl:hidden`, className ?? '')}>
            <Hamburger open={open} handleOpen={handleOpen} />
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 top-full z-10 overflow-hidden" onClose={handleClose}>
                    <div className="absolute inset-0 overflow-hidden">
                        <Dialog.Overlay className="absolute inset-0" />

                        <div className="fixed bottom-0 top-[60px] right-0 flex max-w-full">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Styled.Menu>
                                    <Styled.MenuContent>
                                        <AccountDropdown account={account} className="my-4" />
                                        {!!network && <NetworkDropdown className="relative my-4 w-full text-center" />}
                                        <Styled.MobileLink selected={route === ''} onClick={() => handleRoute('/')}>
                                            <img className="mr-2 inline" src={'/img/general/browse.svg'} alt="Pools" />
                                            Pools
                                        </Styled.MobileLink>
                                        <Styled.MobileLink
                                            selected={route.startsWith('portfolio')}
                                            onClick={() => handleRoute('/portfolio')}
                                        >
                                            <img
                                                className="mr-2 inline"
                                                src={'/img/general/portfolio.svg'}
                                                alt="Portfolio"
                                            />
                                            Portfolio
                                        </Styled.MobileLink>
                                        <Styled.MobileLink
                                            selected={route.startsWith('trading')}
                                            onClick={() => handleRoute('/trading-comp')}
                                        >
                                            <img
                                                className="mr-2 inline"
                                                src={'/img/general/trading-comp.svg'}
                                                alt="Trading Comp"
                                            />
                                            Trading Comp
                                        </Styled.MobileLink>
                                        <Styled.MobileLink selected={route.startsWith('documentation')}>
                                            <a
                                                href="https://tracer-1.gitbook.io/ppv2-beta-testnet/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="my-auto"
                                            >
                                                <img
                                                    className="mr-2 inline"
                                                    src={'/img/general/browse.svg'}
                                                    alt="Trading Comp"
                                                />
                                                Documentation
                                            </a>
                                        </Styled.MobileLink>
                                        <div className="absolute left-0 right-0 bottom-4 mx-auto w-min">
                                            <ThemeSwitcher />
                                        </div>
                                    </Styled.MenuContent>
                                    <Styled.MenuBackground className="bg-tracer-900 bg-mobile-nav-bg bg-no-repeat matrix:bg-black matrix:bg-opacity-50 matrix:bg-none matrix:backdrop-blur dark:bg-theme-background" />
                                </Styled.Menu>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
};

export default MobileMenu;
