import React from 'react';
import styled from 'styled-components';
import shallow from 'zustand/shallow';
import { GasPriceTooltip } from '~/components/Tooltips';
import { networkConfig } from '~/constants/networks';
import { useGasPrice } from '~/hooks/useGasPrice';
import GasIcon from '~/public/img/general/gas_icon.svg';
import { useStore } from '~/store/main';
import { selectWalletInfo } from '~/store/Web3Slice';

export default (() => {
    const { wallet, network } = useStore(selectWalletInfo, shallow);
    const gasPrice = useGasPrice();
    return (
        <Container>
            <GasPriceTooltip
                network={network ? networkConfig[network]?.name ?? 'Unknown' : 'Unknown'}
                wallet={wallet?.name ?? 'Unknown'}
            >
                <Wrapper>
                    <GasIconStyled />
                    <Text>{gasPrice?.toFixed(3)}</Text>
                </Wrapper>
            </GasPriceTooltip>
        </Container>
    );
}) as React.FC;

const Container = styled.div`
    display: flex;
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
`;

const GasIconStyled = styled(GasIcon)`
    display: inline;
    margin-right: 0.2rem;
    transform: scale(0.7);

    @media (min-width: 640px) {
        margin-right: 0.5rem;
        transform: scale(0.9);
    }
`;

const Text = styled.span`
    font-size: 14px;
    font-weight: 600;

    @media (min-width: 640px) {
        font-size: 18px;
    }
`;
