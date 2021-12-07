import React, { useMemo } from 'react';
import { useWeb3, useWeb3Actions } from '@context/Web3Context/Web3Context';
import useEnsName from '@libs/hooks/useEnsName';
import { Logo } from '@components/General';
import { CopyOutlined } from '@ant-design/icons';
import TWPopup from '@components/General/TWPopup';
import Button from '@components/General/Button';
import { classNames } from '@libs/utils/functions';
import TooltipSelector from '@components/Tooltips/TooltipSelector';
import { ARBITRUM } from '@libs/constants';
import Identicon from '@components/Nav/Navbar/Identicon';
import Link from 'next/link';

const ARBISCAN_URI = 'https://arbiscan.io';
// const ADD_TCR_TO_WALLET_LINK = `${ETHERSCAN_URI}/token/0x9c4a4204b79dd291d6b6571c5be8bbcd0622f050`;

export default (({ account, className }) => {
    const { resetOnboard, handleConnect } = useWeb3Actions();
    const ensName = useEnsName(account ?? '');

    return (
        <div className={`${className} relative inline-block text-left`}>
            {!!account ? (
                <AccountDropdownButton account={account} ensName={ensName} logout={resetOnboard} />
            ) : (
                <ConnectWalletButton handleConnect={handleConnect} />
            )}
        </div>
    );
}) as React.FC<{
    account: string;
    className?: string;
}>;

interface ConnectWalletProps {
    handleConnect: () => void;
}

const ConnectWalletButton = ({ handleConnect }: ConnectWalletProps) => {
    return (
        <Button size="sm" variant="transparent" onClick={handleConnect}>
            Connect Wallet
        </Button>
    );
};

interface AccountDropdownButtonProps {
    account: string;
    ensName: string;
    logout: () => void;
}

const AccountDropdownButton = ({ account, ensName, logout }: AccountDropdownButtonProps) => {
    const accountLong = useMemo(() => accountDescriptionLong(account, ensName), [account, ensName]);
    const accountShort = useMemo(() => accountDescriptionShort(account, ensName), [account, ensName]);
    return (
        <TWPopup
            preview={
                <>
                    <WalletIcon />
                    <div className="px-2 m-auto">{accountShort}</div>
                </>
            }
        >
            <div className="py-1">
                <div className="flex px-4 py-2 text-sm w-[180px]">
                    <WalletIcon />
                    <div className="px-2 self-center">{accountLong}</div>
                    <TooltipSelector tooltip={{ content: <>Copy</> }}>
                        <CopyOutlined
                            className="self-center copy"
                            onClick={() => {
                                /* This requires a secure origin, either HTTPS or localhost. */
                                try {
                                    navigator.clipboard.writeText(account);
                                } catch (err) {
                                    console.error('Failed to copy', err);
                                }
                            }}
                        />
                        <style>{`
                            .copy svg {
                                vertical-align: 0;
                            }
                        `}</style>
                    </TooltipSelector>
                </div>
            </div>

            <div className="py-1 px-4 mb-2">
                <ViewOnArbiscanOption account={account} />
                <BridgeFundsOption />
                {/*<AddTCROption />*/}
            </div>

            <div className="py-1">
                <div className="flex justify-center content-center w-full">
                    {/* Disconnect Button */}
                    <button
                        className="rounded-xl shadow-sm px-4 py-2 m-1 bg-blue-600 text-sm font-medium text-white hover:bg-blue-400 focus:bg-blue-900 focus:ring-indigo-500"
                        onClick={logout}
                    >
                        Disconnect
                    </button>
                </div>
            </div>
        </TWPopup>
    );
};

const ViewOnArbiscanOption: React.FC<{
    account: string;
    className?: string;
}> = ({ account, className }) => {
    return (
        <a
            className={classNames(className ?? '', 'flex hover:bg-theme-button-bg-hover')}
            href={`${ARBISCAN_URI}/address/${account}`}
            target="_blank"
            rel="noopener noreferrer"
        >
            <Logo className="inline text-lg my-auto mr-2" ticker={ARBITRUM} />
            <div className="text-sm">View on Arbiscan</div>
        </a>
    );
};

const WalletIcon: React.FC<{
    className?: string;
}> = ({ className }) => {
    const { wallet, account } = useWeb3();

    const IconContent = () => {
        if (wallet?.icons?.iconSrc) {
            return (
                <img
                    className={classNames(className ?? '', 'inline text-lg h-[20px] my-auto')}
                    src={wallet?.icons.iconSrc}
                    alt={wallet?.name ?? ''}
                />
            );
        } else {
            return <Identicon account={account ?? ''} />;
        }
    };

    return <>{IconContent()}</>;
};

const BridgeFundsOption: React.FC<{
    className?: string;
}> = ({ className }) => {
    return (
        <Link href="/bridge">
            <button className={classNames(className ?? '', 'flex hover:bg-theme-button-bg-hover mt-3 text-sm w-full')}>
                <Logo className="inline text-lg my-auto mr-2" ticker={ARBITRUM} />
                Bridge Funds
            </button>
        </Link>
    );
};

// const AddTCROption = styled(({ className }) => {
//     return (
//         <a href={ADD_TCR_TO_WALLET_LINK} target="_blank" rel="noopener noreferrer" className={className}>
//             <PlusOutlined className="inline-flex self-center" style={{ marginLeft: '0.1rem', marginRight: '0.2rem' }} />
//             <span className="ml-2">Add TCR to wallet</span>
//         </a>
//     );
// })``;

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
