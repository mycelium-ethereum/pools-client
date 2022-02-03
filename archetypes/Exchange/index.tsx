import React, { useContext } from 'react';
import { noDispatch, SwapContext, swapDefaults, useBigNumber } from '@context/SwapContext';
import { CommitActionEnum, SideEnum } from '@libs/constants';
import Gas from './Gas';
import Inputs from './Inputs';
import Divider from '@components/General/Divider';
import TWButtonGroup from '@components/General/TWButtonGroup';
import ExchangeButton from '@components/General/Button/ExchangeButton';
import Summary from './Summary';
import { usePool } from '@context/PoolContext';
import useExpectedCommitExecution from '@libs/hooks/useExpectedCommitExecution';
import CloseIcon from '/public/img/general/close.svg';
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
            <Title>New Commit</Title>

            <Header>
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
            </Header>

            <DividerRow />

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

            <ExchangeButton onClose={onClose} swapState={swapState} swapDispatch={swapDispatch} />
        </div>
    );
}) as React.FC<{
    onClose: () => void;
    className?: string;
}>)`
    width: 100%;
    justify-content: center;

    @media (min-width: 640px) {
        margin-top: 1.7rem;
    }
`;

const Title = styled.h2`
    font-weight: 600;
    font-size: 20px;
    color: ${({ theme }) => theme.text};
    margin-bottom: 15px;

    @media (min-width: 640px) {
        margin-bottom: 20px;
    }
`;

const Close = styled(CloseIcon)`
    position: absolute;
    right: 1rem;
    top: 1.6rem;
    width: 0.75rem;
    height: 0.75rem;
    cursor: pointer;

    @media (min-width: 640px) {
        right: 4rem;
        top: 3.8rem;
        width: 1rem;
        height: 1rem;
    }
`;

const Header = styled.div`
    display: flex;
`;

const DividerRow = styled(Divider)`
    margin: 30px 0;
`;
