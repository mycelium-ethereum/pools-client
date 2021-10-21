import React, { useEffect, useMemo } from 'react';
import { BigNumber } from 'bignumber.js';
import { InnerInputText, InputContainer } from '@components/General/Input';
import { Dropdown } from '@components/General/Dropdown';
import { Input } from '@components/General/Input/Numeric';
import { useSwapContext, swapDefaults, noDispatch, useBigNumber } from '@context/SwapContext';
import { usePool } from '@context/PoolContext';
import { SideEnum, CommitActionEnum } from '@libs/constants';
import { SellSummary } from '../Summary';
import usePoolTokens from '@libs/hooks/usePoolTokens';
import { toApproxCurrency } from '@libs/utils/converters';
import { calcMinAmountIn, calcTokenPrice } from '@tracer-protocol/tracer-pools-utils';

import ExchangeButton from '@components/General/Button/ExchangeButton';
import { Currency } from '@components/General/Currency';
import { tokenSymbolToLogoTicker } from '@components/General';
import { classNames } from '@libs/utils/functions';
import FeeNote from '@archetypes/Exchange/FeeNote';
import useExpectedCommitExecution from '@libs/hooks/useExpectedCommitExecution';

/* HELPER FUNCTIONS */
const isInvalidAmount: (
    amount: BigNumber,
    balance: BigNumber,
    minimumTokens: BigNumber,
    tokenPrice: BigNumber,
) => { isInvalid: boolean; message?: string } = (amount, balance, minimumTokens, tokenPrice) => {
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

    // need to sell an amount of tokens worth minimumCommitSize or more
    if (minimumTokens.gt(amount)) {
        return {
            message: `The minimum order size is ${minimumTokens.toFixed(2)} (${toApproxCurrency(
                minimumTokens.times(tokenPrice),
            )})`,
            isInvalid: true,
        };
    }
    return {
        message: undefined,
        isInvalid: false,
    };
};

export default (() => {
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useSwapContext();
    const { tokens } = usePoolTokens();

    const { amount, side, selectedPool, invalidAmount, commitAction } = swapState;

    const amountBN = useBigNumber(amount);

    const pool = usePool(selectedPool);

    const isLong = side === SideEnum.long;
    const token = useMemo(() => (isLong ? pool.longToken : pool.shortToken), [isLong, pool.longToken, pool.shortToken]);
    const notional = useMemo(
        () => (isLong ? pool.nextLongBalance : pool.nextShortBalance),
        [isLong, pool.nextLongBalance, pool.nextShortBalance],
    );
    const pendingBurns = useMemo(
        () => (isLong ? pool.committer.pendingLong.burn : pool.committer.pendingShort.burn),
        [isLong, pool.committer.pendingLong.burn, pool.committer.pendingShort.burn],
    );

    const tokenPrice = useMemo(
        () => calcTokenPrice(notional, token.supply.plus(pendingBurns)),
        [notional, token, pendingBurns],
    );

    const receiveIn = useExpectedCommitExecution(pool.lastUpdate, pool.updateInterval, pool.frontRunningInterval);

    useEffect(() => {
        if (pool) {
            const minimumCommitSize = pool.committer.minimumCommitSize.div(10 ** pool.quoteToken.decimals);

            const minimumTokens = calcMinAmountIn(
                token.supply.plus(pendingBurns),
                notional,
                minimumCommitSize,
                pendingBurns,
            );
            const tokenPrice = calcTokenPrice(notional, token.supply.plus(pendingBurns));

            const currentBalance = side === SideEnum.long ? pool.longToken.balance : pool.shortToken.balance;

            const invalidAmount = isInvalidAmount(amountBN, currentBalance, minimumTokens, tokenPrice);

            swapDispatch({
                type: 'setInvalidAmount',
                value: invalidAmount,
            });
        }
    }, [side, amount, notional, token, pendingBurns]);

    return (
        <>
            <div className="w-full mb-2">
                <p className="mb-2 ">Token</p>
                <Dropdown
                    className="w-full"
                    placeHolder="Select Token"
                    placeHolderIcon={tokenSymbolToLogoTicker(
                        side === SideEnum.long ? pool.longToken.symbol : pool.shortToken.symbol,
                    )}
                    size="lg"
                    options={tokens.map((token) => ({
                        key: `${token.pool}-${token.side}`,
                        text: token.symbol,
                        ticker: tokenSymbolToLogoTicker(token.symbol),
                    }))}
                    value={side === SideEnum.long ? pool.longToken.symbol : pool.shortToken.symbol}
                    onSelect={(option) => {
                        const [pool, side] = option.split('-');
                        swapDispatch({ type: 'setSelectedPool', value: pool as string });
                        swapDispatch({ type: 'setSide', value: parseInt(side) as SideEnum });
                    }}
                />
                <p className={classNames(!!pool.address ? 'block' : 'hidden')}>
                    Expected Price: {toApproxCurrency(tokenPrice)}
                </p>
            </div>
            <div className="w-full">
                <p className="mb-2 ">Amount</p>
                <InputContainer error={invalidAmount.isInvalid} className="w-full">
                    <Input
                        className="w-3/5 h-full font-normal text-base"
                        value={amount}
                        onUserInput={(val) => {
                            swapDispatch({ type: 'setAmount', value: val || '' });
                        }}
                    />
                    <InnerInputText>
                        {token.symbol ? (
                            <Currency ticker={tokenSymbolToLogoTicker(token.symbol)} label={token.symbol} />
                        ) : null}
                        <div
                            className="m-auto cursor-pointer hover:underline"
                            onClick={(_e) =>
                                !!selectedPool &&
                                swapDispatch({
                                    type: 'setAmount',
                                    value: side === SideEnum.long ? pool.longToken.balance : pool.shortToken.balance,
                                })
                            }
                        >
                            Max
                        </div>
                    </InnerInputText>
                </InputContainer>
                <p
                    className={classNames(
                        invalidAmount.isInvalid ? 'text-red-500 ' : 'text-theme-text',
                        'opacity-70 text-sm mt-2',
                    )}
                >
                    {invalidAmount.isInvalid && invalidAmount.message ? (
                        invalidAmount.message
                    ) : (
                        <>
                            {`Available: `}
                            {`${
                                side === SideEnum.long
                                    ? pool.longToken.balance.toFixed(2)
                                    : pool.shortToken.balance.toFixed(2)
                            } `}
                            {amountBN.gt(0) ? (
                                <span className="opacity-80">
                                    {`>>> ${BigNumber.max(
                                        side === SideEnum.long
                                            ? amountBN.eq(0)
                                                ? pool.longToken.balance
                                                : pool.longToken.balance.minus(amount)
                                            : amountBN.eq(0)
                                            ? pool.shortToken.balance
                                            : pool.shortToken.balance.minus(amount),
                                        0,
                                    ).toFixed(2)}`}
                                </span>
                            ) : null}
                        </>
                    )}
                </p>
            </div>

            <SellSummary
                pool={pool}
                showBreakdown={!invalidAmount.isInvalid}
                isLong={side === SideEnum.long}
                amount={amountBN}
                receiveIn={receiveIn}
            />

            <FeeNote poolName={pool.name} isMint={commitAction === CommitActionEnum.mint} receiveIn={receiveIn} />

            <ExchangeButton actionType={CommitActionEnum.burn} />
        </>
    );
}) as React.FC;
