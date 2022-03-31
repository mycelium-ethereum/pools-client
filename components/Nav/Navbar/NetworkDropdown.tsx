import React from 'react';
import Icon from '@ant-design/icons';
import { NETWORKS } from '@tracer-protocol/pools-js';
import { Logo, LogoTicker } from '~/components/General';
import TWPopup from '~/components/General/TWPopup';
import { networkConfig } from '~/constants/networks';
import Error from '~/public/img/notifications/error.svg';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';
import { switchNetworks } from '~/utils/rpcMethods';

const option =
    'py-2 px-4 text-sm first:rounded-t-lg last:rounded-b-lg disabled:cursor-not-allowed cursor-pointer transition-all hover:bg-theme-button-bg-hover';

export default (({ className }) => {
    const { provider, network } = useStore(selectWeb3Info);

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
            <option
                className={option}
                value={NETWORKS.ARBITRUM}
                onClick={() => switchNetworks(provider, NETWORKS.ARBITRUM)}
            >
                Arbitrum
            </option>
            <option
                className={option}
                value={NETWORKS.ARBITRUM_RINKEBY}
                onClick={() => switchNetworks(provider, NETWORKS.ARBITRUM_RINKEBY)}
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
