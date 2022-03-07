import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import NavBar from '@components/Nav';
import Footer from '@components/Footer';
import * as Styled from './styles';

const LegalPageLayout: React.FC = ({ children }) => {
    const route = useRouter().pathname;
    return (
        <div className="page relative matrix:bg-theme-background">
            <NavBar />
            <div className="container">
                <div>
                    <Styled.LegalDropdown
                        buttonClasses={
                            'w-full p-3 bg-theme-button-bg whitespace-nowrap rounded-xl border border-theme-border focus:border-solid focus:outline-none focus:bg-theme-button-bg-hover hover:bg-theme-button-bg-hover'
                        }
                        preview={
                            route === '/privacy-policy'
                                ? 'Privacy Policy'
                                : route === '/terms-of-use'
                                ? 'Terms of Use'
                                : 'Disclaimer'
                        }
                    >
                        <div className="p-3">
                            <Styled.MenuItem selected={route === '/privacy-policy'}>
                                <Link href="/privacy-policy">Privacy Policy</Link>
                            </Styled.MenuItem>
                            <Styled.MenuItem selected={route === '/terms-of-use'}>
                                <Link href="/terms-of-use">Terms of Use</Link>
                            </Styled.MenuItem>
                            <Styled.MenuItem selected={route === '/disclaimer'}>
                                <Link href="/disclaimer">Disclaimer</Link>
                            </Styled.MenuItem>
                        </div>
                    </Styled.LegalDropdown>
                </div>
            </div>
            <Styled.Desktop className="container">
                <Styled.DesktopHeader>
                    <Styled.HeaderTitle>Legal</Styled.HeaderTitle>
                    <Styled.MenuItem selected={route === '/privacy-policy'}>
                        <Link href="/privacy-policy">Privacy Policy</Link>
                    </Styled.MenuItem>
                    <Styled.MenuItem selected={route === '/terms-of-use'}>
                        <Link href="/terms-of-use">Terms of Use</Link>
                    </Styled.MenuItem>
                    <Styled.MenuItem selected={route === '/disclaimer'}>
                        <Link href="/disclaimer">Disclaimer</Link>
                    </Styled.MenuItem>
                </Styled.DesktopHeader>
                <Styled.MainContentWrap>
                    <Styled.MainContent>{children}</Styled.MainContent>
                </Styled.MainContentWrap>
            </Styled.Desktop>
            <Footer />
        </div>
    );
};

export default LegalPageLayout;
