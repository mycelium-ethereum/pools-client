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
import Divider from '@components/General/Divider';

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

                <Divider />

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
    background: var(--color-background);
    width: 611px;
    box-shadow: 4px 4px 50px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 71px 65px;
    margin: 5vh auto;

    @media (max-width: 611px) {
        width: 100%;
        border-radius: 0;
        box-shadow: 0;
        margin: 0;
        padding: 2rem 1rem;
    }

    ${Divider} {
        margin: 2.5rem 0;
    }
`;

const Header = styled.div`
    display: flex;
    ${SlideSelect} {
        width: 330px;
        height: 50px;
        border-radius: 7px;
        border: none;
        margin: 0 auto 0 0;
        background: #f0f0ff;
    }
`;
