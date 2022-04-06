import React, { useEffect, useMemo } from 'react';
import { BigNumber } from 'bignumber.js';
import { CommitActionEnum, BalanceTypeEnum, SideEnum } from '@tracer-protocol/pools-js';
import AmountInput from './AmountInput';
import * as Styles from './styles';
import { InvalidAmount } from './types';
import TokenSelect from '../TokenSelect';
import TWButtonGroup from '~/components/General/TWButtonGroup';
import { TooltipKeys } from '~/components/Tooltips/TooltipSelector';
import { SwapState, useBigNumber, SwapAction } from '~/context/SwapContext';
import usePoolsNextBalances from '~/hooks/usePoolsNextBalances';
import usePoolTokens from '~/hooks/usePoolTokens';
import { PoolInfo } from '~/types/pools';
import { toApproxCurrency } from '~/utils/converters';

/* HELPER FUNCTIONS */
const isInvalidAmount: (amount: BigNumber, balance: BigNumber) => InvalidAmount = (amount, balance) => {
    if (amount.eq(0)) {
        return {
            message: undefined,
            isInvalid: false,
        };
    }

    if (amount.gt(balance)) {
        return {
            message: undefined,
            isInvalid: true,
        };
    }

    return {
        message: undefined,
        isInvalid: false,
    };
};

export default (({ pool, userBalances, swapState, swapDispatch }) => {
    const { tokens } = usePoolTokens();

    const { amount, side, selectedPool, invalidAmount, commitAction, balanceType } = swapState;

    const amountBN = useBigNumber(amount);

    const isLong = side === SideEnum.long;
    const token = useMemo(() => (isLong ? pool.longToken : pool.shortToken), [isLong, pool.longToken, pool.shortToken]);
    const tokenBalance = useMemo(() => {
        switch (balanceType) {
            case BalanceTypeEnum.escrow:
                return isLong ? userBalances.aggregateBalances.longTokens : userBalances.aggregateBalances.shortTokens;
            default:
                return isLong ? userBalances.longToken.balance : userBalances.shortToken.balance;
        }
    }, [
        isLong,
        balanceType,
        userBalances.longToken,
        userBalances.shortToken,
        userBalances.aggregateBalances.longTokens,
        userBalances.aggregateBalances.shortTokens,
    ]);

    const settlementTokenBalance = useMemo(() => {
        switch (balanceType) {
            case BalanceTypeEnum.escrow:
                return userBalances.aggregateBalances.settlementTokens;
            default:
                return userBalances.settlementToken.balance;
        }
    }, [balanceType, userBalances.settlementToken, userBalances.aggregateBalances.settlementTokens]);

    const nextBalances = usePoolsNextBalances(pool);
    const notional = useMemo(() => (isLong ? nextBalances.nextLongBalance : nextBalances.nextShortBalance), [isLong]);

    const pendingBurns = useMemo(
        () => (isLong ? pool.committer.pendingLong.burn : pool.committer.pendingShort.burn),
        [isLong, pool.committer.pendingLong.burn, pool.committer.pendingShort.burn],
    );

    const tokenPrice = useMemo(() => (isLong ? pool.getNextLongTokenPrice() : pool.getNextShortTokenPrice()), [isLong]);

    const TEMP_WALLET_OPTIONS = [
        {
            key: BalanceTypeEnum.wallet,
            text: 'Wallet',
        },
        {
            key: BalanceTypeEnum.escrow,
            text: 'Escrow',
            disabled:
                isLong && commitAction === CommitActionEnum.mint
                    ? {
                          optionKey: TooltipKeys.EscrowLongUnavailable,
                      }
                    : undefined,
        },
    ];

    useEffect(() => {
        if (pool) {
            let currentBalance: BigNumber;
            if (commitAction === CommitActionEnum.mint) {
                currentBalance = settlementTokenBalance;
            } else {
                currentBalance = tokenBalance;
            }

            const invalidAmount = isInvalidAmount(amountBN, currentBalance);

            swapDispatch({
                type: 'setInvalidAmount',
                value: invalidAmount,
            });
        }
    }, [commitAction, amount, notional, token, pendingBurns, settlementTokenBalance, tokenBalance]);

    return (
        <>
            <Styles.Wrapper hasMargin>
                <Styles.Label>Token</Styles.Label>
                <TokenSelect
                    tokens={tokens}
                    selectedToken={token}
                    setToken={(pool, side) => {
                        swapDispatch({ type: 'setSelectedPool', value: pool as string });
                        swapDispatch({ type: 'setSide', value: side as SideEnum });
                    }}
                />
                <Styles.Subtext showContent={!!pool.address}>
                    Expected Price: {toApproxCurrency(tokenPrice)}
                </Styles.Subtext>
            </Styles.Wrapper>
            <Styles.Container>
                <Styles.Wrapper>
                    <Styles.Label>Amount</Styles.Label>
                    {commitAction === CommitActionEnum.mint ? (
                        <AmountInput
                            invalidAmount={invalidAmount}
                            amount={amount}
                            amountBN={amountBN}
                            balance={settlementTokenBalance}
                            tokenSymbol={pool.settlementToken.symbol}
                            swapDispatch={swapDispatch}
                            selectedPool={selectedPool}
                            isPoolToken={false}
                        />
                    ) : (
                        <AmountInput
                            invalidAmount={invalidAmount}
                            amount={amount}
                            amountBN={amountBN}
                            balance={tokenBalance}
                            tokenSymbol={token.symbol}
                            swapDispatch={swapDispatch}
                            selectedPool={selectedPool}
                            isPoolToken={true}
                        />
                    )}
                </Styles.Wrapper>
                <Styles.Wrapper>
                    <Styles.Label>From</Styles.Label>
                    <TWButtonGroup
                        value={balanceType ?? BalanceTypeEnum.wallet}
                        size={'lg'}
                        color={'tracer'}
                        onClick={(val) => {
                            if (swapDispatch) {
                                swapDispatch({ type: 'setBalanceType', value: val });
                            }
                        }}
                        options={TEMP_WALLET_OPTIONS}
                    />
                </Styles.Wrapper>
            </Styles.Container>
        </>
    );
}) as React.FC<{
    pool: PoolInfo['poolInstance'];
    userBalances: PoolInfo['userBalances'];
    swapState: SwapState;
    swapDispatch: React.Dispatch<SwapAction>;
}>;
