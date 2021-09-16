import React, { useEffect, useMemo } from 'react';
import { BigNumber } from 'bignumber.js';
import { InnerInputText, InputContainer } from '@components/General/Input';
import { Dropdown } from '@components/General/Dropdown';
import { Input } from '@components/General/Input/Numeric';
import { useSwapContext, swapDefaults, noDispatch } from '@context/SwapContext';
import { usePool } from '@context/PoolContext';
import { SideEnum, CommitActionEnum } from '@libs/constants';
import { SellSummary } from '../Summary';
import useEstimatedGasFee from '@libs/hooks/useEstimatedGasFee';
import usePoolTokens from '@libs/hooks/usePoolTokens';
import { toApproxCurrency, toCommitType } from '@libs/utils/converters';
import { calcMinAmountIn, calcTokenPrice } from '@libs/utils/calcs';

import ExchangeButton from '@components/General/Button/ExchangeButton';
import { tokenSymbolToLogoTicker } from '@components/General';
import { classNames } from '@libs/utils/functions';

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
    const tokens = usePoolTokens();

    const { amount, side, selectedPool, commitAction, invalidAmount } = swapState;

    const pool = usePool(selectedPool);
    const gasFee = useEstimatedGasFee(pool.committer.address, amount, toCommitType(side, commitAction));

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

            const invalidAmount = isInvalidAmount(amount, currentBalance, minimumTokens, tokenPrice);

            swapDispatch({
                type: 'setInvalidAmount',
                value: invalidAmount,
            });
        }
    }, [side, amount, notional, token, pendingBurns]);

    return (
        <>
            <div className="w-full mb-2">
                <p className="mb-2 text-black">Token</p>
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
                    Expected Price: {toApproxCurrency(calcTokenPrice(pool.nextShortBalance, pool.nextLongBalance))}
                </p>
            </div>
            <div className="w-full">
                <p className="mb-2 text-black">Amount</p>
                <InputContainer className="w-full ">
                    <Input
                        className="w-full h-full text-xl font-normal "
                        value={amount.toFixed()}
                        onUserInput={(val) => {
                            swapDispatch({ type: 'setAmount', value: new BigNumber(val || 0) });
                        }}
                    />
                    <InnerInputText>
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
                <p className={invalidAmount.isInvalid ? 'text-red-500 ' : ''}>
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
                            {amount.gt(0) ? (
                                <span className="opacity-80">
                                    {`>>> ${
                                        side === SideEnum.long
                                            ? amount.eq(0)
                                                ? pool.longToken.balance.toFixed(2)
                                                : pool.longToken.balance.minus(amount).toFixed(2)
                                            : amount.eq(0)
                                            ? pool.shortToken.balance.toFixed(2)
                                            : pool.shortToken.balance.minus(amount).toFixed(2)
                                    }`}
                                </span>
                            ) : null}
                        </>
                    )}
                </p>
            </div>

            <SellSummary pool={pool} isLong={side === SideEnum.long} amount={amount} gasFee={gasFee} />

            <ExchangeButton actionType={CommitActionEnum.burn} />
        </>
    );
}) as React.FC;
