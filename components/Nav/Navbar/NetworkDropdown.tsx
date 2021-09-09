import React from 'react';
import { Select, SelectOption } from '@components/General/Input';
import { Logo } from '@components/General';
import styled from 'styled-components';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { switchNetworks } from '@libs/utils/rpcMethods';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';
import { ARBITRUM, KOVAN } from '@libs/constants';

export default styled(({ className }) => {
    const { provider, network = '0' } = useWeb3();
    return (
        <Select
            className={className}
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
})`
    border: 1px solid #ffffff;
    box-sizing: border-box;
    border-radius: 7px;
    background: transparent;
    margin: auto 1rem;
    width: 158px;
    height: 2.625rem;

    & svg {
        fill: #fff;
    }
`;

const NetworkPreview: React.FC<{
    networkID: string;
    networkName: string;
}> = ({ networkID, networkName }) => {
    return (
        <div className={'flex'}>
            <Logo className="inline w-[20px] h-[22px] my-auto ml-0 mr-2" ticker={networkID} />
            {networkName}
        </div>
    );
};
