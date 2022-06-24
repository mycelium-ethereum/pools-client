import React from 'react';
import Link from 'next/link';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { Container } from '~/components/General/Container';
import { menuContent } from '~/components/Nav/Navbar/MobileMenu/menuContent';
import { NavItem, NavMenu, NavList } from '~/components/Nav/Navbar/MobileMenu/styles';
import { useStore } from '~/store/main';
import { selectIsDark } from '~/store/ThemeSlice';
import { useRouter } from 'next/router';

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
    const path = useRouter().pathname;

    return (
        <NavMenu isOpen={isOpen} className={isDark ? 'dark' : ''}>
            <Container className="relative">
                <NavList>
                    {menuContent.map((item, index) => (
                        <Link key={index} href={item.link}>
                            <NavItem selected={path === item.link}>{item.label}</NavItem>
                        </Link>
                    ))}
                </NavList>
            </Container>
        </NavMenu>
    );
};

export default MobileMenu;
