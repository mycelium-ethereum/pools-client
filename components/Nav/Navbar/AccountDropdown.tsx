import React from 'react';
import dynamic from 'next/dynamic';
import { useWeb3, useWeb3Actions } from '@context/Web3Context/Web3Context';
import useEnsName from '@libs/hooks/useEnsName';
import styled from 'styled-components';
// @ts-ignore
import ReactSimpleTooltip from 'react-simple-tooltip';
import { Logo } from '@components/General';
import { CopyOutlined, PlusOutlined } from '@ant-design/icons';
import TWPopup from '@components/General/TWPopup';
import Button from '@components/General/Button';

const ETHERSCAN_URI = 'https://etherscan.io';
const ADD_TCR_TO_WALLET_LINK = `${ETHERSCAN_URI}/token/0x9c4a4204b79dd291d6b6571c5be8bbcd0622f050`;

export default (({ account, className }) => {
    const { network } = useWeb3();
    const { resetOnboard, handleConnect } = useWeb3Actions();
    const ensName = useEnsName(account ?? '');
    
    return (
        <div className={`${className} relative inline-block text-left my-auto`}>
            {(() => {
                if (!!account) {
                    return (
                        <AccountDropdownButton account={account} ensName={ensName} network={network ?? 0} logout={resetOnboard} />
                    );
                } else {
                    return <ConnectWalletButton handleConnect={handleConnect} />;
                }
            })()}
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
    network: number;
    logout: () => void;
}

const AccountDropdownButton = ({ account, ensName, network, logout }: AccountDropdownButtonProps) => {
    return (
        <TWPopup
            preview={
                <>
                    <Identicon account={account} />
                    <div className="px-2 m-auto">{accountDescriptionShort(account, ensName)}</div>
                </>
            }
        >
            <div className="py-1">
                <div className="flex px-4 py-2 text-sm">
                    <Identicon account={account} />
                    <div className="px-2 self-center">{accountDescriptionLong(account, ensName)}</div>
                    <ReactSimpleTooltip
                        content="Copied"
                        arrow={6}
                        background="#f9fafb"
                        border="rgba(209, 213, 219)"
                        color="#000"
                        customCss={{
                            whiteSpace: 'nowrap',
                        }}
                        fadeDuration={300}
                        fadeEasing="linear"
                        fixed={false}
                        fontSize="12px"
                        padding={8}
                        radius={6}
                        placement="top"
                        zIndex={1}
                    >
                        <CopyOutlined
                            className="self-center icon"
                            onClick={() => {
                                /* This requires a secure origin, either HTTPS or localhost. */
                                // navigator.clipboard.writeText(account);
                            }}
                        />
                        <style>{`
                            svg {
                                vertical-align: 0;
                            }
                        `}</style>
                    </ReactSimpleTooltip>
                </div>
            </div>

            <div className="py-1 px-4 mb-2">
                <ViewOnEtherscanOption account={account} />
                <BridgeFundsOption network={network} />
                <AddTCROption />
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

const Identicon = dynamic(import('./Identicon'), { ssr: false });

const ViewOnEtherscanOption = styled(({ account, className }) => {
    return (
        <a className={className} href={`${ETHERSCAN_URI}/address/${account}`} target="_blank" rel="noopener noreferrer">
            <Logo ticker="ETHERSCAN" />
            <div>View on Etherscan</div>
        </a>
    );
})`
    display: flex;
    line-height: 2.625rem;
    ${Logo} {
        display: inline;
        vertical-align: 0;
        width: 20px;
        height: 22px;
        margin: auto 0.5rem auto 0;
    }
`;

const BridgeFundsOption = styled(({ network, className }) => {
    return (
        <a className={className} href={`#`}>
            <Logo ticker={network} />
            <div>Bridge Funds</div>
        </a>
    );
})`
    display: flex;
    line-height: 2.625rem;
    ${Logo} {
        display: inline;
        vertical-align: 0;
        width: 20px;
        height: 22px;
        margin: auto 0.5rem auto 0;
    }
`;

const AddTCROption = styled(({ className }) => {
    return (
        <a href={ADD_TCR_TO_WALLET_LINK} target="_blank" rel="noopener noreferrer" className={className}>
            <PlusOutlined className="inline-flex self-center" style={{ marginLeft: '0.1rem', marginRight: '0.2rem' }} />
            <span className="ml-2">Add TCR to wallet</span>
        </a>
    );
})``;

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
