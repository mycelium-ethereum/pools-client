import React, { useContext, useMemo } from 'react';
import { BigNumber } from 'bignumber.js';
import styled from 'styled-components';
import { CommitActionEnum, BalanceTypeEnum, CommitEnum, SideEnum } from '@tracer-protocol/pools-js';
import Pool from '@tracer-protocol/pools-js/entities/pool';
import { calcNumTokens } from '~/archetypes/Exchange/Summary/utils';
import Button from '~/components/General/Button';
import { AnalyticsContext } from '~/context/AnalyticsContext';
import { SwapAction, SwapState } from '~/context/SwapContext';
import { AggregateBalances } from '~/types/pools';

export type ExchangeButtonProps = {
    onClose?: () => void;
    swapState: SwapState;
    swapDispatch: React.Dispatch<SwapAction>;
    account?: string;
    handleConnect?: () => void;
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

export type UserBalances = {
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

const commitText: Record<CommitEnum, string> = {
    [CommitEnum.shortBurnLongMint]: 'Short Flip',
    [CommitEnum.longBurnShortMint]: 'Long Flip',
    [CommitEnum.shortMint]: 'Short Mint',
    [CommitEnum.longMint]: 'Long Mint',
    [CommitEnum.shortBurn]: 'Short Burn',
    [CommitEnum.longBurn]: 'Long Burn',
};

const ExchangeButton: React.FC<ExchangeButtonProps> = ({
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
    // Required for tracking trade actions
    const { trackTradeAction } = useContext(AnalyticsContext);
    const { selectedPool, side, invalidAmount, commitAction, balanceType } = swapState;
    const isLong = side === SideEnum.long;
    const token = useMemo(() => (isLong ? pool.longToken : pool.shortToken), [isLong, pool.longToken, pool.shortToken]);

    const nextTokenPrice = useMemo(
        () => (isLong ? pool.getNextLongTokenPrice() : pool.getNextShortTokenPrice()),
        [isLong, pool.longToken, pool.shortToken],
    );

    const expectedAmount = calcNumTokens(amountBN, nextTokenPrice);

    if (!account) {
        return (
            <Button
                size="lg"
                variant="primary"
                onClick={(_e) => {
                    handleConnect && handleConnect();
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
                            trackTradeAction(
                                commitAction,
                                balanceType,
                                token.name,
                                pool.settlementToken.symbol,
                                expectedAmount,
                                amountBN,
                                userBalances.settlementToken.balance,
                                pool.longToken.supply,
                                pool.shortToken.supply,
                                false,
                            );
                            onClose && onClose();
                        },
                    });

                    trackTradeAction(
                        commitAction,
                        balanceType,
                        token.name,
                        pool.settlementToken.symbol,
                        expectedAmount,
                        amountBN,
                        userBalances.settlementToken.balance,
                        pool.longToken.supply,
                        pool.shortToken.supply,
                        true,
                    );
                }}
            >
                Commit {commitText[commitType]}
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
    color: ${({ theme }) => theme.fontColor.primary};
`;

const ButtonStyled = styled(Button)`
    text-transform: capitalize;
`;
