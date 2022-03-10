import React, { useContext, useState, useMemo, useEffect } from 'react';
import { noDispatch, SwapContext, swapDefaults, useBigNumber } from '@context/SwapContext';
import { CommitActionEnum, SideEnum } from '@libs/constants';
import Gas from './Gas';
import Inputs from './Inputs';
import Divider from '@components/General/Divider';
import TWButtonGroup from '@components/General/TWButtonGroup';
import ExchangeButton from '@components/General/Button/ExchangeButton';
import Summary from './Summary';
import { useWeb3, useWeb3Actions } from '@context/Web3Context/Web3Context';
import { usePool, usePoolActions } from '@context/PoolContext';
import { CommitEnum } from '@tracer-protocol/pools-js';
import useExpectedCommitExecution from '@libs/hooks/useExpectedCommitExecution';
import CloseIcon from '/public/img/general/close.svg';
import styled from 'styled-components';
// TODO: dependent on auto-claim feature
// import Checkbox from '@components/General/Checkbox';

const TRADE_OPTIONS = [
    {
        key: CommitActionEnum.mint,
        text: 'Mint',
    },
    {
        key: CommitActionEnum.burn,
        text: 'Burn',
    },
    {
        key: CommitActionEnum.flip,
        text: 'Flip',
    },
];

export default styled((({ onClose, className }) => {
    // TODO: dependent on auto-claim feature
    // const [autoClaimTokens, setAutoClaimTokens] = useState(false);
    const [commitGasFees, setCommitGasFees] = useState<Partial<Record<CommitActionEnum, string>>>({});
    const [commitType, setCommitType] = useState<CommitEnum>(0);

    const { account } = useWeb3();
    const { handleConnect } = useWeb3Actions();
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useContext(SwapContext);
    const { selectedPool, amount, commitAction, side, invalidAmount } = swapState || {};
    const { poolInstance: pool, userBalances } = usePool(selectedPool);
    const { commit, approve, commitGasFee } = usePoolActions();

    const receiveIn = useExpectedCommitExecution(pool.lastUpdate, pool.updateInterval, pool.frontRunningInterval);
    const amountBN = useBigNumber(amount);

    useMemo(async () => {
        if (commitGasFee) {
            const fee = await commitGasFee(selectedPool ?? '', commitType, amountBN);
            setCommitGasFees({ ...commitGasFees, [CommitActionEnum[commitAction]]: fee });
        }
    }, [selectedPool, commitType, amountBN]);

    useEffect(() => {
        if (commitAction === CommitActionEnum.mint) {
            setCommitType(side === SideEnum.long ? CommitEnum.longMint : CommitEnum.shortMint);
        } else if (commitAction === CommitActionEnum.flip) {
            setCommitType(side === SideEnum.long ? CommitEnum.longBurnShortMint : CommitEnum.shortBurnLongMint);
        } else {
            setCommitType(side === SideEnum.long ? CommitEnum.longBurn : CommitEnum.shortBurn);
        }
    }, [commitAction]);

    return (
        <div className={className}>
            <Close onClick={onClose} className="close" />
            <Title>New Commit</Title>

            <Header>
                <TWButtonGroupStyled
                    value={commitAction ?? CommitActionEnum.mint}
                    size={'lg'}
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
            <Inputs pool={pool} userBalances={userBalances} swapDispatch={swapDispatch} swapState={swapState} />

            {/* TODO: dependent on auto-claim feature */}
            {/* {CommitActionEnum[swapState.commitAction] === 'flip' && (
                <CheckboxStyled
                    onClick={() => setAutoClaimTokens(!autoClaimTokens)}
                    isChecked={autoClaimTokens}
                    label="Auto-claim tokens"
                    subtext="Once the pool rebalances, a small gas fee is required to retrieve your tokens from escrow. By
                    checking this box, you are request to have this function automated and will be charged a fee.
                    Otherwise, you can manually claim tokens from escrow."
                />
            )} */}

            <Summary
                pool={pool}
                showBreakdown={!invalidAmount.isInvalid}
                isLong={side === SideEnum.long}
                amount={amountBN}
                receiveIn={receiveIn}
                commitAction={commitAction}
                gasFee={commitGasFees[commitAction]}
            />

            <ExchangeButton
                onClose={onClose}
                swapState={swapState}
                swapDispatch={swapDispatch}
                account={account}
                handleConnect={handleConnect}
                userBalances={userBalances}
                approve={approve}
                pool={pool}
                amountBN={amountBN}
                commit={commit}
                commitType={commitType}
            />
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
    justify-content: space-between;
`;

const TWButtonGroupStyled = styled(TWButtonGroup)`
    z-index: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.125rem;
    width: auto;
`;

const DividerRow = styled(Divider)`
    margin: 30px 0;
    border-color: ${({ theme }) => theme['border-secondary']};
`;

// TODO: dependent on auto-claim feature
// const CheckboxStyled = styled(Checkbox)`
//     margin: 25px 0 50px;

//     @media (min-width: 640px) {
//         margin: 29px 0 60px;
//     }
// `;
