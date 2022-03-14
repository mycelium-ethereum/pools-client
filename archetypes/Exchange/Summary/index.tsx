import React, { useMemo, useState } from 'react';
import { HiddenExpand, Section, Logo, tokenSymbolToLogoTicker } from '@components/General';
import TimeLeft from '@components/TimeLeft';
import { toApproxCurrency } from '@libs/utils/converters';
import Button from '@components/General/Button';
import styled from 'styled-components';
import ArrowDown from '@public/img/general/caret-down-white.svg';

import { calcNotionalValue } from '@tracer-protocol/pools-js';
import { BigNumber } from 'bignumber.js';
import { Transition } from '@headlessui/react';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';
import { PoolInfo } from '@context/PoolContext/poolDispatch';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { CommitActionEnum } from '@libs/constants';

type SummaryProps = {
    pool: PoolInfo['poolInstance'];
    showBreakdown: boolean;
    amount: BigNumber;
    isLong: boolean;
    commitAction: CommitActionEnum;
    receiveIn: number;
    gasFee?: string;
};

export default (({ pool, showBreakdown, amount, isLong, receiveIn, commitAction, gasFee }) => {
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);

    const token = useMemo(() => (isLong ? pool.longToken : pool.shortToken), [isLong, pool.longToken, pool.shortToken]);
    const flippedToken = useMemo(
        () => (isLong ? pool.shortToken : pool.longToken),
        [isLong, pool.longToken, pool.shortToken],
    );
    const [tokenPrice, flippedTokenPrice] = useMemo(
        () =>
            isLong
                ? [pool.getNextLongTokenPrice(), pool.getNextShortTokenPrice()]
                : [pool.getNextShortTokenPrice(), pool.getNextLongTokenPrice()],
        [isLong],
    );

    const amountNumber: number = amount.toNumber();
    const totalCommitmentAmount: string = amountNumber ? toApproxCurrency(amountNumber) : '0';
    const totalCost: string = amountNumber <= 0 ? '0' : toApproxCurrency(amountNumber);
    const expectedAmount: string = amount.div(tokenPrice ?? 1).toFixed(0);

    const flippedAmount: BigNumber = calcNotionalValue(tokenPrice, amount);
    const flippedExpectedAmount: string = flippedAmount.div(flippedTokenPrice ?? 1).toFixed(0);

    const expectedPrice = ` at ${toApproxCurrency(tokenPrice ?? 1, 2)} USD/token`;
    const flippedExpectedPrice = ` at ${toApproxCurrency(flippedTokenPrice ?? 1, 2)} USD/token`;
    const expectedTokensMinted = `${Number(expectedAmount) > 0 ? expectedAmount : ''} ${token.symbol}`;
    const flippedExpectedTokensMinted: string =
        amountNumber > 0 ? `${flippedExpectedAmount} ${flippedToken.symbol}` : '0';
    const poolPowerLeverage: number = pool.leverage;
    const selectedToken: string = pool.name?.split('-')[1]?.split('/')[0];
    const selectedTokenOraclePrice: string = toApproxCurrency(pool.oraclePrice);
    const equivalentExposure: number = (amountNumber / pool.oraclePrice.toNumber()) * poolPowerLeverage;
    const flippedEquivalentExposure: number =
        (flippedAmount.toNumber() / pool.oraclePrice.toNumber()) * poolPowerLeverage;
    const commitAmount: number = amountNumber / pool.oraclePrice.toNumber();
    const flippedCommitAmount: number = flippedAmount.toNumber() / pool.oraclePrice.toNumber();

    const getCommitGasFee = () => {
        const fee = Number(gasFee);
        if (amountNumber === 0) {
            return 0;
        } else if (fee < 0.001) {
            return '< $0.001';
        } else {
            return toApproxCurrency(fee);
        }
    };

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
                    {commitAction === CommitActionEnum.mint && (
                        <>
                            <Section label="Total Costs" className="header">
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
                                        <span className="opacity-50">{getCommitGasFee()}</span>
                                    </Section>
                                </SectionDetails>
                            )}
                            <Section label="Expected Tokens Minted" className="header">
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
                            <Section label="Expected Equivalent Exposure" className="header">
                                <SumText setColor="green">
                                    {equivalentExposure.toFixed(3)} {selectedToken}
                                </SumText>
                            </Section>
                            {showTransactionDetails && (
                                <SectionDetails>
                                    <Section
                                        label={`Commit Amount (${selectedToken}) at ${selectedTokenOraclePrice} USD/${selectedToken}`}
                                        showSectionDetails
                                    >
                                        <span className="opacity-50">
                                            {commitAmount.toFixed(3)} {selectedToken}
                                        </span>
                                    </Section>
                                    <Section label="Pool Power Leverage" showSectionDetails>
                                        <span className="opacity-50">{poolPowerLeverage}</span>
                                    </Section>
                                </SectionDetails>
                            )}
                            <ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                                <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
                            </ShowDetailsButton>
                        </>
                    )}

                    {commitAction === CommitActionEnum.burn && (
                        <>
                            <Section label="Expected Token Value" className="header">
                                <SumText>
                                    {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 2)} ${
                                        pool.quoteToken.symbol
                                    }`}
                                </SumText>
                            </Section>
                            {showTransactionDetails && (
                                <SectionDetails>
                                    <Section label="Tokens" showSectionDetails>
                                        <div>
                                            <span className="opacity-50">{`${amount}`} tokens</span>
                                        </div>
                                    </Section>
                                    <Section label="Expected Price" showSectionDetails>
                                        <div>
                                            <span className="opacity-50">{expectedPrice}</span>
                                        </div>
                                    </Section>
                                </SectionDetails>
                            )}

                            <Section label="Expected Fees" className="header">
                                <SumText>
                                    {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 3)} ${
                                        pool.quoteToken.symbol
                                    }`}
                                </SumText>
                            </Section>
                            {showTransactionDetails && (
                                <SectionDetails>
                                    {/* <Section label="Protocol Fee" showSectionDetails>
                                        <div>
                                            <span className="opacity-50">
                                                {`${amount.div(tokenPrice ?? 1).toFixed(3)}`} tokens
                                            </span>
                                        </div>
                                    </Section> */}
                                    <Section label="Gas Fee" showSectionDetails>
                                        <div>
                                            <span className="opacity-50">{getCommitGasFee()}</span>
                                        </div>
                                    </Section>
                                </SectionDetails>
                            )}
                            <ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                                <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
                            </ShowDetailsButton>
                        </>
                    )}

                    {commitAction === CommitActionEnum.flip && (
                        <>
                            <Section label="Receive" className="header">
                                <SumText>
                                    <Logo
                                        className="inline mr-2"
                                        size="md"
                                        ticker={tokenSymbolToLogoTicker(flippedToken.symbol)}
                                    />
                                    {flippedToken.symbol}
                                </SumText>
                            </Section>
                            <Divider />

                            <Section label="Expected Amount" className="header">
                                <SumText>
                                    {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 3)} ${
                                        flippedToken.symbol
                                    }`}
                                </SumText>
                            </Section>
                            {showTransactionDetails && (
                                <SectionDetails>
                                    <Section
                                        label={`Expected ${isLong ? 'Long' : 'Short'} Token Value`}
                                        showSectionDetails
                                    >
                                        <div>
                                            <span className="opacity-50">
                                                {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 2)} `}
                                                USDC
                                            </span>
                                        </div>
                                    </Section>
                                    <Section
                                        label={`Expected ${isLong ? 'Short' : 'Long'} Token Price`}
                                        showSectionDetails
                                    >
                                        <div>
                                            <span className="opacity-50">{flippedExpectedPrice}</span>
                                        </div>
                                    </Section>
                                    <Section
                                        label={`Expected Amount of ${isLong ? 'Short' : 'Long'} Tokens`}
                                        showSectionDetails
                                    >
                                        <div>
                                            <span className="opacity-50">{flippedExpectedTokensMinted}</span>
                                        </div>
                                    </Section>
                                </SectionDetails>
                            )}

                            <Section label="Expected Fees" className="header">
                                <SumText>
                                    {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 3)} ${
                                        pool.quoteToken.symbol
                                    }`}
                                </SumText>
                            </Section>
                            {showTransactionDetails && (
                                <SectionDetails>
                                    {/* <Section label="Protocol Fee" showSectionDetails>
                                        <div>
                                            <span className="opacity-50">
                                                {`${amount.div(tokenPrice ?? 1).toFixed(3)}`} tokens
                                            </span>
                                        </div>
                                    </Section> */}
                                    <Section label="Gas Fee" showSectionDetails>
                                        <div>
                                            <span className="opacity-50">{getCommitGasFee()}</span>
                                        </div>
                                    </Section>
                                </SectionDetails>
                            )}

                            <Section label="Expected Exposure" className="header">
                                <SumText setColor="red">
                                    {flippedEquivalentExposure.toFixed(3)} {selectedToken}
                                </SumText>
                            </Section>
                            {showTransactionDetails && (
                                <SectionDetails>
                                    <Section
                                        label={`Commit Amount (${selectedToken}) at ${selectedTokenOraclePrice} USD/${selectedToken}`}
                                        showSectionDetails
                                    >
                                        <div>
                                            <span className="opacity-50">
                                                {flippedCommitAmount.toFixed(3)} {selectedToken}
                                            </span>
                                        </div>
                                    </Section>
                                    <Section label="Pool Leverage" showSectionDetails>
                                        <div>
                                            <span className="opacity-50">{poolPowerLeverage}x</span>
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
                    {`${CommitActionEnum[commitAction]} in`}
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
    font-size: 15px;
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
    font-size: 14px;
    font-weight: 600;

    ${({ setColor }) => {
        if (setColor === 'green') {
            return `
                color: #10b981;
            `;
        } else if (setColor === 'red') {
            return `
                color: #ef4444;
            `;
        }
    }}

    @media (min-width: 640px) {
        font-size: 15px;
    }
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
