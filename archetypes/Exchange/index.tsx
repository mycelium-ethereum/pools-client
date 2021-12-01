import React, { useContext } from 'react';
import { noDispatch, SwapContext, swapDefaults, useBigNumber } from '@context/SwapContext';
import { CommitActionEnum, SideEnum } from '@libs/constants';
import Gas from './Gas';
import Inputs from './Inputs';
import Divider from '@components/General/Divider';
import TWButtonGroup from '@components/General/TWButtonGroup';
import ExchangeButton from '@components/General/Button/ExchangeButton';
import Summary from './Summary';
import FeeNote from './FeeNote';
import { usePool } from '@context/PoolContext';
import useExpectedCommitExecution from '@libs/hooks/useExpectedCommitExecution';

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
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useContext(SwapContext);
    const pool = usePool(swapState.selectedPool);
    const receiveIn = useExpectedCommitExecution(pool.lastUpdate, pool.updateInterval, pool.frontRunningInterval);

    const amountBN = useBigNumber(swapState.amount);

    return (
        <div className="w-full justify-center sm:mt-14">
            <div className="bg-theme-background w-full md:w-[611px] md:shadow-xl sm:rounded-3xl py-8 px-4 md:py-8 md:px-12 md:my-8 md:mx-auto ">
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
                <Inputs pool={pool} swapDispatch={swapDispatch} swapState={swapState} />

                <Summary
                    pool={pool}
                    showBreakdown={!swapState.invalidAmount.isInvalid}
                    isLong={swapState.side === SideEnum.long}
                    amount={amountBN}
                    receiveIn={receiveIn}
                    isMint={swapState.commitAction === CommitActionEnum.mint}
                />

                <FeeNote
                    poolName={pool.name}
                    isMint={swapState.commitAction === CommitActionEnum.mint}
                    receiveIn={receiveIn}
                />

                <ExchangeButton actionType={CommitActionEnum.burn} />
            </div>
        </div>
    );
}) as React.FC;
