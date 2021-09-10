import React from 'react';
import { Select, SelectOption } from '@components/General/Input';
import { Logo } from '@components/General';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { switchNetworks } from '@libs/utils/rpcMethods';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';
import { ARBITRUM, KOVAN } from '@libs/constants';
import { classNames } from '@libs/utils/functions';

export default (({ show }) => {
    const { provider, network = '0' } = useWeb3();
    return (
        <Select
            className={classNames(!show ? 'hidden' : 'hidden lg:block', 'my-auto mx-4 w-[165px]')}
            preview={
                <NetworkPreview
                    networkID={network.toString()}
                    networkName={networkConfig[network]?.name ?? 'Unknown'}
                />
            }
            onChange={(event: any) => {
                switchNetworks(provider, event.target.value);
            }}
        >
            <SelectOption value={ARBITRUM}>Arbitrum</SelectOption>
            <SelectOption value={KOVAN}>Kovan</SelectOption>
        </Select>
    );
}) as React.FC<{
    show: boolean;
}>;

const NetworkPreview: React.FC<{
    networkID: string;
    networkName: string;
}> = ({ networkID, networkName }) => {
    return (
        <div className={'flex items-center'}>
            <Logo className="inline w-[20px] h-[22px] my-auto ml-0 mr-2" ticker={networkID} />
            {networkName}
        </div>
    );
};
