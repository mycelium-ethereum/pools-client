import React from 'react';
import { Select, SelectOption } from '@components/General/Input';
import { Logo } from '@components/General';
import styled from 'styled-components';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { switchNetworks } from '@libs/utils/rpcMethods';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';
import { ARBITRUM_RINKEBY, KOVAN } from '@libs/constants';

export default styled(({ className }) => {
    const { provider, network = '0' } = useWeb3();
    return (
        <Select
            className={className}
            preview={<NetworkPreview networkID={network} networkName={networkConfig[network]?.name ?? 'Unknown'} />}
            onChange={(event: any) => {
                switchNetworks(provider, event.target.value);
            }}
        >
            <SelectOption value={ARBITRUM_RINKEBY}>Arbitrum</SelectOption>
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

const NetworkPreview = styled(({ networkID, networkName, className }) => {
    return (
        <div className={className}>
            <Logo ticker={networkID} />
            {networkName}
        </div>
    );
})`
    color: #fff;
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
