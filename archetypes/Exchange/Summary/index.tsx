import React from 'react';
import { HiddenExpand, Logo, Section, tokenSymbolToLogoTicker } from '@components/General';
import TimeLeft from '@components/TimeLeft';
import { Pool } from '@libs/types/General';
import { toApproxCurrency } from '@libs/utils/converters';
import { calcNextValueTransfer, calcNotionalValue, calcRebalanceRate, calcTokenPrice } from '@libs/utils/calcs';
import { BigNumber } from 'bignumber.js';
import styled from 'styled-components';

type SummaryProps = {
    pool: Pool;
    amount: number;
    isLong: boolean;
};

// const BuySummary
export const BuySummary: React.FC<SummaryProps> = ({ pool, amount, isLong }) => {
    const token = isLong ? pool.longToken : pool.shortToken;
    const notional = isLong ? pool.nextLongBalance : pool.nextShortBalance;

    const tokenPrice = calcTokenPrice(notional, token.supply);
    const amountBN = new BigNumber(amount);

    const balancesAfterAmount = {
        longBalance: pool.nextLongBalance.plus(isLong ? amountBN : 0),
        shortBalance: pool.nextLongBalance.plus(isLong ? 0 : amountBN),
    };

    const { longValueTransfer, shortValueTransfer } = calcNextValueTransfer(
        pool.lastPrice,
        pool.oraclePrice,
        new BigNumber(pool.leverage),
        balancesAfterAmount.longBalance,
        balancesAfterAmount.shortBalance,
    );

    return (
        <HiddenExpand defaultHeight={0} open={!!pool.name && !!amount}>
            <Box>
                <h2>
                    <Logo className="inline w-6 mr-2" ticker={tokenSymbolToLogoTicker(token.symbol)} />
                    {token.name}
                </h2>
                <Section label="Expected number of tokens">
                    <div>
                        <span>{`${amountBN.div(tokenPrice ?? 1).toFixed(3)}`}</span>
                        <span className="opacity-50">{` @ ${toApproxCurrency(tokenPrice ?? 1)}`}</span>
                    </div>
                </Section>
                <Section label="Expected rebalancing rate">
                    {/*{`${calcLeverageLossMultiplier(pool.oraclePrice, pool.oraclePrice, pool.leverage).toFixed(3)}`}*/}
                    {`${calcRebalanceRate(
                        balancesAfterAmount.shortBalance.plus(shortValueTransfer),
                        balancesAfterAmount.longBalance.plus(longValueTransfer),
                    ).toFixed(3)}`}
                </Section>
                <Countdown>
                    {'Receive In'}
                    <TimeLeft targetTime={pool.lastUpdate.plus(pool.updateInterval).toNumber()} />
                </Countdown>
            </Box>
        </HiddenExpand>
    );
};

export const SellSummary: React.FC<
    SummaryProps & {
        gasFee: number;
    }
> = ({ pool, amount, isLong }) => {
    const token = isLong ? pool.longToken : pool.shortToken;
    const notional = isLong ? pool.longBalance : pool.shortBalance;

    const tokenPrice = calcTokenPrice(notional, token.supply);

    return (
        <HiddenExpand defaultHeight={0} open={!!pool.name && !!amount}>
            <Box>
                <h2>
                    <Logo className="inline w-6 mr-2" ticker="USDC" />
                    USDC
                </h2>
                <Section label="Expected return">
                    {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount))}`}
                </Section>
                <Countdown>
                    {'Receive In'}
                    <TimeLeft targetTime={pool.lastUpdate.plus(pool.updateInterval).toNumber()} />
                </Countdown>
            </Box>
        </HiddenExpand>
    );
};

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
