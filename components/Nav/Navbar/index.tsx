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
        padding: 0 20px;
    }

    & li.selected {
        // color: #37b1f6;
        text-decoration: underline;
    }

    & li:hover {
        color: #37b1f6;
    }

    & li .trade-toggle {
        display: none;
    }

    & li.selected .trade-toggle {
        display: flex;
        margin: auto 20px;
        border: 1px solid var(--color-primary);
        border-radius: 20px;
    }

    & li.selected .trade-toggle div {
        width: 100px;
        text-align: center;
        transition: 0.2s;

        &:hover {
            cursor: pointer;
        }
    }

    & li.selected .trade-toggle div.selected {
        color: var(--color-background);
        background-color: var(--color-primary);
        border-radius: 20px;
    }
`;

export const NavBarContent = styled(({ className }) => {
    const routes = useRouter().asPath.split('/');
    const route = routes[1];
    const { account, network, ethBalance } = useWeb3();

    const { onboard, resetOnboard, handleConnect } = useWeb3Actions();

    const ensName = useEnsName(account ?? '');

    const linkStyles = 'mx-2 py-2';

    return (
        <nav className={`${className} container`}>
            <HeaderSiteSwitcher />
            <Links>
                <li className={linkStyles + (route === '' ? ' selected' : '')}>
                    <Link href="/">
                        <a className="m-auto">Trade</a>
                    </Link>
                </li>
                <li className={linkStyles + (route === 'strategise' ? ' selected' : '')}>
                    <Link href="/">
                        <a className="m-auto">Strategise</a>
                    </Link>
                </li>
                <li className={linkStyles + (route === 'portfolio' ? ' selected' : '')}>
                    <Link href="/">
                        <a className="m-auto">Portfolio</a>
                    </Link>
                </li>
            </Links>

            <NetworkDropdown />

            <AccountDropdown
                onboard={onboard}
                account={account}
                ensName={ensName}
                network={network ?? 0}
                tokenBalance={ethBalance ?? 0}
                logout={resetOnboard}
                handleConnect={handleConnect}
            />

            <AccountBalance />

            <CommitDropdown />

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
    @media (max-width: 1127px) {
        ${AccountDropdown}, ${ThemeSwitcher}, ${NetworkDropdown}, ${Links}, ${QueuedDropdown} {
            display: none;
        }
        ${MobileMenu} {
            display: block;
        }
    }
`;

export default NavBar;

// const NetworkButton = styled.span`
//     border: 1px solid #fff;
//     transition: 0.3s;
//     border-radius: 20px;
//     padding: 0 10px;
//     &:hover {
//         cursor: pointer;
//         background: #fff;
//         color: #f15025;
//     }
// `;

// type UNProps = {
//     display: boolean;
//     className?: string;
// };
// const UnknownNetwork: React.FC<UNProps> = styled(({ className }: UNProps) => {
//     // TODO add an onclick to swap to arbritrum using
//     // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
//     return (
//         <div className={className}>
//             You are connected to the wrong network. Switch to{' '}
//             <NetworkButton onClick={() => switchNetworks()}>Arbitrum Testnet.</NetworkButton>
//         </div>
//     );
// })`
//     background: #f15025;
//     color: var(--color-text);
//     letter-spacing: -0.36px;
//     height: 40px;
//     line-height: 40px;
//     font-size: var(--font-size-medium);
//     width: 100%;
//     position: absolute;
//     left: 0;
//     text-align: center;
//     bottom: ${(props) => (props.display ? '-40px' : '0px')};
//     opacity: ${(props) => (props.display ? '1' : '0')};
//     z-index: ${(props) => (props.display ? '2' : '-1')};
//     transition: ${(props) =>
//         props.display ? 'bottom 0.3s, opacity 0.3s 0.1s' : 'bottom 0.3s 0.15s, opacity 0.3s, z-index 0.3s 0.3s'};
// `;

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
