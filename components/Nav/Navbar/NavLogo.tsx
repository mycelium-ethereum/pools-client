import React from 'react';
import Link from 'next/link';
import PoolsLogo from '/public/img/logos/mycelium/mycelium_pools.svg';

const NavLogo: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <Link href="http://mycelium.xyz" passHref>
            <a className="flex items-center" onClick={onClick}>
                <button className="cursor-pointer">
                    <PoolsLogo className="h-auto w-full max-w-[202px]" alt="mycelium-logo" />
                </button>
            </a>
        </Link>
    );
};

export default NavLogo;
