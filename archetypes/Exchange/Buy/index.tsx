import React from 'react';
import { Input, SelectOption, InnerInputText, InputWrapper, Select } from '@components/General/Input';
import { Logo } from '@components/General';
import styled from 'styled-components';
import { swapDefaults, useSwapContext, noDispatch } from '@context/SwapContext';
import { SideType } from '@libs/types/General';
import { LONG, LONG_MINT, SHORT_MINT } from '@libs/constants';
import { ExchangeButton, InputRow } from '../Inputs';
import { usePool, usePoolActions } from '@context/PoolContext';
import { toApproxCurrency } from '@libs/utils/converters';
import SlideSelect, { Option } from '@components/General/SlideSelect';
import { Label } from '@components/Pool';
import { BuySummary } from '../Summary';


export default (() => {
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useSwapContext();

    const {
        leverage,
        selectedPool,
        side,
        amount,
        options: { leverageOptions, poolOptions },
    } = swapState;

    const pool = usePool(selectedPool);

    const { commit, approve } = usePoolActions();

    return (
        <>
            <InputRow className="markets">
                <span>
                    <Label>Market</Label>
                    <Select
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
                    </Select>
                </span>
                <span>
                    <Label>Side</Label>
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
                <Label>Leverage</Label>
                <StyledSlideSelect
                    className="leverage"
                    value={leverage}
                    onClick={(index) => swapDispatch({ type: 'setLeverage', value: index as SideType })}
                >
                    {leverageOptions.map((option) => (
                        <Option key={`leverage-option-${option}`}>{option}x</Option>
                    ))}
                </StyledSlideSelect>
            </InputRow>
            <InputRow>
                <Label>Amount</Label>
                <InputWrapper>
                    <Input
                        value={amount}
                        onChange={(e: any) => {
                            swapDispatch({ type: 'setAmount', value: parseInt(e.currentTarget.value) });
                        }}
                        disabled={!selectedPool}
                        type={'number'}
                        min={0}
                    />
                    <InnerInputText
                        onClick={(_e) => swapDispatch({ type: 'setAmount', value: pool.quoteToken.balance.toNumber() })}
                    >
                        <Currency>
                            <Logo ticker={'USDC'} />
                            <span>{`USDC`}</span>
                        </Currency>
                        {`MAX`}
                    </InnerInputText>
                </InputWrapper>
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

const Currency = styled.div`
    background: #ffffff;
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.1);
    border-radius: 50px;
    padding: 0px 8px 0px 4px;
    margin-right: 0.5rem;
    color: #71717a;
    height: 29px;
    display: flex;
    align-items: center;
    ${Logo} {
        width: 22px;
        height: 22px;
        display: inline;
        margin: 0 5px 0 0;
    }
`;
