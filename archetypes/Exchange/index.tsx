import React, { useContext } from 'react';
import { SwapContext } from '@context/SwapContext';
import { CommitActionEnum } from '@libs/constants';
import Gas from './Gas';
import Buy from './Buy';
import Sell from './Sell';
import Divider from '@components/General/Divider';
import TWButtonGroup from '@components/General/TWButtonGroup';

const TRADE_OPTIONS = [
    {
        key: CommitActionEnum.mint,
        text: 'Mint',
    },
    {
        key: CommitActionEnum.burn,
        text: 'Burn',
    },
];

export default (() => {
    const { swapState, swapDispatch } = useContext(SwapContext);

    return (
        <div className="w-full justify-center mt-0 md:mt-16">
            <div className="bg-theme-background w-full md:w-[611px] md:shadow-xl rounded-3xl py-8 px-4 md:py-8 md:px-12 md:my-8 md:mx-auto ">
                <div className="flex">
                    <TWButtonGroup
                        value={swapState?.commitAction ?? CommitActionEnum.mint}
                        size={'xl'}
                        color={'tracer'}
                        onClick={(val) => {
                            if (swapDispatch) {
                                swapDispatch({ type: 'setAmount', value: '' });
                                swapDispatch({ type: 'setLeverage', value: 1 });
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
            </div>
        </div>
    );
}) as React.FC;
