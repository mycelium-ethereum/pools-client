import React, { useEffect, useContext } from 'react';
import { SwapContext } from '@context/SwapContext';
import { SideEnum, CommitActionEnum } from '@libs/constants';
import styled from 'styled-components';
import Gas from './Gas';
import Buy from './Buy';
import Sell from './Sell';
import { useRouter } from 'next/router';
import Divider from '@components/General/Divider';
import TWButtonGroup from '@components/General/TWButtonGroup';

const TRADE_OPTIONS = [
    {
        key: CommitActionEnum.mint,
        text: 'Buy',
    },
    {
        key: CommitActionEnum.burn,
        text: 'Sell',
    },
];

export default (() => {
    const router = useRouter();
    const { swapState, swapDispatch } = useContext(SwapContext);

    useEffect(() => {
        if (swapDispatch) {
            if (router.query.pool) {
                swapDispatch({ type: 'setSelectedPool', value: router.query.pool as string });
            }
            if (router.query.type) {
                swapDispatch({
                    type: 'setCommitAction',
                    value: parseInt(router.query.type as string) as CommitActionEnum,
                });
            }
            if (router.query.side) {
                swapDispatch({ type: 'setSide', value: parseInt(router.query.side as string) as SideEnum });
            }
        }
    }, [router]);

    return (
        <div className="w-full justify-center ">
            <TradeModal>
                <div className="flex">
                    <TWButtonGroup
                        value={swapState?.commitAction ?? CommitActionEnum.mint}
                        size={'xl'}
                        onClick={(val) => {
                            if (swapDispatch) {
                                swapDispatch({ type: 'setAmount', value: NaN });
                                swapDispatch({ type: 'setLeverage', value: 1 })
                                swapDispatch({ type: 'setCommitAction', value: val as CommitActionEnum });
                            }
                        }}
                        options={TRADE_OPTIONS}
                    />
                    <Gas />
                </div>

                <Divider className="my-8" />

                {/** Inputs */}
                {swapState?.commitAction === CommitActionEnum.burn ? <Sell /> : <Buy />}
            </TradeModal>
        </div>
    );
}) as React.FC;

const TradeModal = styled.div`
    background: var(--color-background);
    width: 611px;
    box-shadow: 4px 4px 50px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 2rem 3rem;
    margin: 5vh auto;

    @media (max-width: 611px) {
        width: 100%;
        border-radius: 0;
        box-shadow: 0;
        margin: 0;
        padding: 2rem 1rem;
    }
`;
