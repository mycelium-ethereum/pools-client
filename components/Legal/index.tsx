import React from 'react';
import NavBar from '@components/Nav';
import Footer from '@components/Footer';
import { useRouter } from 'next/router';
import Link from 'next/link';
import TWPopup from '@components/General/TWPopup';
import { classNames } from '@libs/utils/functions';

const selected = 'opacity-100';
const unselected = 'opacity-60';

export const LegalPageLayout: React.FC = ({ children }) => {
    const route = useRouter().pathname;
    return (
        <div className="page relative">
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
                        <div className={classNames(menuItem, route === '/privacy-policy' ? selected : unselected)}>
                            <Link href="/privacy-policy">Privacy Policy</Link>
                        </div>
                        <div className={classNames(menuItem, route === '/terms-of-use' ? selected : unselected)}>
                            <Link href="/terms-of-use">Terms of Use</Link>
                        </div>
                        <div className={classNames(menuItem, route === '/disclaimer' ? selected : unselected)}>
                            <Link href="/disclaimer">Disclaimer</Link>
                        </div>
                    </div>
                </TWPopup>
            </div>
            <div className="container flex mb-8">
                <div className="flex-col w/20 hidden lg:flex">
                    <div className="my-0 mx-auto">
                        <div className="text-3xl pt-16 pb-3 font-bold">Legal</div>
                        <div className={classNames(menuItem, route === '/privacy-policy' ? selected : unselected)}>
                            <Link href="/privacy-policy">Privacy Policy</Link>
                        </div>
                        <div className={classNames(menuItem, route === '/terms-of-use' ? selected : unselected)}>
                            <Link href="/terms-of-use">Terms of Use</Link>
                        </div>
                        <div className={classNames(menuItem, route === '/disclaimer' ? selected : unselected)}>
                            <Link href="/disclaimer">Disclaimer</Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full px-5 lg:px-0 lg:w/80">
                    <div className="my-0 mx-auto transition-all content">{children}</div>
                    <style>{`
                        .content a {
                            text-decoration: underline;
                            cursor: pointer;
                            color: var(--secondary);
                        }
                        .content a:hover {
                            opacity: 0.8;
                        }
                    `}</style>
                </div>
            </div>
            <Footer />
        </div>
    );
};

const menuItem = 'ml-auto my-1 text-base cursor-pointer whitespace-nowrap no-underline';

export const MainTitle: React.FC = ({ children }) => <div className="text-3xl font-bold pt-16 pb-3">{children}</div>;

export const Title: React.FC = ({ children }) => <div className="mt-6 mb-2 text-xl">{children}</div>;

export const Subtitle: React.FC = ({ children }) => <div className="pb-4 font-bold">{children}</div>;

export const Paragraph: React.FC = ({ children }) => <p className="py-2 max-w-screen-md">{children}</p>;

export const List: React.FC = ({ children }) => (
    <ul className="max-w-screen-md mb-4">
        {children}
        <style>{`
            .list {
                list-style: unset;
                padding-inline-start: 16px;
            }
        `}</style>
    </ul>
);
