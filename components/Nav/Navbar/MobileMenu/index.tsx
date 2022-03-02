import React, { useState } from 'react';
import Hamburger from './Hamburger';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { classNames } from '@libs/utils/functions';
import NetworkDropdown from '../NetworkDropdown';
import AccountDropdown from '../AccountDropdown';

import { useRouter } from 'next/router';
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

    const linkStyles = 'w-max text-white my-2 px-5 py-2 rounded-lg cursor-pointer';
    const selectedStyles = 'bg-black bg-opacity-50';

    return (
        <div className={classNames(`relative ml-4 my-auto overflow-hidden xl:hidden`, className ?? '')}>
            <Hamburger open={open} setOpen={handleClick} />
            <Transition.Root show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 overflow-hidden top-full z-10"
                    onClose={() => {
                        // do nothing here since its fired before the hamburger
                        console.debug('Closing mobile nav');
                    }}
                >
                    <div className="absolute inset-0 overflow-hidden">
                        <Dialog.Overlay className="absolute inset-0" />

                        <div className="fixed flex bottom-0 top-[60px] right-0 max-w-full xl:hidden">
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
                                            'h-full flex flex-col p-6 bg-tracer-900 dark:bg-theme-background matrix:bg-black matrix:bg-opacity-50 matrix:bg-none matrix:backdrop-blur bg-mobile-nav-bg bg-no-repeat overflow-y-scroll',
                                            'aligned-background',
                                        )}
                                    >
                                        <AccountDropdown account={account} className="my-4" />
                                        <NetworkDropdown className="w-full my-4 relative text-center" />
                                        <div
                                            className={classNames(linkStyles, route === '' ? selectedStyles : '')}
                                            onClick={() => handleRoute('/')}
                                        >
                                            <img className="inline mr-2" src={'/img/general/invest.svg'} alt="Trade" />
                                            Tokens
                                        </div>
                                        <div
                                            className={classNames(linkStyles, route === 'pools' ? selectedStyles : '')}
                                            onClick={() => handleRoute('/pools')}
                                        >
                                            <img className="inline mr-2" src={'/img/general/browse.svg'} alt="Pools" />
                                            Pools
                                        </div>
                                        <div
                                            className={classNames(
                                                linkStyles,
                                                route.startsWith('stake') ? selectedStyles : '',
                                            )}
                                            onClick={() => handleRoute('/stakepooltoken')}
                                        >
                                            <img className="inline mr-2" src={'/img/general/stake.svg'} alt="Stake" />
                                            Stake
                                        </div>
                                        <div
                                            className={classNames(
                                                linkStyles,
                                                route.startsWith('bridge') ? selectedStyles : '',
                                            )}
                                            onClick={() => handleRoute('/bridge')}
                                        >
                                            <img className="inline mr-2" src={'/img/general/bridge.svg'} alt="Bridge" />
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
                                                className="inline mr-2"
                                                src={'/img/general/portfolio.svg'}
                                                alt="Portfolio"
                                            />
                                            Portfolio
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
