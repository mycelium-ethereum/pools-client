import React from 'react';
import { SelectOption } from '@components/General/Input';
import { Logo } from '@components/General';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { switchNetworks } from '@libs/utils/rpcMethods';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';
import { ARBITRUM, ARBITRUM_RINKEBY } from '@libs/constants';
import TWPopup from '@components/General/TWPopup';

export default (({ className }) => {
    const { provider, network = '0' } = useWeb3();

    return (
        <TWPopup
            className={className}
            preview={
                <NetworkPreview
                    networkID={network.toString()}
                    networkName={networkConfig[network]?.name ?? 'Unsupported'}
                />
            }
        >
            <SelectOption disabled value={ARBITRUM}>
                Arbitrum (Coming soon)
            </SelectOption>
            <SelectOption value={ARBITRUM_RINKEBY} onClick={() => switchNetworks(provider, ARBITRUM_RINKEBY)}>
                Arbitrum Rinkeby
            </SelectOption>
        </TWPopup>
    );
}) as React.FC<{
    hide?: boolean;
    className?: string;
}>;

const NetworkPreview: React.FC<{
    networkID: string;
    networkName: string;
}> = ({ networkID, networkName }) => {
    return (
        <div className={'flex items-center w-full my-auto'}>
            <Logo className="inline w-[20px] h-[22px] my-auto ml-0 mr-2" ticker={networkID} />
            {networkName}
        </div>
    );
};
