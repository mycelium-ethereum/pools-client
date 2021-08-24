import SlideSelect, { Option } from '@components/General/SlideSelect';
import { SwapContext, SwapStore } from '@context/SwapContext';
import { MINT, BURN } from '@libs/constants';
import { SideType } from '@libs/types/General';
import React from 'react';
import styled from 'styled-components';
import Gas from './Gas';
import Buy from './Inputs/Buy';
import Sell from './Inputs/Sell';

export default (() => {
    return (
        <SwapStore>
            <Content>
                <TradeModal>
                    {/** Inputs */}
                    <Header>
                        <SwapContext.Consumer>
                            {(value) => (
                                <SlideSelect
                                    value={value.swapState?.tokenType ?? MINT}
                                    onClick={(index, _e) => {
                                        if (value.swapDispatch) {
                                            value.swapDispatch({ type: 'setAmount', value: NaN });
                                            value.swapDispatch({ type: 'setTokenType', value: index as SideType });
                                        }
                                    }}
                                >
                                    <Option>Buy</Option>
                                    <Option>Sell</Option>
                                </SlideSelect>
                            )}
                        </SwapContext.Consumer>
                        <Gas />
                    </Header>

                    {/** Inputs */}
                    <SwapContext.Consumer>
                        {(value) => (value?.swapState?.tokenType === BURN ? <Sell /> : <Buy />)}
                    </SwapContext.Consumer>
                </TradeModal>
            </Content>
        </SwapStore>
    );
}) as React.FC;

const Content = styled.div`
    width: 100%;
    justify-content: center;
`;

const TradeModal = styled.div`
    border: 1px solid var(--color-accent);
    background: var(--color-background);
    width: 500px;
    border-radius: 10px;
    padding: 1rem;
    margin: auto;
`;

const Header = styled.div`
    display: flex;
    ${SlideSelect} {
        width: 100%;
    }
`;
