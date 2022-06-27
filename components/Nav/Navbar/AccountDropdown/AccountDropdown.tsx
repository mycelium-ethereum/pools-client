import React, { useContext, useMemo } from 'react';
import { ethers } from 'ethers';
import shallow from 'zustand/shallow';
import { NETWORKS } from '@tracer-protocol/pools-js';
import Button from '~/components/General/Button';
import TWPopup from '~/components/General/TWPopup';
import TooltipSelector from '~/components/Tooltips/TooltipSelector';
import { NavContext } from '~/context/NavContext';
import { selectENSName } from '~/store/ENSSlice';
import { useStore } from '~/store/main';
import { selectOnboardActions } from '~/store/Web3Slice';
import { truncateMiddleEthAddress } from '~/utils/helpers';
import * as Styled from './styles';
import { AccountDropdownButtonProps } from './types';
import WalletIcon from '../WalletIcon';

const ARBISCAN_URI = 'https://arbiscan.io';

export default (({ account, buttonClasses, className }) => {
    const { resetOnboard, handleConnect } = useStore(selectOnboardActions, shallow);
    const ensName = useStore(selectENSName);
    const { navMenuOpen } = useContext(NavContext);

    return (
        <div className={`${className} relative inline-block text-left`}>
            {!!account ? (
                <AccountDropdownButton
                    account={account}
                    ensName={ensName}
                    logout={resetOnboard}
                    navMenuOpen={navMenuOpen}
                    buttonClasses={buttonClasses}
                />
            ) : (
                <Button
                    size="sm"
                    variant="transparent"
                    onClick={handleConnect}
                    className={`mb-4 flex items-center rounded-[7px] bg-opacity-0 px-3 py-2 hover:bg-tracer-650 hover:text-white md:mb-0 lg:min-h-[36px] lg:rounded-[4px] lg:border-tracer-650 ${
                        navMenuOpen
                            ? 'border-white text-white'
                            : 'border-tracer-midblue text-tracer-650 dark:text-white'
                    }`}
                >
                    Connect Wallet
                    <img src="/img/general/wallet.svg" className="ml-2 h-[22px] w-[22px] md:hidden" />
                </Button>
            )}
        </div>
    );
}) as React.FC<{
    account: string;
    buttonClasses?: string;
    className?: string;
}>;

const AccountDropdownButton = ({
    account,
    ensName,
    logout,
    navMenuOpen,
    buttonClasses,
}: AccountDropdownButtonProps) => {
    const accountParsed = useMemo(() => ensName || account || 'Account', [account, ensName]);
    return (
        <TWPopup
            buttonClasses={buttonClasses}
            navMenuOpen={navMenuOpen}
            preview={
                <div className={'my-auto flex w-full items-center'}>
                    <WalletIcon />
                    <Styled.Account>{truncateMiddleEthAddress(accountParsed)}</Styled.Account>
                </div>
            }
        >
            <Styled.CopyAccount>
                <WalletIcon />
                <Styled.Account>{truncateMiddleEthAddress(accountParsed)}</Styled.Account>
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
                    <div className="text-xs">View on Arbiscan</div>
                </Styled.ViewOnArbiscanOption>
            </div>
            <Styled.Logout>
                {/* Disconnect Button */}
                <Styled.LogoutButton onClick={logout}>Disconnect</Styled.LogoutButton>
            </Styled.Logout>
        </TWPopup>
    );
};
