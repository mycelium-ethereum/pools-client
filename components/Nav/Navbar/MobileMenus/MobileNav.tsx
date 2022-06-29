import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { Container } from '~/components/General/Container';
import AccountDropdown from '~/components/Nav/Navbar/AccountDropdown';
import { menuContent } from '~/components/Nav/Navbar/MobileMenus/navContent';
import { NavItem, NavMenu, NavList, ScrollContainer } from '~/components/Nav/Navbar/MobileMenus/styles';
import NetworkDropdown from '~/components/Nav/Navbar/NetworkDropdown';
import SettingsPopout from '~/components/Nav/Navbar/Popouts/SettingsPopout';

const MobileMenu = ({
    account,
    network,
    navMenuOpen,
    handleMenuClose,
}: {
    account: string;
    network: KnownNetwork | undefined;
    navMenuOpen: boolean;
    handleMenuClose: () => void;
}): JSX.Element => {
    const path = useRouter().pathname;

    return (
        <NavMenu isOpen={navMenuOpen}>
            <Container className="relative">
                <NavList>
                    <ScrollContainer>
                        <div>
                            <AccountDropdown account={account ?? ''} className="min-w-[100%]" />
                        </div>
                        {!!network ? <NetworkDropdown className="relative whitespace-nowrap" /> : null}
                        <ul>
                            {menuContent.map((item) => (
                                <NavItem key={item.link} paddingLevel={2} selected={path === item.link}>
                                    <Link href={item.link} passHref>
                                        <a onClick={handleMenuClose}>{item.label}</a>
                                    </Link>
                                </NavItem>
                            ))}
                        </ul>
                    </ScrollContainer>
                    <SettingsPopout isActive={true} />
                </NavList>
            </Container>
        </NavMenu>
    );
};

export default MobileMenu;
