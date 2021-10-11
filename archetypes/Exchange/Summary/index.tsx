import React, { useMemo } from 'react';
import { HiddenExpand, Logo, Section, tokenSymbolToLogoTicker } from '@components/General';
import TimeLeft from '@components/TimeLeft';
import { Pool } from '@libs/types/General';
import { toApproxCurrency } from '@libs/utils/converters';
import { calcEffectiveLongGain, calcEffectiveShortGain, calcNotionalValue, calcTokenPrice } from '@tracer-protocol/tracer-pools-utils';
import { BigNumber } from 'bignumber.js';
import { Transition } from '@headlessui/react';
import { classNames } from '@libs/utils/functions';

type SummaryProps = {
    pool: Pool;
    amount: BigNumber;
    isLong: boolean;
    receiveIn: number;
};

const countdown = 'absolute left-[1.5rem] top-[-1rem] text-sm z-[2] p-1.5 rounded bg-theme-background';
const timeLeft = 'inline bg-theme-button-bg border border-theme-border ml-1.5 px-1.5 py-1 rounded-lg';

// const BuySummary
export const BuySummary: React.FC<SummaryProps> = ({ pool, amount, isLong, receiveIn }) => {
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
    
    const effectiveGains = useMemo(() => {
        return (
            isLong 
            ? calcEffectiveLongGain(balancesAfter.shortBalance, balancesAfter.longBalance, new BigNumber(pool.leverage))
            : calcEffectiveShortGain(balancesAfter.shortBalance, balancesAfter.longBalance, new BigNumber(pool.leverage))
        )
    }, [isLong, amount, balancesAfter.longBalance, balancesAfter.shortBalance])

    return (
        <HiddenExpand
            defaultHeight={0}
            open={!!pool.name}
            className={classNames(
                'border-2xl border text-base bg-theme-background',
                !!pool.name ? 'border-theme-border' : 'border-transparent',
            )}
        >
            <div className="relative border-box px-4 pt-4 pb-2">
                <h2 className="text-theme-text">
                    <Logo className="inline mr-2" size="md" ticker={tokenSymbolToLogoTicker(token.symbol)} />
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
                    <Section label="Expected Leverage">
                        <div>
                            <span className="opacity-60">{`Gains: `}</span>
                            <span className={classNames(
                                'mr-2',
                                effectiveGains.gt(pool.leverage)? 'text-green-500' : 'text-red-500'
                            )}>
                                {effectiveGains.toFixed(2)}x
                            </span>
                            <span className="opacity-60">{`Losses: `}</span>
                            {pool.leverage}x
                        </div>
                    </Section>
                </Transition>
                <div className={countdown}>
                    {'Receive In'}
                    <TimeLeft className={timeLeft} targetTime={receiveIn} />
                </div>
            </div>
        </HiddenExpand>
    );
};

// const SellSummary
export const SellSummary: React.FC<SummaryProps> = ({ pool, amount, isLong, receiveIn }) => {
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

    return (
        <HiddenExpand
            defaultHeight={0}
            open={!!pool.name}
            className={classNames(
                'border-2x border text-base',
                !!pool.name ? 'border-theme-border' : 'border-transparent',
            )}
        >
            <div className="relative border-box px-4 pt-4 pb-2">
                <h2 className="text-theme-text">
                    <Logo className="inline mr-2" size={'md'} ticker="USDC" />
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
                <div className={countdown}>
                    {'Receive In'}
                    <TimeLeft className={timeLeft} targetTime={receiveIn} />
                </div>
            </div>
        </HiddenExpand>
    );
};
