import React, { useMemo, useState } from 'react';
import { HiddenExpand, Section, Logo, tokenSymbolToLogoTicker } from '@components/General';
import TimeLeft from '@components/TimeLeft';
import { toApproxCurrency } from '@libs/utils/converters';
import Button from '@components/General/Button';
import styled from 'styled-components';
import ArrowDown from '@public/img/general/caret-down-white.svg';

import { calcEffectiveLongGain, calcEffectiveShortGain, calcNotionalValue } from '@tracer-protocol/pools-js';
import { BigNumber } from 'bignumber.js';
import { Transition } from '@headlessui/react';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';
import { PoolInfo } from '@context/PoolContext/poolDispatch';
import { KnownNetwork } from '@tracer-protocol/pools-js';

type SummaryProps = {
    pool: PoolInfo['poolInstance'];
    showBreakdown: boolean;
    amount: BigNumber;
    isLong: boolean;
    commitAction: string;
    receiveIn: number;
    inputAmount: number;
    mintGasFee: any;
};

export default (({ pool, showBreakdown, amount, isLong, receiveIn, inputAmount, commitAction, mintGasFee }) => {
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);

    const token = useMemo(() => (isLong ? pool.longToken : pool.shortToken), [isLong, pool.longToken, pool.shortToken]);
    const nextPoolState = useMemo(() => pool.getNextPoolState(), [pool.lastPrice]);
    const tokenPrice = useMemo(() => (isLong ? pool.getNextLongTokenPrice() : pool.getNextShortTokenPrice()), [isLong]);

    const totalCommitmentAmount = inputAmount ? toApproxCurrency(inputAmount) : 0;
    const totalGasFee = mintGasFee;
    const totalCost = toApproxCurrency(inputAmount);
    const expectedAmount = amount.div(tokenPrice ?? 1).toFixed(0);
    const expectedPrice = ` at ${toApproxCurrency(tokenPrice ?? 1, 2)} USD/token`;
    const expectedTokensMinted = `${Number(expectedAmount) > 0 ? expectedAmount : ''} ${token.name}`;
    const poolPowerLeverage = pool.leverage;
    const selectedToken = pool?.name?.split('-')[1]?.split('/')[0];
    const selectedTokenOraclePrice = toApproxCurrency(pool.oraclePrice);
    const equivalentExposureBTC = (inputAmount / pool.oraclePrice.toNumber()) * poolPowerLeverage;
    const commitAmountBTC = inputAmount / pool.oraclePrice.toNumber();

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
        <HiddenExpandStyled defaultHeight={0} open={!!pool.name} showBorder={!!pool.name}>
            <Wrapper>
                <Transition
                    show={showBreakdown}
                    enter="transition-opacity duration-50 delay-100"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    {commitAction === 'mint' && (
                        <>
                            <Section label="Total Costs">
                                <SumText>{totalCost}</SumText>
                            </Section>
                            {showTransactionDetails && (
                                <SectionDetails>
                                    <Section label="Commit Amount" showSectionDetails>
                                        <div>
                                            <span className="opacity-50">{totalCommitmentAmount}</span>
                                        </div>
                                    </Section>
                                    <Section label="Gas Fee" showSectionDetails>
                                        <span className="opacity-50">
                                            {totalGasFee < 0.001
                                                ? '< $0.001'
                                                : toApproxCurrency(totalGasFee.toFixed(3))}
                                        </span>
                                    </Section>
                                </SectionDetails>
                            )}
                            <Section label="Expected Tokens Minted">
                                <SumText>{expectedTokensMinted}</SumText>
                            </Section>
                            {showTransactionDetails && (
                                <SectionDetails>
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
                                </SectionDetails>
                            )}
                            <Section label="Expected Equivalent Exposure">
                                <SumText setColor="green">{equivalentExposureBTC.toFixed(3)} BTC</SumText>
                            </Section>
                            {showTransactionDetails && (
                                <>
                                    <Section
                                        label={`Commit Amount (${selectedToken}) at ${selectedTokenOraclePrice} USD/${selectedToken}`}
                                        showSectionDetails
                                    >
                                        <span className="opacity-50">{commitAmountBTC.toFixed(3)} BTC</span>
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
                    )}

                    {commitAction === 'burn' && (
                        <>
                            <Section label="Expected Token Value">
                                <SumText>
                                    {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 2)}`} USDC
                                </SumText>
                            </Section>
                            {showTransactionDetails && (
                                <SectionDetails>
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
                                </SectionDetails>
                            )}

                            <Section label="Expected Fees">
                                <SumText>
                                    {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 3)}`} USDC
                                </SumText>
                            </Section>
                            {showTransactionDetails && (
                                <SectionDetails>
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
                                </SectionDetails>
                            )}
                            <ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                                <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
                            </ShowDetailsButton>
                        </>
                    )}

                    {commitAction === 'flip' && (
                        <>
                            <Section label="Receive">
                                <SumText>
                                    <Logo
                                        className="inline mr-2"
                                        size="md"
                                        ticker={tokenSymbolToLogoTicker(token.symbol)}
                                    />
                                    {token.name}
                                </SumText>
                            </Section>
                            <Divider />

                            <Section label="Expected Amount">
                                <SumText>
                                    {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 3)}`} USDC
                                </SumText>
                            </Section>
                            {showTransactionDetails && (
                                <SectionDetails>
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
                                </SectionDetails>
                            )}

                            <Section label="Expected Fees">
                                <SumText>
                                    {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 3)}`} USDC
                                </SumText>
                            </Section>
                            {showTransactionDetails && (
                                <SectionDetails>
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
                                </SectionDetails>
                            )}

                            <Section label="Expected Exposure">
                                <SumText setColor="red">0.02 BTC</SumText>
                            </Section>
                            {showTransactionDetails && (
                                <SectionDetails>
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
                                </SectionDetails>
                            )}
                            <ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                                <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
                            </ShowDetailsButton>
                        </>
                    )}
                </Transition>
                <Countdown>
                    {`${commitAction} in`}
                    <TimeLeftStyled className="timeleft" targetTime={receiveIn} />
                </Countdown>
            </Wrapper>
        </HiddenExpandStyled>
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

const HiddenExpandStyled = styled(HiddenExpand)<{ showBorder: boolean }>`
    margin-bottom: 2rem !important;
    font-size: 1rem;
    line-height: 1.5rem;
    border-width: 1px;
    background-color: ${({ theme }) => theme.background};
    border-color: ${({ showBorder, theme }) => (showBorder ? theme['border-secondary'] : 'transparent')};
`;

const Wrapper = styled.div`
    padding: 1.5rem 1rem 0;
    position: relative;
`;

const SectionDetails = styled.div`
    margin-bottom: 5px;
    margin-top: -4px;
`;

const Countdown = styled.div`
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
    text-transform: capitalize;
`;

const TimeLeftStyled = styled(TimeLeft)`
    display: inline;
    padding: 0.25rem 0.375rem;
    margin-left: 0.375rem;
    border-radius: 0.5rem;
    border-width: 1px;
    background-color: ${({ theme }) => theme['button-bg']};
    border-color: ${({ theme }) => theme['border-secondary']};
`;

const SumText = styled.span<{ setColor?: string }>`
    font-size: 16px;

    ${({ setColor }) => {
        if (setColor === 'green') {
            return `
                font-weight: 600;
                color: #10b981;
                `;
        } else if (setColor === 'red') {
            return `
                font-weight: 600;
                color: #ef4444;
            `;
        }
    }}
`;

const Divider = styled.hr`
    margin: 10px 0;
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
