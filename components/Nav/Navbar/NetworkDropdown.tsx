import React from 'react';
import { Logo, LogoTicker } from '@components/General';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { switchNetworks } from '@libs/utils/rpcMethods';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';
import { ARBITRUM, ARBITRUM_RINKEBY } from '@libs/constants';
import TWPopup from '@components/General/TWPopup';

import Icon from '@ant-design/icons';
import Error from '@public/img/notifications/error.svg';

const option =
    'py-2 px-4 text-sm first:rounded-t-lg last:rounded-b-lg disabled:cursor-not-allowed cursor-pointer transition-all hover:bg-theme-button-bg-hover';

export default (({ className }) => {
    const { provider, network } = useWeb3();

    return (
        <TWPopup
            className={className}
            preview={
                <NetworkPreview
                    networkID={network?.toString() ?? '0'}
                    networkName={
                        network ? networkConfig[network]?.name ?? 'Unsupported Network' : 'Unsupported Network'
                    }
                    supported={!!network && !!networkConfig[network]}
                />
            }
        >
            <option className={option} value={ARBITRUM} onClick={() => switchNetworks(provider, ARBITRUM)}>
                Arbitrum
            </option>
            <option
                className={option}
                value={ARBITRUM_RINKEBY}
                onClick={() => switchNetworks(provider, ARBITRUM_RINKEBY)}
            >
                Arbitrum Rinkeby
            </option>
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
        <div className={'flex items-center w-full my-auto'}>
            {supported ? (
                <Logo className={'inline my-auto ml-0 mr-2'} ticker={networkID as LogoTicker} />
            ) : (
                <Icon
                    className={'flex items-center h-[22px] text-lg text-transparent my-auto ml-0 mr-2'}
                    component={Error}
                />
            )}

            {networkName}
        </div>
    );
};
