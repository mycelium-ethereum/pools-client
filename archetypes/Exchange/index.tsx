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

export default (({ onClose }) => {
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useContext(SwapContext);
    const pool = usePool(swapState.selectedPool);
    const receiveIn = useExpectedCommitExecution(pool.lastUpdate, pool.updateInterval, pool.frontRunningInterval);

    const amountBN = useBigNumber(swapState.amount);

    return (
        <div className="w-full justify-center sm:mt-14">
            <Close onClick={onClose} className="absolute right-4 top-4 sm:right-10 sm:top-10 w-3 h-3 cursor-pointer" />

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

            <ExchangeButton actionType={swapState.commitAction} />
        </div>
    );
}) as React.FC<{
    onClose: () => void;
}>;
