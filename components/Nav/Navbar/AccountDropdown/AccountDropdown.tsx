import React, { useContext, useMemo } from 'react';
import { ethers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
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

export default (({ account, className }) => {
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
                />
            ) : (
                <Button
                    size="sm"
                    variant="transparent"
                    onClick={handleConnect}
                    className={`gradient-button bg-dropdown-gradient mb-4 flex h-[36px] max-h-[36px] items-center rounded-[4px] bg-opacity-0 px-3 transition-colors duration-300 hover:text-white md:mb-0 lg:rounded-[4px] ${
                        navMenuOpen
                            ? 'border-tracer-midblue text-white md:border-white'
                            : 'border-tracer-midblue dark:text-white md:border-tracer-650 xs:text-tracer-650'
                    }`}
                >
                    Connect Wallet
                    <img src="/img/general/wallet.svg" className="ml-2 h-5 w-5 md:hidden" />
                </Button>
            )}
        </div>
    );
}) as React.FC<{
    account: string;
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
                    <Styled.Account>
                        {isAddress(accountParsed) ? truncateMiddleEthAddress(accountParsed) : accountParsed}
                    </Styled.Account>
                </div>
            }
        >
            <Styled.CopyAccount>
                <WalletIcon />
                <Styled.Account>
                    {isAddress(accountParsed) ? truncateMiddleEthAddress(accountParsed) : accountParsed}
                </Styled.Account>
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
