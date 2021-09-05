import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import { API as OnboardApi } from '@tracer-protocol/onboard/dist/src/interfaces';
import { Button, Section } from '@components/General';
import { Menu, MenuItem } from './HeaderDropdown';
import ArbitrumBridge from '@components/ArbitrumBridge';

export default styled(({ account, onboard, ensName, logout, handleConnect, tokenBalance, network, className }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        function handleClickOutside(event: any) {
            const dropdown = document.getElementById('account-dropdown');
            if (dropdown) {
                console.debug('Closing account dropdown');
                if (!dropdown.contains(event.target)) {
                    setOpen(false);
                }
            }
        }
        if (!open) {
            document.removeEventListener('mousedown', handleClickOutside);
        } else {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    return (
        <div className={`${className} ${open ? 'open' : ''}`} id="account-dropdown">
            <MainButton>
                <AccountDropdown
                    className={!open ? 'show-hover' : ''}
                    onClick={() => {
                        if (!!account) {
                            setOpen(true);
                        } else {
                            setOpen(false);
                            handleConnect();
                        }
                    }}
                >
                    <div className="m-auto flex text-sm font-bold">
                        <Identicon account={account ?? ''} />
                        <div className="px-2">{buttonContent(account, ensName)}</div>
                    </div>
                </AccountDropdown>
            </MainButton>

            <StyledMenu>
                <StyledMenuItem />
                <StyledMenuItem>
                    <Section className="p-0" label="Balance">
                        {`${parseFloat(tokenBalance.toFixed(5))} ETH`}
                    </Section>
                    <Section label="Network">{networkName(network)}</Section>
                </StyledMenuItem>
                <StyledMenuItem>
                    <ArbitrumBridge />
                </StyledMenuItem>
                <StyledMenuItem className="button-container">
                    <StyledButton onClick={() => onboard?.walletSelect()}>Switch Wallets</StyledButton>
                    <StyledButton
                        onClick={() => {
                            setOpen(false);
                            logout();
                        }}
                    >
                        Logout
                    </StyledButton>
                </StyledMenuItem>
            </StyledMenu>
        </div>
    );
})<{
    account: string | undefined;
    ensName: string;
    onboard: OnboardApi | undefined;
    logout: () => void;
    handleConnect: () => void;
    network: number;
    tokenBalance: number;
}>`
    position: relative;
    display: flex;
    align-items: center;
`;

function networkName(id: any) {
    switch (Number(id)) {
        case 1:
            return 'main';
        case 3:
            return 'ropsten';
        case 4:
            return 'rinkeby';
        case 5:
            return 'goerli';
        case 6:
            return 'kotti';
        case 42:
            return 'kovan';
        case 421611:
            return 'arbitrum';
        default:
            return 'localhost';
    }
}

const buttonContent: (account: string | undefined, ensName: string) => string = (account, ensName) => {
    if (!account) {
        return 'Connect Wallet';
    }
    if (ensName) {
        const len = ensName.length;
        if (len > 14) {
            return `${ensName.slice(0, 7)}...${ensName.slice(len - 4, len)}`;
        } else {
            return ensName;
        }
    } else if (account) {
        return `${account.slice(0, 7)}...${account.slice(36, 40)}`;
    } else {
        return 'Connect Wallet';
    }
};

const Identicon = dynamic(import('./Identicon'), { ssr: false });

const AccountDropdown = styled.button`
    display: flex;
    width: 160px;
    height: 40px;
    transition: 0.2s;
    padding: 0 10px;
    margin: auto 10px;
    border: 1px solid #ffffff;
    border-radius: 7px;
    color: #fff;
    background: transparent;

    &:focus {
        outline: none;
    }

    &.show-hover:hover {
        background: var(--color-primary);
    }
`;

const MainButton = styled.div`
    z-index: 11;
`;

const StyledMenu = styled(Menu)`
    text-align: center;
    padding: 1rem !important;
    right: -2rem !important;
    font-size: var(--font-size-small);
    color: #fff;

    ${Section} > .label {
        color: #3da8f5;
    }

    // when parent is open
    .open & {
        opacity: 1;
        transform: none;
    }
`;
const StyledMenuItem = styled(MenuItem)`
    border-bottom: 1px solid #3da8f5;
    // when parent is open
    .open & {
        opacity: 1;
        padding-left: 0;

        &:nth-child(2) {
            transition: all 400ms ease 300ms;
            padding-top: 0.2rem;
            padding-bottom: 0.2rem;
        }
        &:nth-child(3) {
            transition: all 400ms ease 450ms;
        }
        &:last-child {
            display: flex;
            padding: 1rem 0 0 0 !important;
        }
    }
`;

const StyledButton = styled(Button)`
    width: 45%;
    height: var(--height-extra-small-button);
    line-height: var(--height-extra-small-button);
    font-size: var(--font-size-extra-small);
    padding: 0;
    color: #3da8f5;
    border: 1px solid #3da8f5;

    &:hover {
        color: #fff;
        background: #3da8f5;
    }
`;
