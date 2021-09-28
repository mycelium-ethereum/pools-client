import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { classNames } from '@libs/utils/functions';

const EXCHANGE = 0;
const BROWSE = 1;

const item =
    'inline w-[120px] my-auto mx-2 py-1.5 text-theme-text-secondary rounded-xl transition-all cursor-pointer text-base hover:shadow-sm hover:bg-theme-background-secondary';
const selected = 'bg-theme-background-secondary hover:shadow-none';
const unselected = '';

// const InvestNav
export default (({ left, right }) => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/browse');
        router.prefetch('/');
    }, []);

    const handleRoute = (route: number) => {
        switch (route) {
            case BROWSE:
                router.push({
                    pathname: '/browse',
                });
                break;
            case EXCHANGE:
                router.push({
                    pathname: '/',
                });
                break;
            default:
                // nada
                break;
        }
    };

    return (
        <div className="relative flex w-full h-[60px] text-center bg-theme-background-nav-secondary">
            <div className="absolute left-0 top-0 bottom-0 flex items-center">{left}</div>
            <div className="flex flex-grow justify-center">
                <div
                    className={classNames(router.pathname === '/' ? selected : unselected, item)}
                    onClick={(_e) => handleRoute(EXCHANGE)}
                >
                    Exchange
                </div>
                <div
                    className={classNames(router.pathname === '/browse' ? selected : unselected, item)}
                    onClick={(_e) => handleRoute(BROWSE)}
                >
                    Browse
                </div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 flex items-center">{right}</div>
        </div>
    );
}) as React.FC<{
    left?: JSX.Element;
    right?: JSX.Element;
}>;
