import React, { useMemo } from 'react';
import { ethers } from 'ethers';
import shallow from 'zustand/shallow';
import { NETWORKS } from '@tracer-protocol/pools-js';
import Button from '~/components/General/Button';
import TWPopup from '~/components/General/TWPopup';
import TooltipSelector from '~/components/Tooltips/TooltipSelector';
import useEnsName from '~/hooks/useEnsName';
import { useStore } from '~/store/main';
import { selectOnboardActions } from '~/store/Web3Slice';
import * as Styled from './styles';
import { AccountDropdownButtonProps } from './types';
import WalletIcon from '../WalletIcon';

const ARBISCAN_URI = 'https://arbiscan.io';

export default (({ account, className }) => {
    const { resetOnboard, handleConnect } = useStore(selectOnboardActions, shallow);
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
    const accountParsed = useMemo(() => ensName || account || 'Account', [account, ensName]);
    return (
        <TWPopup
            preview={
                <div className={'my-auto flex w-full items-center'}>
                    <WalletIcon />
                    <Styled.Account>{accountParsed}</Styled.Account>
                </div>
            }
        >
            <Styled.CopyAccount>
                <WalletIcon />
                <Styled.Account>{accountParsed}</Styled.Account>
                <TooltipSelector tooltip={{ content: <>Copy</> }}>
                    <Styled.CopyIcon
                        onClick={() => {
                            /* This requires a secure origin, either HTTPS or localhost. */
                            try {
                                navigator.clipboard.writeText(ethers.utils.getAddress(account));
                            } catch (err) {
                                console.error('Failed to copy', err);
                            }
                        }}
                    />
                </TooltipSelector>
            </Styled.CopyAccount>
            <div>
                <Styled.ViewOnArbiscanOption
                    href={`${ARBISCAN_URI}/address/${account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Styled.ArbitrumLogo ticker={NETWORKS.ARBITRUM} />
                    <div>View on Arbiscan</div>
                </Styled.ViewOnArbiscanOption>
            </div>
            <Styled.Logout>
                {/* Disconnect Button */}
                <Styled.LogoutButton onClick={logout}>Disconnect</Styled.LogoutButton>
            </Styled.Logout>
        </TWPopup>
    );
};
