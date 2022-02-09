import React from 'react';
import { useWeb3, useWeb3Actions } from '@context/Web3Context/Web3Context';
import { SwapAction, SwapState, useBigNumber } from '@context/SwapContext';
import { usePool, usePoolActions } from '@context/PoolContext';
import { SideEnum, CommitActionEnum } from '@libs/constants';
import { CommitEnum } from '@tracer-protocol/pools-js';
import Button from '@components/General/Button';
import styled from 'styled-components';

const ExchangeButton: React.FC<{
    onClose: () => void;
    swapState: SwapState;
    swapDispatch: React.Dispatch<SwapAction>;
}> = ({ onClose, swapState, swapDispatch }) => {
    const { account } = useWeb3();
    const { handleConnect } = useWeb3Actions();
    const { selectedPool, side, amount, invalidAmount, commitAction } = swapState;

    const amountBN = useBigNumber(amount);

    const { userBalances, poolInstance: pool } = usePool(selectedPool);

    const { commit, approve } = usePoolActions();

    if (!account) {
        return (
            <Button
                size="lg"
                variant="primary"
                onClick={(_e) => {
                    handleConnect();
                }}
            >
                Connect Wallet
            </Button>
        );
    } else if (
        (!userBalances.quoteToken.approvedAmount?.gte(userBalances.quoteToken.balance) ||
            userBalances.quoteToken.approvedAmount.eq(0)) &&
        commitAction !== CommitActionEnum.burn
    ) {
        return (
            <>
                <Button
                    size="lg"
                    variant="primary"
                    disabled={!selectedPool}
                    onClick={(_e) => {
                        if (!approve) {
                            return;
                        }
                        approve(selectedPool ?? '', pool.quoteToken.symbol);
                    }}
                >
                    Unlock {pool.quoteToken.symbol}
                </Button>
                <Text>
                    Unlock {pool.quoteToken.symbol} to start investing with Tracer. This is a one-time transaction for
                    each pool.
                </Text>
            </>
        );
    } else {
        return (
            <ButtonStyled
                size="lg"
                variant="primary"
                disabled={!selectedPool || amountBN.eq(0) || invalidAmount.isInvalid}
                onClick={(_e) => {
                    let commitType;
                    if (!commit) {
                        return;
                    }
                    if (commitAction === CommitActionEnum.mint) {
                        commitType = side === SideEnum.long ? CommitEnum.longMint : CommitEnum.shortMint;
                    } else if (commitAction === CommitActionEnum.flip) {
                        // actionType === CommitActionEnum.burn
                        commitType =
                            side === SideEnum.long ? CommitEnum.longBurnShortMint : CommitEnum.shortBurnLongMint;
                    } else {
                        commitType = side === SideEnum.long ? CommitEnum.longBurn : CommitEnum.shortBurn;
                    }
                    commit(selectedPool ?? '', commitType, amountBN, {
                        onSuccess: () => {
                            swapDispatch?.({ type: 'setAmount', value: '' });
                            onClose();
                        },
                    });
                }}
            >
                Commit {CommitActionEnum[commitAction]}
            </ButtonStyled>
        );
    }
};

export default ExchangeButton;

const Text = styled.p`
    margin-top: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-align: center;
    opacity: 0.7;
    color: ${({ theme }) => theme.text};
`;

const ButtonStyled = styled(Button)`
    text-transform: capitalize;
`;
