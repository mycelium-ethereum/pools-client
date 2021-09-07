import React from 'react';
import { HiddenExpand, Section } from '@components/General';
import TimeLeft from '@components/TimeLeft';
import { Pool } from '@libs/types/General';
import { toApproxCurrency } from '@libs/utils/converters';
import { calcLeverageLossMultiplier, calcNotionalValue, calcTokenPrice } from '@libs/utils/calcs';
import { BigNumber } from 'bignumber.js';
import styled from 'styled-components';


type SummaryProps = {
    pool: Pool;
    amount: number;
    isLong: boolean;
    gasFee: number;
}

// const BuySummary
export const BuySummary: React.FC<SummaryProps> = ({ pool, amount, isLong, gasFee}) => {
    const token = isLong ? pool.longToken : pool.shortToken;
    const notional = isLong ? pool.longBalance : pool.shortBalance;

    return (
        <StyledHiddenExpand defaultHeight={0} open={!!pool.name && !!amount}>
            <Box>
                <Token>{token.name}</Token>
                <Section label="Expected Token Price">{`${toApproxCurrency(calcTokenPrice(notional, token.supply))}`}</Section>
                <Section label="Oracle Price">{`${toApproxCurrency(pool.oraclePrice)}`}</Section>
                <Section label="Expected Number of Tokens">
                    {`${new BigNumber(amount).div(pool.oraclePrice).toFixed(3)}`}
                </Section>
                <Section label="Expected Gas Fee">
                    {`${gasFee} Gwei`}
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
}

export const SellSummary: React.FC<SummaryProps> = (({ pool, amount, isLong, gasFee }) => {
    const token = isLong ? pool.longToken : pool.shortToken;
    const notional = isLong ? pool.longBalance : pool.shortBalance;
    return (
        <StyledHiddenExpand defaultHeight={0} open={!!pool.name && !!amount}>
            <Box>
                <Token>{isLong ? pool.longToken.name : pool.shortToken.name}</Token>
                <Section label="Expected Token Price">{`${toApproxCurrency(calcTokenPrice(notional, token.supply))}`}</Section>
                <Section label="Expected Gas Fee">
                    {`${gasFee} Gwei`}
                </Section>
                <Section label="Expected return">
                    {`${toApproxCurrency(calcNotionalValue(pool.lastPrice, amount))}`}
                </Section>
                <Countdown>
                    {'Receive In'}
                    <TimeLeft targetTime={pool.lastUpdate.plus(pool.updateInterval).toNumber()} />
                </Countdown>
            </Box>
        </StyledHiddenExpand>
    )
})

const Token = styled.h2``;

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
