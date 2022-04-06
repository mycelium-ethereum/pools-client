import React, { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { Dialog, Transition } from '@headlessui/react';
import { classNames } from '~/utils/helpers';
import Hamburger from './Hamburger';
import AccountDropdown from '../AccountDropdown';
import NetworkDropdown from '../NetworkDropdown';

import ThemeSwitcher from '../ThemeSwitcher';

export default (({ account, className }) => {
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

    const handleClick = (open: boolean) => {
        const root = document.getElementById('__next');
        if (open) {
            root?.classList.add('overflow-hidden');
        } else {
            root?.classList.remove('overflow-hidden');
        }
        setOpen(open);
    };

    // Close nav after hitting desktop breakpoint
    const handleResize = () => {
        if (window.innerWidth > 1536) {
            setOpen(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const linkStyles = 'w-max text-white my-2 px-5 py-2 rounded-lg cursor-pointer';
    const selectedStyles = 'bg-black bg-opacity-50';

    return (
        <div className={classNames(`relative my-auto ml-4 overflow-hidden 2xl:hidden`, className ?? '')}>
            <Hamburger open={open} setOpen={handleClick} />
            <Transition.Root show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 top-full z-10 overflow-hidden"
                    onClose={() => {
                        // do nothing here since its fired before the hamburger
                        console.debug('Closing mobile nav');
                    }}
                >
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
                                <div className="w-screen">
                                    <div
                                        className={classNames(
                                            'flex h-full flex-col overflow-y-scroll bg-tracer-900 bg-mobile-nav-bg bg-no-repeat p-6 matrix:bg-black matrix:bg-opacity-50 matrix:bg-none matrix:backdrop-blur dark:bg-theme-background',
                                            'aligned-background',
                                        )}
                                    >
                                        <AccountDropdown account={account} className="my-4" />
                                        <NetworkDropdown className="relative my-4 w-full text-center" />
                                        <div
                                            className={classNames(linkStyles, route === '' ? selectedStyles : '')}
                                            onClick={() => handleRoute('/')}
                                        >
                                            <img className="mr-2 inline" src={'/img/general/invest.svg'} alt="Trade" />
                                            Tokens
                                        </div>
                                        <div
                                            className={classNames(linkStyles, route === 'pools' ? selectedStyles : '')}
                                            onClick={() => handleRoute('/pools')}
                                        >
                                            <img className="mr-2 inline" src={'/img/general/browse.svg'} alt="Pools" />
                                            Pools
                                        </div>
                                        <div
                                            className={classNames(
                                                linkStyles,
                                                route.startsWith('stake') ? selectedStyles : '',
                                            )}
                                            onClick={() => handleRoute('/stakepooltoken')}
                                        >
                                            <img className="mr-2 inline" src={'/img/general/stake.svg'} alt="Stake" />
                                            Stake
                                        </div>
                                        <div
                                            className={classNames(
                                                linkStyles,
                                                route.startsWith('bridge') ? selectedStyles : '',
                                            )}
                                            onClick={() => handleRoute('/bridge')}
                                        >
                                            <img className="mr-2 inline" src={'/img/general/bridge.svg'} alt="Bridge" />
                                            Bridge
                                        </div>
                                        <div
                                            className={classNames(
                                                linkStyles,
                                                route.startsWith('portfolio') ? selectedStyles : '',
                                            )}
                                            onClick={() => handleRoute('/portfolio')}
                                        >
                                            <img
                                                className="mr-2 inline"
                                                src={'/img/general/portfolio.svg'}
                                                alt="Portfolio"
                                            />
                                            Portfolio
                                        </div>
                                        <div
                                            className={classNames(
                                                linkStyles,
                                                route.startsWith('trading') ? selectedStyles : '',
                                            )}
                                            onClick={() => handleRoute('/trading-comp')}
                                        >
                                            <img
                                                className="mr-2 inline"
                                                src={'/img/general/trading-comp.svg'}
                                                alt="Trading Comp"
                                            />
                                            Trading Comp
                                        </div>
                                        <div className="absolute left-0 right-0 bottom-4 mx-auto w-min">
                                            <ThemeSwitcher />
                                        </div>
                                    </div>
                                    <style>
                                        {`
                                            .aligned-background {
                                                background-position-y: -60px; 
                                                background-size: 100%;
                                            }
                                        `}
                                    </style>
                                </div>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
}) as React.FC<{
    account: string;
    className?: string;
}>;
