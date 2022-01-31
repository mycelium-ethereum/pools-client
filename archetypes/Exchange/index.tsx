import React, { useContext } from 'react';
import { noDispatch, SwapContext, swapDefaults, useBigNumber } from '@context/SwapContext';
import { CommitActionEnum, SideEnum } from '@libs/constants';
import Gas from './Gas';
import Inputs from './Inputs';
import Divider from '@components/General/Divider';
import TWButtonGroup from '@components/General/TWButtonGroup';
import ExchangeButton from '@components/General/Button/ExchangeButton';
import Summary from './Summary';
// import FeeNote from './FeeNote';
import { usePool } from '@context/PoolContext';
import useExpectedCommitExecution from '@libs/hooks/useExpectedCommitExecution';
import Close from '/public/img/general/close.svg';
import styled from 'styled-components';

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

export default styled((({ onClose, className }) => {
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useContext(SwapContext);
    const pool = usePool(swapState.selectedPool);
    const receiveIn = useExpectedCommitExecution(pool.lastUpdate, pool.updateInterval, pool.frontRunningInterval);

    const amountBN = useBigNumber(swapState.amount);

    return (
        <div className={className}>
            <Close onClick={onClose} className="close" />
            <h2 className="title">New Commit</h2>

            <div className="header-wrapper">
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

            <Divider className="divider" />

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

            {/* <FeeNote
                poolName={pool.name}
                isMint={swapState.commitAction === CommitActionEnum.mint}
                receiveIn={receiveIn}
            /> */}

            <ExchangeButton onClose={onClose} swapState={swapState} swapDispatch={swapDispatch} />
        </div>
    );
}) as React.FC<{
    onClose: () => void;
    className?: string;
}>)`
    width: 100%;
    justify-content: center;

    .close {
        position: absolute;
        right: 1rem;
        top: 1.6rem;
        width: 0.75rem;
        height: 0.75rem;
        cursor: pointer;
    }

    .title {
        font-weight: 600;
        font-size: 20px;
        color: ${({ theme }) => theme.text};
        margin-bottom: 15px;
    }

    .header-wrapper {
        display: flex;
    }

    .divider {
        margin: 30px 0;
    }

    @media (min-width: 640px) {
        margin-top: 1.7rem;

        .close {
            right: 4rem;
            top: 5rem;
            width: 1rem;
            height: 1rem;
        }

        .title {
            margin-bottom: 20px;
        }
    }
`;
