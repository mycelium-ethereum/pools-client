import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { classNames } from '~/utils/helpers';

const BPT = 1;

const item =
    'inline min-w-[130px] my-auto mx-2 py-1.5 px-3 text-theme-text-secondary rounded-xl transition-all cursor-pointer text-base hover:shadow-sm hover:bg-theme-background-secondary';
const selected = 'bg-theme-background-secondary hover:shadow-none';
const unselected = '';

// const FarmNav
export default (({ left, right }) => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/stakebpt');
    }, []);

    const handleRoute = (route: number) => {
        switch (route) {
            case BPT:
                router.push({
                    pathname: '/stakebpt',
                });
                break;
            default:
                // nada
                break;
        }
    };

    return (
        <div className="relative flex w-full bg-theme-background-nav-secondary py-2 text-center matrix:bg-transparent">
            <div className="absolute left-0 top-0 bottom-0 flex items-center">{left}</div>
            <div className="flex flex-grow justify-center">
                <div
                    onClick={(_e) => handleRoute(BPT)}
                    className={classNames(router.pathname === '/stakebpt' ? selected : unselected, item)}
                >
                    Stake BPT
                </div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 flex items-center">{right}</div>
        </div>
    );
}) as React.FC<{
    left?: JSX.Element;
    right?: JSX.Element;
}>;
