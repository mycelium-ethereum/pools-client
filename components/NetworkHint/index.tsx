import React from 'react';
import styled from 'styled-components';
import { NETWORKS } from '@tracer-protocol/pools-js';
import { useStore } from '~/store/main';
import { selectNetwork } from '~/store/Web3Slice';

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
    right: -100%;
    line-height: 150%;
    border-radius: 3px;
`;

const getHint = (network: string | undefined): string => {
    switch (network) {
        case NETWORKS.ARBITRUM_RINKEBY:
            return 'TESTNET';
        default:
            return '';
    }
};

export const NetworkHint = (): JSX.Element => {
    const network = useStore(selectNetwork);

    const hint = getHint(network);

    return <>{!!hint && <StyledNetworkHint>{hint}</StyledNetworkHint>}</>;
};

export default NetworkHint;
