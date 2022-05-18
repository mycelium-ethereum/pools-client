import React from 'react';
import styled from 'styled-components';
import { NETWORKS } from '@tracer-protocol/pools-js';
import { useWeb3 } from '@context/Web3Context/Web3Context';

export const NetworkHintContainer = styled.div`
    position: relative;
    width: fit-content;
`;

const StyledNetworkHint = styled.div`
    position: absolute;
    background: #3535dc;
    color: #fff;
    font-size: 13px;
    padding: 0.25rem;
    top: 0;
    left: calc(100% + 1rem);
    line-height: 150%;
    border-radius: 3px;
    white-space: nowrap;
`;

const getHint = (network: string | undefined): string => {
    switch (network) {
        case NETWORKS.ARBITRUM_RINKEBY:
            return 'V1 TESTNET';
        default:
            return 'V1';
    }
};

export const NetworkHint = (): JSX.Element => {
    const { network } = useWeb3();

    const hint = getHint(network);

    return <>{!!hint && <StyledNetworkHint>{hint}</StyledNetworkHint>}</>;
};

export default NetworkHint;
