import React from 'react';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { NavItem, NavMenu, NavContainer } from '~/components/Nav/Navbar/MobileMenu/styles';
import { useStore } from '~/store/main';
import { selectIsDark } from '~/store/ThemeSlice';

const MobileMenu = ({
    account,
    network,
    className,
    isOpen,
}: {
    account: string;
    network: KnownNetwork | undefined;
    className?: string;
    isOpen: boolean;
}): JSX.Element => {
    const isDark = useStore(selectIsDark);

    return (
        <NavMenu isOpen={isOpen} className={isDark ? 'dark' : ''}>
            <NavContainer>
                <NavItem />
            </NavContainer>
        </NavMenu>
    );
};

export default MobileMenu;
