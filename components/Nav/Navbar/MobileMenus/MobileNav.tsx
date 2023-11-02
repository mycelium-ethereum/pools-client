import React from 'react';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { Container } from '~/components/General/Container';
import AccountDropdown from '~/components/Nav/Navbar/AccountDropdown';
import { NavMenu, NavList, ScrollContainer, MeshBackground } from '~/components/Nav/Navbar/MobileMenus/styles';
import NetworkDropdown from '~/components/Nav/Navbar/NetworkDropdown';

const MobileMenu = ({
    account,
    network,
    navMenuOpen,
}: {
    account: string;
    network: KnownNetwork | undefined;
    navMenuOpen: boolean;
    handleMenuClose: () => void;
}): JSX.Element => {
    return (
        <NavMenu isOpen={navMenuOpen}>
            <Container className="relative">
                <NavList>
                    <ScrollContainer>
                        <div>
                            <AccountDropdown account={account ?? ''} className="min-w-[100%]" />
                        </div>
                        {!!network ? <NetworkDropdown className="relative whitespace-nowrap" /> : null}
                        {/* <ul>
                            {menuContent.map((item) => (
                                <NavItem key={item.link} paddingLevel={2} selected={path === item.link} linkPadding>
                                    <Link href={item.link} passHref>
                                        <a onClick={handleMenuClose}>{item.label}</a>
                                    </Link>
                                </NavItem>
                            ))}
                        </ul> */}
                    </ScrollContainer>
                </NavList>
            </Container>
            <MeshBackground />
        </NavMenu>
    );
};

export default MobileMenu;
