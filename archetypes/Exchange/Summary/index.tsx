import React, { useMemo, useState } from 'react';
import { HiddenExpand, Section } from '@components/General';
import TimeLeft from '@components/TimeLeft';
import { toApproxCurrency } from '@libs/utils/converters';
import Button from '@components/General/Button';
import styled from 'styled-components';
import ArrowDown from '@public/img/general/caret-down-white.svg';

import { calcEffectiveLongGain, calcEffectiveShortGain, calcNotionalValue } from '@tracer-protocol/pools-js';
import { BigNumber } from 'bignumber.js';
import { Transition } from '@headlessui/react';
import { classNames } from '@libs/utils/functions';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';
import { PoolInfo } from '@context/PoolContext/poolDispatch';
import { KnownNetwork } from '@tracer-protocol/pools-js';

type SummaryProps = {
    pool: PoolInfo['poolInstance'];
    showBreakdown: boolean;
    amount: BigNumber;
    isLong: boolean;
    isMint: boolean;
    receiveIn: number;
};

// const Summary
export default (({ pool, showBreakdown, amount, isLong, isMint, receiveIn }) => {
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);

    const token = useMemo(() => (isLong ? pool.longToken : pool.shortToken), [isLong, pool.longToken, pool.shortToken]);

    const nextPoolState = useMemo(() => pool.getNextPoolState(), [pool.lastPrice]);

    const tokenPrice = useMemo(() => (isLong ? pool.getNextLongTokenPrice() : pool.getNextShortTokenPrice()), [isLong]);

    const totalCommitmentAmount = 2000;
    const totalGasFee = 1.78;
    const totalCost = totalCommitmentAmount + totalGasFee;
    const expectedAmount = amount.div(tokenPrice ?? 1).toFixed(3);
    const expectedPrice = ` at ${toApproxCurrency(tokenPrice ?? 1, 2)} USD/token`;
    const expectedTokensMinted = `${expectedAmount} ${token.name}`;
    // const commitAmount = totalCommitmentAmount;
    const poolPowerLeverage = pool.leverage;

    const balancesAfter = {
        longBalance: nextPoolState.expectedLongBalance.plus(isLong ? amount : 0),
        shortBalance: nextPoolState.expectedShortBalance.plus(isLong ? 0 : amount),
    };

    const effectiveGains = useMemo(() => {
        return isLong
            ? calcEffectiveLongGain(balancesAfter.shortBalance, balancesAfter.longBalance, new BigNumber(pool.leverage))
            : calcEffectiveShortGain(
                  balancesAfter.shortBalance,
                  balancesAfter.longBalance,
                  new BigNumber(pool.leverage),
              );
    }, [isLong, amount, balancesAfter.longBalance, balancesAfter.shortBalance]);

    //TODO remove when working on summary logic
    console.log(effectiveGains);

    return (
        <Container>
            <HiddenExpand
                defaultHeight={0}
                open={!!pool.name}
                className={classNames('hidden-expand', !!pool.name ? 'show-border' : 'border-transparent')}
            >
                <div className="wrapper">
                    <Transition
                        show={showBreakdown}
                        enter="transition-opacity duration-50 delay-100"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        {isMint ? (
                            <>
                                <Section label="Total Costs">
                                    <span className="sum">${totalCost}</span>
                                </Section>
                                {showTransactionDetails && (
                                    <div className="section-details">
                                        <Section label="Commit Amount" showSectionDetails>
                                            <div>
                                                <span className="opacity-50">${totalCommitmentAmount}</span>
                                            </div>
                                        </Section>
                                        <Section label="Gas Fee" showSectionDetails>
                                            <span className="opacity-50">${totalGasFee}</span>
                                        </Section>
                                    </div>
                                )}
                                <Section label="Expected Tokens Minted">
                                    <span className="sum">{expectedTokensMinted}</span>
                                </Section>
                                {showTransactionDetails && (
                                    <div className="section-details">
                                        <Section label="Expected Amount" showSectionDetails>
                                            <div>
                                                <span className="opacity-50">
                                                    {`${amount.div(tokenPrice ?? 1).toFixed(3)}`} tokens
                                                </span>
                                            </div>
                                        </Section>
                                        <Section label="Expected Price" showSectionDetails>
                                            <div>
                                                <span className="opacity-50">{expectedPrice}</span>
                                            </div>
                                        </Section>
                                    </div>
                                )}
                                <Section label="Expected Equivalent Exposure">
                                    <span className="text-green-500 font-semibold sum">0.02 BTC</span>
                                </Section>
                                {showTransactionDetails && (
                                    <>
                                        <Section label="Commit Amount (ETH) at $3,000 USD/ETH" showSectionDetails>
                                            <span className="opacity-50">0.01 BTC</span>
                                        </Section>
                                        <Section label="Pool Power Leverage" showSectionDetails>
                                            <span className="opacity-50">{poolPowerLeverage}</span>
                                        </Section>
                                    </>
                                )}
                                <ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                                    <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
                                </ShowDetailsButton>
                            </>
                        ) : (
                            <>
                                <Section label="Expected Token Value">
                                    <span className="sum">
                                        {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 3)}`} USDC
                                    </span>
                                </Section>
                                {showTransactionDetails && (
                                    <div className="section-details">
                                        <Section label="Tokens" showSectionDetails>
                                            <div>
                                                <span className="opacity-50">
                                                    {`${amount.div(tokenPrice ?? 1).toFixed(3)}`} tokens
                                                </span>
                                            </div>
                                        </Section>
                                        <Section label="Expected Price" showSectionDetails>
                                            <div>
                                                <span className="opacity-50">{expectedPrice}</span>
                                            </div>
                                        </Section>
                                    </div>
                                )}

                                <Section label="Expected Fees">
                                    <span className="sum">
                                        {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 3)}`} USDC
                                    </span>
                                </Section>
                                {showTransactionDetails && (
                                    <div className="section-details">
                                        <Section label="Protocol Fee" showSectionDetails>
                                            <div>
                                                <span className="opacity-50">
                                                    {`${amount.div(tokenPrice ?? 1).toFixed(3)}`} tokens
                                                </span>
                                            </div>
                                        </Section>
                                        <Section label="Gas Fee" showSectionDetails>
                                            <div>
                                                <span className="opacity-50">{expectedPrice}</span>
                                            </div>
                                        </Section>
                                    </div>
                                )}
                                <ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                                    <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
                                </ShowDetailsButton>
                            </>
                        )}
                    </Transition>
                    <div className="countdown">
                        {`${isMint ? 'Mint' : 'Burn'} in`}
                        <TimeLeft className="timeleft" targetTime={receiveIn} />
                    </div>
                </div>
            </HiddenExpand>
        </Container>
    );
}) as React.FC<SummaryProps>;

export const constructBalancerLink: (token: string | undefined, network: KnownNetwork, isBuy: boolean) => string = (
    token,
    network,
    isBuy,
) => {
    const { usdcAddress, balancerInfo } = networkConfig[network];
    // balancerInfo will not be undefined due to the network === ARBITRUM in BalancerLink
    return isBuy
        ? `${balancerInfo?.baseUri}/${usdcAddress}/${token}`
        : `${balancerInfo?.baseUri}/${token}/${usdcAddress}`;
};

const Container = styled.div`
    .hidden-expand {
        margin-bottom: 2rem !important;
        font-size: 1rem;
        line-height: 1.5rem;
        border-width: 1px;
        border-color: ${({ theme }) => theme['border-secondary']};
        background-color: ${({ theme }) => theme.background};

        .show-border {
            border-color: ${({ theme }) => theme.border};
        }
    }

    .wrapper {
        padding: 1.5rem 1rem 0;
        position: relative;

        .section-details {
            margin-bottom: 5px;
            margin-top: -4px;
        }

        .countdown {
            position: absolute;
            top: -1rem;
            left: 1.5rem;
            padding: 0.375rem;
            font-size: 0.875rem;
            line-height: 1.25rem;
            border-radius: 0.25rem;
            background-color: ${({ theme }) => theme.background};
            z-index: 2;
            font-size: 16px;

            .timeleft {
                display: inline;
                padding: 0.25rem 0.375rem;
                margin-left: 0.375rem;
                border-radius: 0.5rem;
                border-width: 1px;
                background-color: ${({ theme }) => theme['button-bg']};
                border-color: ${({ theme }) => theme['border-secondary']};
            }
        }

        .sum {
            font-size: 16px;
        }
    }
`;

const ShowDetailsButton = styled(Button)`
    width: calc(100% + 2rem);
    margin: 23px -1rem 0;
    background-color: ${({ theme }) => theme['border-secondary']} !important;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
    height: 30px;
    text-align: center;

    svg {
        margin: 0 auto;
        path {
            fill: ${({ theme }) => theme.text} !important;
        }
    }

    .open {
        -webkit-transform: rotateX(180deg);
        transform: rotateX(180deg);
    }
`;
