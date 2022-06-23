import React from 'react';
import Link from 'next/link';
import PoolsLogo from '/public/img/logos/tracer/tracer_perpetual_pools.svg';

const TracerNavLogo: React.FC = () => {
    return (
        <Link href="/" passHref>
            <a className="flex items-center">
                <button className="my-auto cursor-pointer">
                    <PoolsLogo className="hidden h-auto w-[202px] md:block" alt="tracer-logo" />
                    <img
                        className="block h-auto w-12 md:hidden"
                        src={'/img/logos/tracer/tracer_no_text.svg'}
                        alt="Tracer Logo"
                    />
                </button>
            </a>
        </Link>
    );
};

export default TracerNavLogo;
