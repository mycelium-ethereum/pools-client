import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { classNames } from '@libs/utils/functions';

const POOLTOKEN = 0;
const BPT = 1;

const item =
    'inline min-w-[130px] my-auto mx-2 py-1.5 px-3 text-gray-700 rounded-xl transition-all cursor-pointer text-base whitespace-nowrap hover:bg-gray-50 hover:shadow-sm';
const selected = 'bg-white hover:bg-white hover:shadow-none';

// const FarmNav
export default (({ left, right }) => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/stakepooltoken');
        router.prefetch('/stakebpt');
    }, []);

    const handleRoute = (route: number) => {
        switch (route) {
            case POOLTOKEN:
                router.push({
                    pathname: '/stakepooltoken',
                });
                break;
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
        <div className="relative flex w-full h-[60px] text-center bg-tracer-50">
            <div className="absolute left-0 top-0 bottom-0 flex items-center">{left}</div>
            <div className="flex flex-grow justify-center">
                <div
                    onClick={(_e) => handleRoute(POOLTOKEN)}
                    className={classNames(router.pathname === '/stakepooltoken' ? selected : '', item)}
                >
                    Stake Pool Tokens
                </div>
                <div
                    onClick={(_e) => handleRoute(BPT)}
                    className={classNames(router.pathname === '/stakebpt' ? selected : '', item)}
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
