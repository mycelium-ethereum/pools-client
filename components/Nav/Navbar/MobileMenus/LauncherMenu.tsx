import React from 'react';
import Link from 'next/link';
import { Container } from '~/components/General/Container';
import { menuContent, socialLinkContent, socialIconContent } from '~/components/Nav/Navbar/MobileMenus/launcherContent';
import {
    NavItem,
    NavList,
    NavMenu,
    SocialIconRow,
    SocialItem,
    LauncherScrollContainer,
    MeshBackground,
} from '~/components/Nav/Navbar/MobileMenus/styles';

const LauncherMenu = ({ launcherMenuOpen }: { launcherMenuOpen: boolean }): JSX.Element => {
    return (
        <NavMenu isOpen={launcherMenuOpen}>
            <Container className="relative">
                <NavList>
                    <LauncherScrollContainer>
                        <ul>
                            {menuContent.map((item) => (
                                <Link key={item.alt} href={item.link}>
                                    <NavItem paddingLevel={3}>
                                        <img src={item.logo} alt={item.alt} />
                                    </NavItem>
                                </Link>
                            ))}
                        </ul>
                        <div>
                            <ul>
                                {socialLinkContent.map((item, i) => (
                                    <SocialItem
                                        key={`social-item-${i}-${item.label}`}
                                        paddingLevel={1}
                                        fullWidthSVG={i === socialLinkContent.length - 1}
                                    >
                                        <a href={item.link} rel="noopener noreferrer" target="_blank">
                                            {item.label ? (
                                                <>
                                                    <item.logo />
                                                    <span>{item.label}</span>
                                                </>
                                            ) : (
                                                <item.logo />
                                            )}
                                        </a>
                                    </SocialItem>
                                ))}
                            </ul>
                            <SocialIconRow>
                                {socialIconContent.map((item) => (
                                    <a key={item.alt} href={item.link} rel="noopener noreferrer" target="_blank">
                                        <item.logo alt={item.alt} />
                                    </a>
                                ))}
                            </SocialIconRow>
                        </div>
                    </LauncherScrollContainer>
                </NavList>
            </Container>
            <MeshBackground />
        </NavMenu>
    );
};

export default LauncherMenu;
