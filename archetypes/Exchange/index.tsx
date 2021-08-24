import React, { useEffect, useContext } from 'react';
import SlideSelect, { Option } from '@components/General/SlideSelect';
import { SwapContext } from '@context/SwapContext';
import { MINT, BURN } from '@libs/constants';
import { SideType, TokenType } from '@libs/types/General';
import styled from 'styled-components';
import Gas from './Gas';
import Buy from './Inputs/Buy';
import Sell from './Inputs/Sell';
import { useRouter } from 'next/router';

export default (() => {
    const router = useRouter();
    const { swapState, swapDispatch } = useContext(SwapContext);

    useEffect(() => {
        if (swapDispatch) {
            if (router.query.pool) {
                swapDispatch({ type: 'setSelectedPool', value: router.query.pool as string });
            }
            if (router.query.type) {
                swapDispatch({ type: 'setTokenType', value: parseInt(router.query.type as string) as TokenType });
            }
            if (router.query.side) {
                swapDispatch({ type: 'setSide', value: parseInt(router.query.side as string) as SideType });
            }
        }
    }, [router]);

    return (
        <Content>
            <TradeModal>
                <Header>
                    <SlideSelect
                        value={swapState?.tokenType ?? MINT}
                        onClick={(index, _e) => {
                            if (swapDispatch) {
                                swapDispatch({ type: 'setAmount', value: NaN });
                                swapDispatch({ type: 'setTokenType', value: index as SideType });
                            }
                        }}
                    >
                        <Option>Buy</Option>
                        <Option>Sell</Option>
                    </SlideSelect>
                    <Gas />
                </Header>

                {/** Inputs */}
                {swapState?.tokenType === BURN ? <Sell /> : <Buy />}
            </TradeModal>
        </Content>
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
