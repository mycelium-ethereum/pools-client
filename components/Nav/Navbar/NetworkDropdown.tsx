import React from 'react';
import Icon from '@ant-design/icons';
import styled from 'styled-components';
import shallow from 'zustand/shallow';
import { NETWORKS } from '@tracer-protocol/pools-js';
import { Logo, LogoTicker } from '~/components/General';
import TWPopup from '~/components/General/TWPopup';
import { networkConfig } from '~/constants/networks';
import Error from '~/public/img/notifications/error.svg';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';
import { switchNetworks } from '~/utils/rpcMethods';
import { isSupportedNetwork } from '~/utils/supportedNetworks';

const Option = styled.option`
    padding: 0.5rem 1rem;
    font-size: 14px;
    cursor: pointer;
    text-align: left;

    &:first-child {
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
    }
    &:last-child {
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
    }
    &:disabled {
        cursor: not-allowed;
    }
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;

    &:hover {
        background: ${({ theme }) => theme.button.hover};
    }
`;

export default (({ className }) => {
    const { provider, network } = useStore(selectWeb3Info, shallow);

    return (
        <TWPopup
            className={className}
            preview={
                <NetworkPreview
                    networkID={network?.toString() ?? '0'}
                    networkName={
                        network ? networkConfig[network]?.name ?? 'Unsupported Network' : 'Unsupported Network'
                    }
                    supported={isSupportedNetwork(network)}
                />
            }
        >
            <Option value={NETWORKS.ARBITRUM} onClick={() => switchNetworks(provider, NETWORKS.ARBITRUM)}>
                Arbitrum
            </Option>
            <Option
                value={NETWORKS.ARBITRUM_RINKEBY}
                onClick={() => switchNetworks(provider, NETWORKS.ARBITRUM_RINKEBY)}
            >
                Arbitrum Rinkeby
            </Option>
        </TWPopup>
    );
}) as React.FC<{
    hide?: boolean;
    className?: string;
}>;

const NetworkPreview: React.FC<{
    networkID: string;
    networkName: string;
    supported: boolean;
}> = ({ networkID, networkName, supported }) => {
    return (
        <div className={'my-auto flex w-full items-center'}>
            {supported ? (
                <Logo className={'my-auto ml-0 mr-2 inline'} ticker={networkID as LogoTicker} />
            ) : (
                <Icon
                    className={'my-auto ml-0 mr-2 flex h-[22px] items-center text-lg text-transparent'}
                    component={Error}
                />
            )}

            {networkName}
        </div>
    );
};
