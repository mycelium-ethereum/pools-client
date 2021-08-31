import React, { useReducer } from 'react';
import TracerModal from '@components/General/TracerModal';
import DirectionSelect from './DirectionSelect';
import SlideSelect, { Option } from '@components/General/SlideSelect';
import styled from 'styled-components';
import { Button } from '@components/General';
import { TokenType } from '@libs/types/General';
import { bridgeReducer, USDC, ETH_ARB, BridgeState } from './state';

// ArbitrumBridge
export default (() => {
    const [state, dispatch] = useReducer(bridgeReducer, {
        amount: 0,
        selectedToken: USDC,
        open: true,
        direction: ETH_ARB,
    } as BridgeState);
    return (
        <>
            <a onClick={() => dispatch({ type: 'setOpen', value: true })}>Bridge</a>
            <TracerModal
                title={'Bridge Funds to Arbitrum'}
                // subTitle={'Tracer runs on Arbitrum'}
                show={state.open}
                loading={false}
                onClose={() => {
                    dispatch({ type: 'setOpen', value: false });
                }}
            >
                <DirectionSelect
                    direction={state.direction}
                    setDirection={(direction) => dispatch({ type: 'setDirection', direction: direction })}
                />

                <Section>
                    <SlideSelect
                        onClick={(token) => dispatch({ type: 'setSelectedToken', token: token as TokenType })}
                        value={state.selectedToken}
                    >
                        <Option>USDC</Option>
                        <Option>ETH</Option>
                    </SlideSelect>
                </Section>

                <Section></Section>

                <BridgeButton>{`Bridge ${state.selectedToken === USDC ? 'USDC' : 'ETH'}`}</BridgeButton>
            </TracerModal>
        </>
    );
}) as React.FC;

const Section = styled.div``;

const BridgeButton = styled(Button)``;
