import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { Container } from '~/components/General/Container';
import AccountDropdown from '~/components/Nav/Navbar/AccountDropdown';
import { menuContent } from '~/components/Nav/Navbar/MobileMenu/menuContent';
import { NavItem, NavMenu, NavList } from '~/components/Nav/Navbar/MobileMenu/styles';
import NetworkDropdown from '~/components/Nav/Navbar/NetworkDropdown';
import SettingsPopout from '~/components/Nav/Navbar/Popouts/SettingsPopout';

const MobileMenu = ({
    account,
    network,
    navMenuOpen,
}: {
    account: string;
    network: KnownNetwork | undefined;
    navMenuOpen: boolean;
}): JSX.Element => {
    const path = useRouter().pathname;
    const dropdownStyles = 'border-tracer-400 border px-3 py-2 rounded-[7px] flex items-center';

    return (
        <NavMenu isOpen={navMenuOpen}>
            <Container className="relative">
                <NavList>
                    <div>
                        <AccountDropdown
                            account={account ?? ''}
                            className="min-w-[100%]"
                            buttonClasses={dropdownStyles}
                        />
                        {!!network ? (
                            <NetworkDropdown className="relative whitespace-nowrap" buttonClasses={dropdownStyles} />
                        ) : null}
                    </div>
                    <ul>
                        {menuContent.map((item, index) => (
                            <Link key={index} href={item.link}>
                                <NavItem selected={path === item.link}>{item.label}</NavItem>
                            </Link>
                        ))}
                    </ul>
                    <SettingsPopout isActive={true} />
                </NavList>
            </Container>
        </NavMenu>
    );
};

export default MobileMenu;
