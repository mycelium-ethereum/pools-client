import React, { useMemo } from 'react';
import { useWeb3Actions } from '@context/Web3Context/Web3Context';
import { ARBITRUM } from '@libs/constants';
import useEnsName from '@libs/hooks/useEnsName';
import TooltipSelector from '@components/Tooltips/TooltipSelector';
import Button from '@components/General/Button';
import TWPopup from '@components/General/TWPopup';
import { AccountDropdownButtonProps } from './types';
import * as Styled from './styles';
import WalletIcon from '../WalletIcon';

const ARBISCAN_URI = 'https://arbiscan.io';

export default (({ account, className }) => {
    const { resetOnboard, handleConnect } = useWeb3Actions();
    const ensName = useEnsName(account ?? '');

    return (
        <div className={`${className} relative inline-block text-left`}>
            {!!account ? (
                <AccountDropdownButton account={account} ensName={ensName} logout={resetOnboard} />
            ) : (
                <Button size="sm" variant="transparent" onClick={handleConnect}>
                    Connect Wallet
                </Button>
            )}
        </div>
    );
}) as React.FC<{
    account: string;
    className?: string;
}>;

const AccountDropdownButton = ({ account, ensName, logout }: AccountDropdownButtonProps) => {
    const accountLong = useMemo(() => accountDescriptionLong(account, ensName), [account, ensName]);
    const accountShort = useMemo(() => accountDescriptionShort(account, ensName), [account, ensName]);
    return (
        <TWPopup
            preview={
                <>
                    <WalletIcon />
                    <Styled.Account>{accountShort}</Styled.Account>
                </>
            }
        >
            <Styled.CopyAccount>
                <WalletIcon />
                <Styled.Account>{accountLong}</Styled.Account>
                <TooltipSelector tooltip={{ content: <>Copy</> }}>
                    <Styled.CopyIcon
                        onClick={() => {
                            /* This requires a secure origin, either HTTPS or localhost. */
                            try {
                                navigator.clipboard.writeText(account);
                            } catch (err) {
                                console.error('Failed to copy', err);
                            }
                        }}
                    />
                </TooltipSelector>
            </Styled.CopyAccount>

            <Styled.Options>
                <Styled.ViewOnArbiscanOption
                    href={`${ARBISCAN_URI}/address/${account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Styled.ArbitrumLogo ticker={ARBITRUM} />
                    <div>View on Arbiscan</div>
                </Styled.ViewOnArbiscanOption>
            </Styled.Options>

            <Styled.Logout>
                {/* Disconnect Button */}
                <Styled.LogoutButton onClick={logout}>Disconnect</Styled.LogoutButton>
            </Styled.Logout>
        </TWPopup>
    );
};

const accountDescriptionLong: (account: string, ensName: string) => string = (account, ensName) => {
    if (ensName) {
        const len = ensName.length;
        if (len > 14) {
            return `${ensName.slice(0, 7)}...${ensName.slice(len - 4, len)}`;
        } else {
            return ensName;
        }
    } else if (account) {
        return `${account.slice(0, 7)}...${account.slice(36, 40)}`;
    }
    return 'Account';
};

const accountDescriptionShort: (account: string, ensName: string) => string = (account, ensName) => {
    console.debug(`Found ens name: ${ensName}`);
    if (ensName) {
        const len = ensName.length;
        if (len > 14) {
            return `${ensName.slice(0, 5)}..`;
        } else {
            return ensName;
        }
    } else if (account) {
        return `${account.slice(0, 5)}..`;
    }
    return 'Account';
};
