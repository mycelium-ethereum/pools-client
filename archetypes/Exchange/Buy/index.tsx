import React, { useEffect } from 'react';
import { InnerInputText, InputContainer } from '@components/General/Input';
import { Input as NumericInput } from '@components/General/Input/Numeric';
import styled from 'styled-components';
import { swapDefaults, useSwapContext, noDispatch, LEVERAGE_OPTIONS } from '@context/SwapContext';
import { SideType } from '@libs/types/General';
import { LONG, SHORT, LONG_MINT, SHORT_MINT } from '@libs/constants';
import { ExchangeButton } from '../Inputs';
import { usePool, usePoolActions } from '@context/PoolContext';
import { toApproxCurrency } from '@libs/utils/converters';
import { BuySummary } from '../Summary';
import TWButtonGroup from '@components/General/TWButtonGroup';
import { Currency } from '@components/General/Currency';
import { Dropdown } from '@components/General/Dropdown';

const NOT_DISABLED_LEVERAGES = [1, 3];

const inputRow = 'relative my-2 ';

/* HELPER FUNCTIONS */
const isInvalidAmount: (amount: number, balance: number) => boolean = (amount, balance) => amount > balance;

const SIDE_OPTIONS = [
    {
        key: LONG,
        text: 'Long',
    },
    {
        key: SHORT,
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

    const { commit, approve } = usePoolActions();

    useEffect(() => {
        swapDispatch({
            type: 'setInvalidAmount',
            value: isInvalidAmount(
                amount,
                pool.quoteToken.balance.toNumber()
            ),
        });
    }, [amount, pool.quoteToken.balance]);

    return (
        <>
            <div className={`${inputRow} flex justify-between`}>
                <span className="w-60">
                    <p className="mb-2 text-black">Market</p>
                    <Dropdown
                        className="w-full "
                        placeHolder="Select Pool"
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
                        onClick={(option) => swapDispatch({ type: 'setSide', value: option as SideType })}
                        size={'lg'}
                        options={SIDE_OPTIONS}
                    />
                </span>
            </div>
            <div className={`${inputRow} `}>
                <p className="mb-2 text-black">Leverage</p>
                <TWButtonGroup
                    value={leverage}
                    options={LEVERAGE_OPTIONS.map((option) => ({
                        key: option.leverage,
                        text: `${option.leverage}x`,
                        disabled: option.disabled
                            ? {
                                  text: 'Coming soon',
                              }
                            : undefined,
                    }))}
                    onClick={(index) => {
                        // everything else disabled
                        if (NOT_DISABLED_LEVERAGES.includes(index)) {
                            swapDispatch({ type: 'setLeverage', value: index as SideType });
                        }
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

            <BuySummary pool={pool} amount={amount} isLong={side === LONG} />

            {!pool.quoteToken.approved ? (
                <>
                    <ExchangeButton
                        className="primary"
                        disabled={!selectedPool}
                        onClick={(_e) => {
                            if (!approve) {
                                return;
                            }
                            approve(selectedPool ?? '');
                        }}
                    >
                        Unlock USDC
                    </ExchangeButton>
                    <HelperText>
                        Unlock DAI to start investing with Tracer. This is a one-time transaction for each pool.{' '}
                        <a>Learn more.</a>
                    </HelperText>
                </>
            ) : (
                <ExchangeButton
                    disabled={!selectedPool || !pool.quoteToken.approved || !amount}
                    className="primary"
                    onClick={(_e) => {
                        if (!commit) {
                            return;
                        }
                        commit(selectedPool ?? '', side === LONG ? LONG_MINT : SHORT_MINT, amount);
                    }}
                >
                    {`Ok, let's buy`}
                </ExchangeButton>
            )}
        </>
    );
}) as React.FC;

const HelperText = styled.p`
    color: #6b7280;
    font-size: 14px;

    a {
        text-decoration: underline;
        cursor: pointer;
    }
`;
