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

const inputRow = 'relative my-2 ';

/* HELPER FUNCTIONS */
const isInvalidAmount: (amount: number, balance: number) => boolean = (amount, balance) => amount > balance;

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
        market,
        markets,
    } = swapState;

    const pool = usePool(selectedPool);

    useEffect(() => {
        swapDispatch({
            type: 'setInvalidAmount',
            value: isInvalidAmount(amount, pool.quoteToken.balance.toNumber()),
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
                        options={Object.keys(markets).map((market) => ({
                            key: market,
                            text: market,
                        }))}
                        value={market}
                        onSelect={(selectedMarket) => {
                            console.debug('Setting market', selectedMarket );
                            swapDispatch({ type: 'setMarket', value: selectedMarket as string });
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
                        swapDispatch({ type: 'setLeverage', value: index });
                    }}
                />
            </div>
            <div className={`${inputRow} `}>
                <p className="mb-2 text-black">Amount</p>
                <InputContainer error={invalidAmount}>
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
                <div className={invalidAmount ? 'text-red-500 ' : ''}>
                    {`Available: ${toApproxCurrency(pool.quoteToken.balance)}`}
                    {!!amount ? ` > ${toApproxCurrency(pool.quoteToken.balance.minus(amount))}` : ''}
                </div>
            </div>

            <BuySummary pool={pool} amount={amount} isLong={side === SideEnum.long} />

            <ExchangeButton actionType={CommitActionEnum.mint} />
        </>
    );
}) as React.FC;
