import React, { useContext, useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { SwapContext } from '@context/SwapContext';
import { CommitActionEnum } from '@libs/constants';
import Gas from './Gas';
import Buy from './Buy';
import Sell from './Sell';
import Divider from '@components/General/Divider';
import TWButtonGroup from '@components/General/TWButtonGroup';
import OnboardModal from '@components/OnboardModal';

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
    const [showOnboardModal, setShowOnboardModal] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowOnboardModal(true);
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="w-full justify-center">
            <div className="bg-theme-background w-full md:w-[611px] md:shadow-xl rounded-3xl py-8 px-4 md:py-8 md:px-12 md:my-8 md:mx-auto ">
                <div className="flex">
                    <TWButtonGroup
                        value={swapState?.commitAction ?? CommitActionEnum.mint}
                        size={'xl'}
                        color={'tracer'}
                        onClick={(val) => {
                            if (swapDispatch) {
                                swapDispatch({ type: 'setAmount', value: new BigNumber(0) });
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

            <OnboardModal showOnboardModal={showOnboardModal} setShowOnboardModal={() => setShowOnboardModal(false)} />
        </div>
    );
}) as React.FC;
