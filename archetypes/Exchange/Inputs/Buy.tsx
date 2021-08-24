import React from 'react';
import { Input, Select, SelectOption, InnerInputText, HiddenExpand, Section } from '@components/General';
import styled from 'styled-components';
import { swapDefaults, useSwapContext, noDispatch } from '@context/SwapContext';
import { LeverageType, Pool, SideType } from '@libs/types/General';
import { LONG, LONG_MINT, SHORT_MINT, SIDE_MAP } from '@libs/constants';
import { Label, InputContainer, ExchangeButton } from '.';
import { usePool, usePoolActions } from '@context/PoolContext';
import TimeLeft from '@components/TimeLeft';
import BigNumber from 'bignumber.js';
import { calcLeverageLossMultiplier } from '@libs/utils/calcs';
import { toApproxCurrency } from '@libs/utils';

export default (() => {
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useSwapContext();

    const {
        leverage,
        selectedPool,
        side,
        amount,
        options: { leverageOptions, poolOptions, sides },
    } = swapState;

    const pool = usePool(selectedPool);
    const { commit, approve } = usePoolActions();

    return (
        <>
            <InputContainer>
                <Label>Market</Label>
                <Select
                    onChange={(e) => swapDispatch({ type: 'setSelectedPool', value: e.currentTarget.value as string })}
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
            </InputContainer>
            <InputContainer>
                <Label>Side</Label>
                <Select
                    onChange={(e) =>
                        swapDispatch({ type: 'setSide', value: parseInt(e.currentTarget.value) as SideType })
                    }
                    disabled={!selectedPool}
                >
                    {sides.map((sideOption) => (
                        <SelectOption
                            key={`side-dropdown-option-${sideOption}`}
                            value={sideOption}
                            selected={side === sideOption}
                        >
                            {SIDE_MAP[sideOption]}
                        </SelectOption>
                    ))}
                </Select>
            </InputContainer>
            <InputContainer>
                <Label>Leverage</Label>
                <Select
                    onChange={(e) =>
                        swapDispatch({ type: 'setLeverage', value: parseInt(e.currentTarget.value) as LeverageType })
                    }
                    disabled={!selectedPool}
                >
                    {leverageOptions.map((option) => (
                        <SelectOption
                            key={`leverage-dropdown-option-${option}`}
                            value={option}
                            selected={leverage === option}
                        >
                            {option}x
                        </SelectOption>
                    ))}
                </Select>
            </InputContainer>
            <InputContainer>
                <Label>Amount</Label>
                <Wrapper>
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
                        Max
                    </InnerInputText>
                </Wrapper>
                <div>
                    {`Available: ${toApproxCurrency(pool.quoteToken.balance)}`}
                    {!!amount ? ` > ${toApproxCurrency(pool.quoteToken.balance.minus(amount))}` : ''}
                </div>
            </InputContainer>
            <Summary pool={pool} isLong={side === LONG} amount={amount} />
            {!pool.quoteToken.approved ? (
                <ExchangeButton
                    disabled={!selectedPool}
                    onClick={(_e) => {
                        if (!approve) {
                            return;
                        }
                        approve(selectedPool ?? '');
                    }}
                >
                    Approve
                </ExchangeButton>
            ) : null}
            <ExchangeButton
                disabled={!selectedPool || !pool.quoteToken.approved}
                onClick={(_e) => {
                    if (!commit) {
                        return;
                    }
                    commit(selectedPool ?? '', side === LONG ? LONG_MINT : SHORT_MINT, amount);
                }}
            >
                Buy
            </ExchangeButton>
        </>
    );
}) as React.FC;

const Wrapper = styled.div`
    position: relative;
    height: 25px;
    width: 150px;
    border-radius: 5px;
    border: 1px solid #000;
    ${Input} {
        width: 100%;
        border-radius: 5px;
    }
`;

const Summary: React.FC<{
    pool: Pool;
    isLong: boolean;
    amount: number;
}> = ({ pool, isLong, amount }) => {
    return (
        <HiddenExpand defaultHeight={0} open={!!pool.name}>
            <Box>
                <Token>{isLong ? pool.longToken.name : pool.shortToken.name}</Token>
                <Section label="Receive In">
                    <TimeLeft targetTime={Date.now() / 1000 + 100} />
                </Section>
                <Section label="Expected Token Price">{`${toApproxCurrency(pool.oraclePrice)}`}</Section>
                <Section label="Expected Number of Tokens">
                    {`${new BigNumber(amount).div(pool.oraclePrice).toFixed(3)}`}
                </Section>
                <Section label="Expected Rebalance Multiplier">
                    {`${calcLeverageLossMultiplier(pool.oraclePrice, pool.oraclePrice, pool.leverage).toFixed(3)}`}
                </Section>
            </Box>
        </HiddenExpand>
    );
};

const Box = styled.div`
    border: 2px solid var(--color-accent);
    border-radius: 20px;
    padding: 0.5rem;
`;

const Token = styled.h2``;
