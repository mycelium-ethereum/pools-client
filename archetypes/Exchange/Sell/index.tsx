import React, { useEffect } from 'react';
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
import { calcTokenPrice } from '@libs/utils/calcs';

import ExchangeButton from '@components/General/Button/ExchangeButton';

/* HELPER FUNCTIONS */
const isInvalidAmount: (
    amount: number,
    balance: number,
    minimumCommitSize: number,
    tokenPrice: BigNumber,
) => { isInvalid: boolean; message?: string } = (amount, balance, minimumCommitSize, tokenPrice) => {
    if (amount > balance) {
        return {
            message: undefined,
            isInvalid: true,
        };
    }

    // need to sell an amount of tokens worth minimumCommitSize or more
    const minimumTokens = new BigNumber(minimumCommitSize).div(tokenPrice);

    if (minimumTokens.gt(amount)) {
        return {
            message: `The minimum order size is ${minimumTokens.toFixed()} (${toApproxCurrency(minimumCommitSize)})`,
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

    useEffect(() => {
        if (pool) {
            const isLong = side === SideEnum.long;

            const balance = isLong ? pool.longToken.balance.toNumber() : pool.shortToken.balance.toNumber();
            const token = isLong ? pool.longToken : pool.shortToken;
            const notional = isLong ? pool.longBalance : pool.shortBalance;

            const tokenPrice = calcTokenPrice(notional, token.supply);

            const invalidAmount = isInvalidAmount(
                amount,
                balance,
                pool.committer.minimumCommitSize.div(10 ** (pool.quoteToken?.decimals || 18)).toNumber(),
                tokenPrice,
            );

            swapDispatch({
                type: 'setInvalidAmount',
                value: invalidAmount,
            });
        }
    }, [side, amount, pool.longToken.balance, pool.shortToken.balance]);

    return (
        <>
            {/* <div className="relative flex flew-row y-2 "> */}
            <div className="w-full">
                <p className="mb-2 text-black">Token</p>
                <Dropdown
                    className="w-full"
                    placeHolder="Select Token"
                    size="lg"
                    options={tokens.map((token) => ({ key: token.symbol }))}
                    value={side === SideEnum.long ? pool.longToken.symbol : pool.shortToken.symbol}
                    onSelect={(option) => {
                        tokens.forEach((token) => {
                            if (token.symbol === option) {
                                swapDispatch({ type: 'setSelectedPool', value: token.pool as string });
                                swapDispatch({ type: 'setSide', value: token.side as SideEnum });
                            }
                        });
                    }}
                />
                <p className="mb-2">Last Price: {toApproxCurrency(pool.lastPrice)}</p>
            </div>
            <div className="w-full">
                <p className="mb-2 text-black">Amount</p>
                <InputContainer className="w-full ">
                    <Input
                        className="w-full h-full text-xl font-normal "
                        value={amount}
                        onUserInput={(val) => {
                            swapDispatch({ type: 'setAmount', value: parseInt(val) });
                        }}
                    />
                    <InnerInputText>
                        <div
                            className="m-auto cursor-pointer hover:underline"
                            onClick={(_e) =>
                                !!selectedPool &&
                                swapDispatch({
                                    type: 'setAmount',
                                    value:
                                        side === SideEnum.long
                                            ? pool.longToken.balance.toNumber()
                                            : pool.shortToken.balance.toNumber(),
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
                            Available:{' '}
                            {side === SideEnum.long
                                ? pool.longToken.balance.toFixed(2)
                                : pool.shortToken.balance.toFixed(2)}{' '}
                            {'>'}{' '}
                            {side === SideEnum.long
                                ? isNaN(amount)
                                    ? pool.longToken.balance.toFixed(2)
                                    : (pool.longToken.balance.toNumber() - amount).toFixed(2)
                                : isNaN(amount)
                                ? pool.shortToken.balance.toFixed(2)
                                : (pool.shortToken.balance.toNumber() - amount).toFixed(2)}
                        </>
                    )}
                </p>
            </div>
            {/* </div> */}

            <SellSummary pool={pool} isLong={side === SideEnum.long} amount={amount} gasFee={gasFee} />

            <ExchangeButton actionType={CommitActionEnum.burn} />
        </>
    );
}) as React.FC;
