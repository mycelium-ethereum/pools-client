import React from 'react';
import { SelectOption, InnerInputText } from '@components/General/Input';
import { Input as NumericInput } from '@components/General/Input/Numeric';
import { Logo } from '@components/General';
import styled from 'styled-components';
import { swapDefaults, useSwapContext, noDispatch, LEVERAGE_OPTIONS } from '@context/SwapContext';
import { SideType } from '@libs/types/General';
import { LONG, LONG_MINT, SHORT_MINT } from '@libs/constants';
import { ExchangeButton, InputRow, MarketSelect } from '../Inputs';
import { usePool, usePoolActions } from '@context/PoolContext';
import { toApproxCurrency } from '@libs/utils/converters';
import SlideSelect, { Option } from '@components/General/SlideSelect';
import { BuySummary } from '../Summary';
import TWButtonGroup from '@components/General/TWButtonGroup';

const NOT_DISABLED_LEVERAGES = [1, 3];

export default (() => {
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useSwapContext();

    const {
        leverage,
        selectedPool,
        side,
        amount,
        options: { poolOptions },
    } = swapState;

    const pool = usePool(selectedPool);

    const { commit, approve } = usePoolActions();

    return (
        <>
            <InputRow className="markets">
                <span>
                    <p className="mb-2 text-black">Market</p>
                    <MarketSelect
                        preview={pool.name}
                        onChange={(e: any) =>
                            swapDispatch({ type: 'setSelectedPool', value: e.target.value as string })
                        }
                    >
                        {poolOptions.map((pool) => (
                            <SelectOption
                                key={`pool-dropdown-option-${pool.address}`}
                                value={pool.address}
                                selected={selectedPool === pool.address}
                            >
                                {pool.name}
                            </SelectOption>
                        ))}
                    </MarketSelect>
                </span>
                <span>
                    <p className="mb-2 text-black">Side</p>
                    <StyledSlideSelect
                        className="side"
                        value={side}
                        onClick={(index) => swapDispatch({ type: 'setSide', value: index as SideType })}
                    >
                        <Option>Long</Option>
                        <Option>Short</Option>
                    </StyledSlideSelect>
                </span>
            </InputRow>
            <InputRow>
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
            </InputRow>
            <InputRow>
                <p className="mb-2 text-black">Amount</p>
                <div className="relative p-3 h-14 border rounded border-cool-gray-300 bg-cool-gray-50">
                    <NumericInput
                        className="w-full h-full text-2xl font-light text-gray-500 "
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
                </div>
                <div>
                    {`Available: ${toApproxCurrency(pool.quoteToken.balance)}`}
                    {!!amount ? ` > ${toApproxCurrency(pool.quoteToken.balance.minus(amount))}` : ''}
                </div>
            </InputRow>

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

const StyledSlideSelect = styled(SlideSelect)`
    border: 1px solid #d1d5db;
    background: #f9fafb;

    &.side {
        width: 180px;
        height: 3.44rem; // 55px
    }

    &.leverage {
        width: 110px;
        height: 3.44rem; // 55px
        margin: 0;
    }

    @media (max-width: 611px) {
        &.side {
            width: 156px;
            height: 44px;
        }

        &.leverage {
            height: 44px;
            margin: 0;
        }
    }
`;

const Currency: React.FC<{
    ticker: string
}> = (({ ticker }) => (
    <div className="flex items-center h-auto p-2 mr-2 rounded-xl bg-white text-gray-500">
        <Logo className="inline mr-2 m-0 w-5 h-5" ticker={ticker} />
        {ticker}
    </div>

)) 

