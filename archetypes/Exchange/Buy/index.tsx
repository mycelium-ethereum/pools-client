import React, { useEffect } from 'react';
import { InnerInputText, InputContainer } from '@components/General/Input';
import { Input as NumericInput } from '@components/General/Input/Numeric';
import { swapDefaults, useSwapContext, noDispatch, LEVERAGE_OPTIONS } from '@context/SwapContext';
import { CommitActionEnum, SideEnum } from '@libs/constants';
import { usePool } from '@context/PoolContext';
import { toApproxCurrency } from '@libs/utils/converters';
import { BuySummary } from '../Summary';
import TWButtonGroup from '@components/General/TWButtonGroup';
import { Currency } from '@components/General/Currency';
import { Dropdown } from '@components/General/Dropdown';
import ExchangeButton from '@components/General/Button/ExchangeButton';

const NOT_DISABLED_LEVERAGES = [1, 3];

const inputRow = 'relative my-2 ';

/* HELPER FUNCTIONS */
const isInvalidAmount: (amount: number, balance: number) => { isInvalid: boolean; message?: string } = (
    amount,
    balance,
) => {
    if (amount > balance) {
        return {
            message: undefined,
            isInvalid: true,
        };
    }
    if (amount < 1000) {
        return {
            // TODO get the minimum amount and unit dynamically
            message: 'The minimum order size is $1,000.00',
            isInvalid: true,
        };
    }
    return {
        message: undefined,
        isInvalid: false,
    };
};

const SIDE_OPTIONS = [
    {
        key: SideEnum.long,
        text: 'Long',
    },
    {
        key: SideEnum.short,
        text: 'Short',
    },
];

export default (() => {
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useSwapContext();
    const {
        leverage,
        selectedPool,
        side,
        amount,
        invalidAmount,
        options: { poolOptions },
    } = swapState;

    const pool = usePool(selectedPool);

    useEffect(() => {
        const invalidAmount = isInvalidAmount(amount, pool.quoteToken.balance.toNumber());

        swapDispatch({
            type: 'setInvalidAmount',
            value: invalidAmount,
        });
    }, [amount, pool.quoteToken.balance]);

    return (
        <>
            <div className={`${inputRow} flex justify-between`}>
                <span className="w-60">
                    <p className="mb-2 text-black">Market</p>
                    <Dropdown
                        className="w-full "
                        placeHolder="Select Market"
                        size="lg"
                        options={poolOptions.map((pool) => ({
                            key: pool.address,
                            text: pool.name,
                        }))}
                        value={pool.name}
                        onSelect={(selectedPool) => {
                            console.debug('Setting pool', selectedPool);
                            swapDispatch({ type: 'setSelectedPool', value: selectedPool as string });
                        }}
                    />
                </span>
                <span>
                    <p className="mb-2 text-black">Side</p>
                    <TWButtonGroup
                        value={side}
                        onClick={(option) => swapDispatch({ type: 'setSide', value: option as SideEnum })}
                        size={'lg'}
                        options={SIDE_OPTIONS}
                    />
                </span>
            </div>
            <div className={`${inputRow} `}>
                <p className="mb-2 text-black">Power Leverage</p>
                <TWButtonGroup
                    value={leverage}
                    options={LEVERAGE_OPTIONS.map((option) => ({
                        key: option.leverage,
                        text: `${option.leverage}`,
                        disabled: option.disabled
                            ? {
                                  text: 'Coming soon',
                              }
                            : undefined,
                    }))}
                    onClick={(index) => {
                        // everything else disabled
                        if (NOT_DISABLED_LEVERAGES.includes(index)) {
                            swapDispatch({ type: 'setLeverage', value: index as SideEnum });
                        }
                    }}
                />
            </div>
            <div className={`${inputRow} `}>
                <p className="mb-2 text-black">Amount</p>
                <InputContainer error={invalidAmount.isInvalid}>
                    <NumericInput
                        className="w-full h-full text-base font-normal "
                        value={amount}
                        onUserInput={(val) => {
                            swapDispatch({ type: 'setAmount', value: parseInt(val) });
                        }}
                    />
                    <InnerInputText>
                        <Currency ticker={'USDC'} />
                        <div
                            className="m-auto cursor-pointer hover:underline"
                            onClick={(_e) =>
                                swapDispatch({ type: 'setAmount', value: pool.quoteToken.balance.toNumber() })
                            }
                        >
                            Max
                        </div>
                    </InnerInputText>
                </InputContainer>

                <div className={invalidAmount.isInvalid ? 'text-red-500 ' : ''}>
                    {invalidAmount.isInvalid && invalidAmount.message ? (
                        invalidAmount.message
                    ) : (
                        <>
                            {`Available: ${toApproxCurrency(pool.quoteToken.balance)}`}
                            {!!amount ? ` > ${toApproxCurrency(pool.quoteToken.balance.minus(amount))}` : ''}
                        </>
                    )}
                </div>
            </div>

            <BuySummary pool={pool} amount={amount} isLong={side === SideEnum.long} />

            <ExchangeButton actionType={CommitActionEnum.mint} />
        </>
    );
}) as React.FC;
