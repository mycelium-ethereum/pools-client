import React, { useMemo, useState, useEffect } from 'react';
import { HiddenExpand, Logo, Section, tokenSymbolToLogoTicker } from '@components/General';
import TimeLeft from '@components/TimeLeft';
import { Pool } from '@libs/types/General';
import { toApproxCurrency } from '@libs/utils/converters';
import { calcNotionalValue, calcRebalanceRate, calcTokenPrice } from '@libs/utils/calcs';
import { BigNumber } from 'bignumber.js';
import styled from 'styled-components';
import { Transition } from '@headlessui/react';
import { classNames } from '@libs/utils/functions';
import useIntervalCheck from '@libs/hooks/useIntervalCheck';

type SummaryProps = {
    pool: Pool;
    amount: BigNumber;
    isLong: boolean;
};

// returns the timestamp when a commit is expected to be executed
const expectedCommitExecution: (
    lastUpdate: BigNumber,
    updateInterval: BigNumber,
    frontRunningInterval: BigNumber,
) => number = (lastUpdate, updateInterval, frontRunningInterval) => {
    const [expectedRebalance, setExpectedRebalance] = useState(0);

    const beforeFrontRunning = useIntervalCheck(expectedRebalance, frontRunningInterval.toNumber());

    useEffect(() => {
        setExpectedRebalance(lastUpdate.plus(updateInterval).toNumber());
    }, [lastUpdate, updateInterval]);

    useEffect(() => {
        if (!beforeFrontRunning) {
            // commit will be executed next epoch
            // this is not really the true update interval value
            // the true update will be lastUpdate + updateInterval + updateInterval
            // assuming lastUpdate gets updaated
            console.log('Setting next update');
            if (!lastUpdate.eq(0)) {
                const nextUpdate = lastUpdate.plus(updateInterval.times(2)).toNumber();
                setExpectedRebalance(Math.floor(nextUpdate));
            }
        }
    }, [beforeFrontRunning]);

    return expectedRebalance;
};

// const BuySummary
export const BuySummary: React.FC<SummaryProps> = ({ pool, amount, isLong }) => {
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
    const balancesAfter = {
        longBalance: pool.nextLongBalance.plus(isLong ? amount : 0).plus(pool.committer.pendingLong.mint),
        shortBalance: pool.nextShortBalance.plus(isLong ? 0 : amount).plus(pool.committer.pendingShort.mint),
    };

    const receiveIn = expectedCommitExecution(pool.lastUpdate, pool.updateInterval, pool.frontRunningInterval);

    return (
        <HiddenExpand
            defaultHeight={0}
            open={!!pool.name}
            className={classNames(
                'border-2xl border text-base',
                !!pool.name ? 'border-cool-gray-200' : 'border-transparent',
            )}
        >
            <Box>
                <h2>
                    <Logo className="inline w-6 mr-2" ticker={tokenSymbolToLogoTicker(token.symbol)} />
                    {token.name}
                </h2>
                <Transition
                    show={!amount.eq(0)}
                    enter="transition-opacity duration-50 delay-100"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Section label="Expected number of tokens">
                        <div>
                            <span>{`${amount.div(tokenPrice ?? 1).toFixed(3)}`}</span>
                            <span className="opacity-50">{` @ ${toApproxCurrency(tokenPrice ?? 1)}`}</span>
                        </div>
                    </Section>
                    <Section label="Expected rebalancing rate">
                        {`${calcRebalanceRate(balancesAfter.shortBalance, balancesAfter.longBalance).toFixed(3)}`}
                    </Section>
                </Transition>
                <Countdown>
                    {'Receive In'}
                    <TimeLeft targetTime={receiveIn} />
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

    const receiveIn = expectedCommitExecution(pool.lastUpdate, pool.updateInterval, pool.frontRunningInterval);

    return (
        <HiddenExpand
            defaultHeight={0}
            open={!!pool.name}
            className={classNames(
                'border-2x border text-base',
                !!pool.name ? 'border-cool-gray-200' : 'border-transparent',
            )}
        >
            <Box>
                <h2>
                    <Logo className="inline w-6 mr-2" ticker="USDC" />
                    USDC
                </h2>
                <Transition
                    show={!amount.eq(0)}
                    enter="transition-opacity duration-50 delay-100"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Section label="Expected return">
                        {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount))}`}
                    </Section>
                </Transition>
                <Countdown>
                    {'Receive In'}
                    <TimeLeft targetTime={receiveIn} />
                </Countdown>
            </Box>
        </HiddenExpand>
    );
};

const Box = styled.div`
    box-sizing: border-box;
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
