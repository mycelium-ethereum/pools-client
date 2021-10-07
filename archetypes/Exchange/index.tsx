import React, { useContext, useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { SwapContext } from '@context/SwapContext';
import { CommitActionEnum } from '@libs/constants';
import Gas from './Gas';
import Buy from './Buy';
import Sell from './Sell';
import Divider from '@components/General/Divider';
import TWButtonGroup from '@components/General/TWButtonGroup';
import { TWModal } from '@components/General/TWModal';

import Close from '/public/img/general/close.svg';

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
            <TWModal open={showOnboardModal} onClose={() => setShowOnboardModal(false)}>
                <div className="w-3 h-3 ml-auto cursor-pointer" onClick={() => setShowOnboardModal(false)}>
                    <Close />
                </div>
                <div className="border-b-0.5 border-gray-500" />
                <div>
                    The <b>Rebalancing Rate</b> is function of collateral skew in the pool. It can result in a polarised
                    leverage effect at rebalance. The Rebalancing Rate is calculated as (long side collateral/short side
                    collateral) - 1.
                </div>
                <br />
                <div>
                    If the <b>Rebalancing Rate = 0</b>, there is an equal amount of collateral held in the long and
                    short side of the pool. At rebalance, the winning side{`'`}s gains are neither amplified or reduced.
                </div>
                <br />
                <div>
                    If the <b>Rebalancing Rate {'>'} 0</b>, there is more collateral held in the long side of the pool.
                    At rebalance, the short side&apos;s gains are effectively amplified relative to their losses.
                    Conversely, the long side&apos;s gains are effectively reduced.
                </div>
                <br />
                <div>
                    If the <b>Rebalancing Rate {'<'} 0</b>, there is more collateral held in the short side of the pool.
                    At rebalance, the short side&apos;s gains are effectively reduced relative to their losses.
                    Conversely, the long side&apos;s gains are effectively amplified.
                </div>
            </TWModal>
        </div>
    );
}) as React.FC;
