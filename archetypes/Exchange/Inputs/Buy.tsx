import React from 'react';
import { Input, Select, SelectOption, InnerInputText, InputWrapper } from '@components/General/Input';
import { HiddenExpand, Logo, Section } from '@components/General';
import styled from 'styled-components';
import { swapDefaults, useSwapContext, noDispatch } from '@context/SwapContext';
import { Pool, SideType } from '@libs/types/General';
import { LONG, LONG_MINT, SHORT_MINT } from '@libs/constants';
import { Label, ExchangeButton } from '.';
import { usePool, usePoolActions } from '@context/PoolContext';
import TimeLeft from '@components/TimeLeft';
import BigNumber from 'bignumber.js';
import { calcLeverageLossMultiplier } from '@libs/utils/calcs';
import { toApproxCurrency } from '@libs/utils';
import SlideSelect, { Option } from '@components/General/SlideSelect';

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
                        onChange={(e) => {
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
            <Summary pool={pool} isLong={side === LONG} amount={amount} />
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

const Summary: React.FC<{
    pool: Pool;
    isLong: boolean;
    amount: number;
}> = ({ pool, isLong, amount }) => {
    return (
        <StyledHiddenExpand defaultHeight={0} open={!!pool.name}>
            <Box>
                <Token>{isLong ? pool.longToken.name : pool.shortToken.name}</Token>

                <Section label="Expected Token Price">{`${toApproxCurrency(pool.oraclePrice)}`}</Section>
                <Section label="Expected Number of Tokens">
                    {`${new BigNumber(amount).div(pool.oraclePrice).toFixed(3)}`}
                </Section>
                <Section label="Expected Rebalance Multiplier">
                    {`${calcLeverageLossMultiplier(pool.oraclePrice, pool.oraclePrice, pool.leverage).toFixed(3)}`}
                </Section>
                <Countdown>
                    {'Receive In'}
                    <TimeLeft targetTime={pool.lastUpdate.plus(pool.updateInterval).toNumber()} />
                </Countdown>
            </Box>
        </StyledHiddenExpand>
    );
};

const StyledHiddenExpand = styled(HiddenExpand)`
    overflow: visible;
`;

const Box = styled.div`
    border: 1px solid #e5e7eb;
    box-sizing: border-box;
    border-radius: 14px;
    position: relative;
    padding: 1rem 1rem 0.5rem 1rem;

    ${Section}, ${Section} .label {
        color: #374151;
    }
`;

const Countdown = styled.div`
    position: absolute;
    background: #fff;
    left: 1.5rem;
    top: -1rem;
    height: 2rem;
    font-size: 1rem;
    z-index: 2;
    padding 0 5px;

    ${TimeLeft} {
        display: inline;
        background: #FAFAFA;
        border: 1px solid #E4E4E7;
        margin-left: 5px;
        padding: 0 5px;
        border-radius: 10px;
        color: #6B7280;
    }
`;

const HelperText = styled.p`
    color: #6b7280;
    font-size: 14px;

    a {
        text-decoration: underline;
        cursor: pointer;
    }
`;

const Token = styled.h2``;

const MarketSelect = styled(Select)`
    width: 285px;
    height: 55px;
    padding: 13px 20px;

    @media (max-width: 611px) {
        width: 156px;
        height: 44px;
    }
`;

const StyledSlideSelect = styled(SlideSelect)`
    border: 1px solid #d1d5db;
    background: #f9fafb;

    &.side {
        width: 180px;
        height: 55px;
    }

    &.leverage {
        width: 110px;
        height: 55px;
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

export const InputRow = styled.div`
    position: relative;
    margin: 1rem 0;
    &.markets {
        display: flex;
        justify-content: space-between;
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
