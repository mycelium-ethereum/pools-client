import React from 'react';
import { SwapAction, SwapState } from '@context/SwapContext';
import { CommitActionEnum } from '@libs/constants';
import Button from '@components/General/Button';
import styled from 'styled-components';
import Pool from '@tracer-protocol/pools-js/entities/pool';
import { BigNumber } from 'bignumber.js';
import { AggregateBalances } from '@libs/types/General';
import { BalanceTypeEnum, CommitEnum } from '@tracer-protocol/pools-js';

type ExchangeButton = {
    onClose: () => void;
    swapState: SwapState;
    swapDispatch: React.Dispatch<SwapAction>;
    account?: string;
    handleConnect: () => void;
    userBalances: UserBalances;
    approve?: (selectedPool: string, symbol: string) => void;
    pool: Pool;
    amountBN: BigNumber;
    commit?: (
        selectedPool: string,
        commitType: number,
        balanceType: BalanceTypeEnum,
        amount: BigNumber,
        options?: Options,
    ) => void;
    commitType: CommitEnum;
};

type UserBalances = {
    shortToken: TokenBalance;
    longToken: TokenBalance;
    settlementToken: TokenBalance;
    aggregateBalances: AggregateBalances;
};

type TokenBalance = {
    approvedAmount: BigNumber;
    balance: BigNumber;
};

type Options = {
    onSuccess?: (...args: any) => any;
};

const ExchangeButton: React.FC<ExchangeButton> = ({
    onClose,
    swapState,
    swapDispatch,
    account,
    handleConnect,
    userBalances,
    approve,
    pool,
    amountBN,
    commit,
    commitType,
}) => {
    const { selectedPool, invalidAmount, commitAction, balanceType } = swapState;

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
        (!userBalances.settlementToken.approvedAmount?.gte(userBalances.settlementToken.balance) ||
            userBalances.settlementToken.approvedAmount.eq(0)) &&
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
                        approve(selectedPool ?? '', pool.settlementToken.symbol);
                    }}
                >
                    Unlock {pool.settlementToken.symbol}
                </Button>
                <Text>
                    Unlock {pool.settlementToken.symbol} to start investing with Tracer. This is a one-time transaction
                    for each pool.
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
                    if (!commit) {
                        return;
                    }

                    commit(selectedPool ?? '', commitType, balanceType, amountBN, {
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
