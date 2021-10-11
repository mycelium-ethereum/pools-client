import React, { useMemo } from 'react';
import { HiddenExpand, Logo, Section, tokenSymbolToLogoTicker } from '@components/General';
import TimeLeft from '@components/TimeLeft';
import { Pool } from '@libs/types/General';
import { toApproxCurrency } from '@libs/utils/converters';
import { calcNotionalValue, calcRebalanceRate, calcTokenPrice } from '@libs/utils/calcs';
import { BigNumber } from 'bignumber.js';
import { Transition } from '@headlessui/react';
import { classNames } from '@libs/utils/functions';
import Link from '/public/img/general/link.svg';

type SummaryProps = {
    pool: Pool;
    amount: BigNumber;
    isLong: boolean;
    receiveIn: number;
};

const countdown = 'absolute left-6 -top-4 text-sm z-[2] p-1.5 rounded bg-theme-background';
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
                    <Section label="Expected rebalancing rate">
                        {`${calcRebalanceRate(balancesAfter.shortBalance, balancesAfter.longBalance).toFixed(3)}`}
                    </Section>
                    <BalancerLink tokenName={token.name} isBuy={true} />
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
                    <BalancerLink tokenName={token.name} isBuy={false} />
                </Transition>
                <div className={countdown}>
                    {'Receive In'}
                    <TimeLeft className={timeLeft} targetTime={receiveIn} />
                </div>
            </div>
        </HiddenExpand>
    );
};

const USDC = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8';

const constructBalancerLink = (token: string, isBuy: boolean) =>
    isBuy
        ? `https://arbitrum.balancer.fi/#/trade/${USDC}/${tokenMappings[token]}`
        : `https://arbitrum.balancer.fi/#/trade/${tokenMappings[token]}/${USDC}`;

const tokenMappings: Record<string, string> = {
    '1L-ETH/USD': '0x38c0a5443c7427e65A9Bf15AE746a28BB9a052cc',
    '1S-ETH/USD': '0xf581571DBcCeD3A59AaaCbf90448E7B3E1704dcD',
    '3L-ETH/USD': '0xaA846004Dc01b532B63FEaa0b7A0cB0990f19ED9',
    '3S-ETH/USD': '0x7d7E4f49a29dDA8b1eCDcf8a8bc85EdcB234E997',
    '1L-BTC/USD': '0x1616bF7bbd60E57f961E83A602B6b9Abb6E6CAFc',
    '1S-BTC/USD': '0x052814194f459aF30EdB6a506eABFc85a4D99501',
    '3L-BTC/USD': '0x05A131B3Cd23Be0b4F7B274B3d237E73650e543d',
};

const BalancerLink: React.FC<{ tokenName: string; isBuy: boolean }> = ({ tokenName, isBuy }) => {
    const balancerLink = tokenMappings[tokenName];
    return !balancerLink ? null : (
        <div className="text-sm p-1.5">
            <div className="mr-2 whitespace-nowrap">Dont want to wait?</div>
            <div>
                <Logo className="inline mr-2" ticker="BALANCER" />
                <a
                    className="text-tracer-400 matrix:text-theme-primary underline hover:opacity-80"
                    href={constructBalancerLink(tokenName, isBuy)}
                    target={'_blank'}
                    rel={'noopener noreferrer'}
                >
                    {`${isBuy ? 'Buy' : 'Sell'} on Balancer Pools`}
                    <Link className="inline ml-2 h-4 w-4 text-theme-text opacity-80" />
                </a>
            </div>
        </div>
    );
};
