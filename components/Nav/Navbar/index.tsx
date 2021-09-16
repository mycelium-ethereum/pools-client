import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import ThemeSwitcher from './ThemeSwitcher';
import HeaderSiteSwitcher from './HeaderSiteSwitcher';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import AccountDropdown from './AccountDropdown';
import MobileMenu from './MobileMenu';
import CommitDropdown from './CommitDropdown';
import NetworkDropdown from './NetworkDropdown';
import AccountBalance from './AccountBalance';

const NavBar: React.FC = styled(({ className }) => {
    return (
        <div className={className}>
            <NavBarContent />
        </div>
    );
})`
    background-image: url('/img/nav-bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
`;

const Links = styled.ul`
    display: flex;
    margin-right: auto;
    margin-left: 1rem;
    color: #fff;
    margin-bottom: 0;
    font-size: 14px;

    & li {
        display: flex;
        transition: 0.2s;
    }

    & li.selected {
        text-decoration: underline;
    }

    & li:hover {
        opacity: 0.8;
    }
`;

export const NavBarContent = styled(({ className }) => {
    const routes = useRouter().asPath.split('/');
    const route = routes[1];
    const { account } = useWeb3();

    // controls displaying queued commits
    const [showQueued, setShowQueued] = useState(false);

    const linkStyles = 'mx-2 py-2 px-2';

    return (
        <nav className={`${className} container`}>
            <HeaderSiteSwitcher />
            <Links>
                <li className={linkStyles + (route === '' ? ' selected' : '')}>
                    <Link href="/">
                        <a className="m-auto">Invest</a>
                    </Link>
                </li>
                <li className={linkStyles + (route === 'stake' ? ' selected' : '')}>
                    <Link href="/stake">
                        <a className="m-auto">Stake</a>
                    </Link>
                </li>
            </Links>

            {/* DESKTOP */}
            <span className="hidden lg:flex ml-auto">
                {account ? <NetworkDropdown className="relative my-auto mx-4 whitespace-nowrap" /> : null}

                <AccountDropdown account={account ?? ''} className="my-auto" />

                {/* Hide if showing queued */}
                <AccountBalance hide={showQueued} className="my-auto mx-2" />

                <CommitDropdown hide={!showQueued} setShowQueued={setShowQueued} />
                {/* <ThemeSwitcher /> */}
            </span>

            <MobileMenu account={account ?? ''} />
        </nav>
    );
})`
    display: flex;
    color: var(--color-text);
    height: 60px;

    background-image: url('/img/nav-bg.png');
    background-repeat: no-repeat;
    background-size: cover;

    @media (max-width: 768px) {
        padding: 0 1rem;
    }
    @media (max-width: 1024px) {
        ${ThemeSwitcher}, ${Links} {
            display: none;
        }
    }
`;

export default NavBar;
