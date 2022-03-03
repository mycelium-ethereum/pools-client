import React from 'react';
import NavBar from '@components/Nav';
import Footer from '@components/Footer';
import { useRouter } from 'next/router';
import Link from 'next/link';
import TWPopup from '@components/General/TWPopup';
import * as Styled from './styles';

const LegalPageLayout: React.FC = ({ children }) => {
    const route = useRouter().pathname;
    return (
        <div className="page relative matrix:bg-theme-background">
            <NavBar />
            <div className="container">
                <TWPopup
                    className={'mt-6 ml-4 mr-auto w-[175px] text-left text-theme-text relative block lg:hidden'}
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
                </TWPopup>
            </div>
            <div className="container flex mb-8">
                <div className="flex-col w/20 hidden lg:flex">
                    <div className="my-0 mx-auto">
                        <div className="text-3xl pt-16 pb-3 font-bold">Legal</div>
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
                </div>
                <div className="flex flex-col w-full px-5 lg:px-0 lg:w/80">
                    <Styled.MainContent>{children}</Styled.MainContent>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LegalPageLayout;
