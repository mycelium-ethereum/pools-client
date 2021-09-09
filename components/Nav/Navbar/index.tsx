import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import ThemeSwitcher from './ThemeSwitcher';
// @ts-ignore
import ENS, { getEnsAddress } from '@ensdomains/ensjs';
import HeaderSiteSwitcher from './HeaderSiteSwitcher';
import { useWeb3, useWeb3Actions } from '@context/Web3Context/Web3Context';
import AccountDropdown from './AccountDropdown';
import MobileMenu from './MobileMenu';
import CommitDropdown, { QueuedDropdown } from './CommitDropdown';
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
    const { account, network, ethBalance } = useWeb3();

    const { onboard, resetOnboard, handleConnect } = useWeb3Actions();

    // controls displaying queued commits
    const [showQueued, setShowQueued] = useState(false);

    const ensName = useEnsName(account ?? '');

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
                <li className={linkStyles + (route === 'strategise' ? ' selected' : '')}>
                    <Link href="/">
                        <a className="m-auto">Stake</a>
                    </Link>
                </li>
            </Links>

            <NetworkDropdown show={!!account} />

            <AccountDropdown
                onboard={onboard}
                account={account}
                ensName={ensName}
                network={network ?? 0}
                tokenBalance={ethBalance ?? 0}
                logout={resetOnboard}
                handleConnect={handleConnect}
            />

            {/* Hide if showing queued */}
            <AccountBalance show={!showQueued && !!account} />

            <CommitDropdown show={showQueued} setShowQueued={setShowQueued} />

            {/* <ThemeSwitcher /> */}

            <MobileMenu />

            {/** TODO this will need to change to Arbritrum network id */}
            {/* {process.env.NEXT_PUBLIC_DEPLOYMENT !== 'DEVELOPMENT' ? (
                <UnknownNetwork display={network !== 421611 && !!network} />
            ) : null} */}
        </nav>
    );
})`
    display: flex;
    color: var(--color-text);
    height: 60px;

    background-image: url('/img/nav-bg.png');
    background-repeat: no-repeat;
    background-size: cover;

    ${MobileMenu} {
        display: none;
    }

    @media (max-width: 768px) {
        padding: 0 1rem;
    }
    @media (max-width: 1024px) {
        ${AccountDropdown}, ${ThemeSwitcher}, ${Links}, ${QueuedDropdown}, ${AccountBalance} {
            display: none;
        }
        ${MobileMenu} {
            display: block;
        }
    }
`;

export default NavBar;

const useEnsName = (account: string) => {
    const [ensName, setEnsName] = useState(account);
    const [ens, setEns] = useState(undefined);
    const { provider } = useWeb3();

    useEffect(() => {
        if (provider) {
            const ens = new ENS({ provider, ensAddress: getEnsAddress('1') });
            setEns(ens);
        }
    }, [provider]);

    useEffect(() => {
        if (!!ens && !!account) {
            const getEns = async () => {
                try {
                    const name = await (ens as ENS).getName(account);
                    if (name.name) {
                        setEnsName(name.name);
                    }
                } catch (err) {
                    console.error('Failed to fetch ens name', err);
                }
            };
            getEns();
        }
    }, [ens, account]);

    return ensName;
};
