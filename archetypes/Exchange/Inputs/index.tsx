import React, { useEffect, useMemo } from 'react';
import { BigNumber } from 'bignumber.js';
import { InnerInputText, InputContainer } from '@components/General/Input';
import { Dropdown } from '@components/General/Dropdown';
import { Input } from '@components/General/Input/Numeric';
import { SwapState, useBigNumber, SwapAction } from '@context/SwapContext';
import { CommitActionEnum, SideEnum } from '@libs/constants';
import usePoolTokens from '@libs/hooks/usePoolTokens';
import { toApproxCurrency } from '@libs/utils/converters';
import { calcMinAmountIn, calcTokenPrice } from '@tracer-protocol/tracer-pools-utils';

import { Currency } from '@components/General/Currency';
import { tokenSymbolToLogoTicker } from '@components/General';
import { classNames } from '@libs/utils/functions';
import { Pool } from '@libs/types/General';

type InvalidAmount = {
    isInvalid: boolean;
    message?: string;
};
/* HELPER FUNCTIONS */
const isInvalidAmount: (
    amount: BigNumber,
    balance: BigNumber,
    minimumTokens: BigNumber,
    tokenPrice: BigNumber,
) => InvalidAmount = (amount, balance, minimumTokens, tokenPrice) => {
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

export default (({ pool, swapState, swapDispatch }) => {
    const { tokens } = usePoolTokens();

    const { amount, side, selectedPool, invalidAmount, commitAction } = swapState;

    const amountBN = useBigNumber(amount);

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

    useEffect(() => {
        if (pool) {
            const minimumCommitSize = pool.committer.minimumCommitSize.div(10 ** pool.quoteToken.decimals);

            const tokenPrice = calcTokenPrice(notional, token.supply.plus(pendingBurns));

            let currentBalance: BigNumber, minimumTokens: BigNumber;
            if (commitAction === CommitActionEnum.mint) {
                currentBalance = pool.quoteToken.balance;
                minimumTokens = new BigNumber(minimumCommitSize.toString());
            } else {
                currentBalance = side === SideEnum.long ? pool.longToken.balance : pool.shortToken.balance;
                minimumTokens = calcMinAmountIn(
                    token.supply.plus(pendingBurns),
                    notional,
                    minimumCommitSize,
                    pendingBurns,
                );
            }

            const invalidAmount = isInvalidAmount(amountBN, currentBalance, minimumTokens, tokenPrice);

            console.log('invalidAmount', invalidAmount);

            swapDispatch({
                type: 'setInvalidAmount',
                value: invalidAmount,
            });
        }
    }, [side, commitAction, amount, notional, token, pendingBurns]);

    return (
        <>
            <div className="w-full mb-4">
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
                    value={token.symbol}
                    onSelect={(option) => {
                        const [pool, side] = option.split('-');
                        console.log('Setting pool from here', pool, side);
                        swapDispatch({ type: 'setSelectedPool', value: pool as string });
                        swapDispatch({ type: 'setSide', value: parseInt(side) as SideEnum });
                    }}
                />
                <p className={classNames(!!pool.address ? 'block' : 'hidden', 'text-sm opacity-70 mt-2')}>
                    Expected Price: {toApproxCurrency(tokenPrice)}
                </p>
            </div>
            <div className="w-full">
                <p className="mb-2 ">Amount</p>

                {commitAction === CommitActionEnum.mint ? (
                    <AmountInput
                        invalidAmount={invalidAmount}
                        amount={amount}
                        amountBN={amountBN}
                        balance={pool.quoteToken.balance}
                        tokenSymbol={pool.quoteToken.symbol}
                        swapDispatch={swapDispatch}
                        selectedPool={selectedPool}
                        isPoolToken={false}
                    />
                ) : (
                    <AmountInput
                        invalidAmount={invalidAmount}
                        amount={amount}
                        amountBN={amountBN}
                        balance={token.balance}
                        tokenSymbol={token.symbol}
                        swapDispatch={swapDispatch}
                        selectedPool={selectedPool}
                        isPoolToken={true}
                    />
                )}
            </div>
        </>
    );
}) as React.FC<{
    pool: Pool;
    swapState: SwapState;
    swapDispatch: React.Dispatch<SwapAction>;
}>;

type AmountProps = {
    invalidAmount: InvalidAmount;
    amountBN: BigNumber;
    amount: string;
    selectedPool: string | undefined;
    swapDispatch: React.Dispatch<SwapAction>;
    balance: BigNumber;
    tokenSymbol: string;
    isPoolToken: boolean;
};

const AmountInput: React.FC<AmountProps> = ({
    invalidAmount,
    selectedPool,
    amount,
    amountBN,
    swapDispatch,
    balance,
    tokenSymbol,
    isPoolToken,
}) => {
    return (
        <>
            <InputContainer error={invalidAmount.isInvalid} className="w-full">
                <Input
                    className="w-3/5 h-full font-normal text-base"
                    value={amount}
                    onUserInput={(val) => {
                        swapDispatch({ type: 'setAmount', value: val || '' });
                    }}
                />
                <InnerInputText>
                    {tokenSymbol ? (
                        <Currency ticker={tokenSymbolToLogoTicker(tokenSymbol)} label={tokenSymbol} />
                    ) : null}
                    <div
                        className="m-auto cursor-pointer hover:underline"
                        onClick={(_e) =>
                            !!selectedPool &&
                            swapDispatch({
                                type: 'setAmount',
                                value: balance.toString(),
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
                    <Available balance={balance} amountBN={amountBN} isPoolToken={isPoolToken} />
                )}
            </p>
        </>
    );
};

const Available: React.FC<{
    amountBN: BigNumber;
    balance: BigNumber;
    isPoolToken: boolean;
}> = ({ amountBN, balance, isPoolToken }) => {
    const balanceAfter = BigNumber.max(amountBN.eq(0) ? balance : balance.minus(amountBN), 0);

    return (
        <>
            {`Available: `}
            {isPoolToken ? (
                <>
                    {`${balance.toFixed(2)} `}
                    {amountBN.gt(0) ? <span className="opacity-80">{`>>> ${balanceAfter.toFixed(2)}`}</span> : null}
                </>
            ) : (
                <>
                    {`${toApproxCurrency(balance)} `}
                    {amountBN.gt(0) ? (
                        <span className="opacity-80">{`>>> ${toApproxCurrency(balanceAfter)}`}</span>
                    ) : null}
                </>
            )}
        </>
    );
};
