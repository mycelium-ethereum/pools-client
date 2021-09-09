import React, { Fragment } from 'react';
import dynamic from 'next/dynamic';
import { API as OnboardApi } from '@tracer-protocol/onboard/dist/src/interfaces';
import styled from 'styled-components';
import { Popover, Transition } from '@headlessui/react';
import ReactTooltip from 'react-tooltip';
import { Logo } from '@components/General';
import { DownOutlined, CopyOutlined, PlusOutlined } from '@ant-design/icons';

const ETHERSCAN_URI = "https://etherscan.io";
const ADD_TCR_TO_WALLET_LINK = `${ETHERSCAN_URI}/token/0x9c4a4204b79dd291d6b6571c5be8bbcd0622f050`;


export default styled(({ account, ensName, logout, handleConnect, network, className }) => {
    return (
            <div className={`${className} relative inline-block text-left`}>
                {(() => {
                    if (!!account) {
                        return (<AccountDropdownButton account={account} ensName={ensName} network={network} logout={logout} />);
                    } else {
                        return (<ConnectWalletButton handleConnect={handleConnect}/>);
                    }
                })()}
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
    margin: auto 1rem;
    margin-left: 0.5rem;
    width: 160px;
`;


const button_className = "inline-flex justify-center w-full rounded-md border-white border-2 shadow-sm px-4 py-2 bg-transparent text-sm font-medium text-white hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500";


interface ConnectWalletProps {
    handleConnect: () => void;
}

const ConnectWalletButton = ({handleConnect}: ConnectWalletProps) => {
    return (
        <button onClick={handleConnect} className={button_className}>Connect Wallet</button>
    );
};


interface AccountDropdownButtonProps {
    account: string;
    ensName: string;
    network: number;
    logout: () => void;
}

const AccountDropdownButton = ({account, ensName, network, logout}: AccountDropdownButtonProps) => {
    return (
        <Popover as="div">
            {({open})=> (
                <>
                    {/* Button */}
                    <Popover.Button className={button_className}>
                        <Identicon account={account} />
                        <div className="px-2">{accountDescriptionShort(account, ensName)}</div>
                        <Arrow className="self-center" style={{transform: open?'rotate(180deg)':''}}/>
                    </Popover.Button>

                    {/* Menu */}
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Popover.Panel className="origin-top-right absolute z-10 right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-200">
                            <div className="py-1">
                                <div className="flex px-4 py-2 text-sm">
                                    <Identicon account={account} />
                                    <div className="px-2 self-center">{accountDescriptionLong(account, ensName)}</div>
                                    <CopyOutlined data-tip="Copied!" data-for='copiedToolTip' data-event="click focus" data-event-off="mouseout" className="self-center" onClick={()=>{
                                        /* This requires a secure origin, either HTTPS or localhost. */
                                        // navigator.clipboard.writeText(account);
                                    }}/>
                                    <ReactTooltip id='copiedToolTip' place="right" type="info" effect="solid" backgroundColor='white' border borderColor='#aaa' textColor='black' globalEventOff='click mousemove' />
                                </div>
                            </div>
                            
                            <div className="py-1 px-4 mb-2">
                                <ViewOnEtherscanOption account={account} />
                                <BridgeFundsOption network={network}/>
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
                        </Popover.Panel >
                    </Transition>
                </>
            )}
        </Popover>
    );
};


const Identicon = dynamic(import('./Identicon'), { ssr: false });


const Arrow = styled(DownOutlined)`
    transition: all 200ms ease-in-out;
    z-index: 11;
    vertical-align: 0;
`;


const ViewOnEtherscanOption = styled(({ account, className }) => {
    return (
        <a className={className} href={`${ETHERSCAN_URI}/address/${account}`} target="_blank" rel="noopener">
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


const AddTCROption = styled(({className}) => {
    return (
        <a href={ADD_TCR_TO_WALLET_LINK} target="_blank" rel="noopener" className={className}>
            <PlusOutlined className="inline-flex self-center" style={{marginLeft: '0.1rem', marginRight: '0.2rem'}} />
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
    return "Account";
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
    return "Account";
};
