import React, { useMemo, useState } from 'react';
import { calcNotionalValue } from '@tracer-protocol/pools-js';
import { Section, Logo, tokenSymbolToLogoTicker } from '@components/General';
import { toApproxCurrency } from '@libs/utils/converters';

import * as Styles from './styles';
import ApproxCommitGasFee from './ApproxCommitGasFee';
import { ExpectedTokenPrice } from './Sections';
import { FlipSummaryProps } from './types';

import ArrowDown from '@public/img/general/caret-down-white.svg';

const FlipSummary: React.FC<FlipSummaryProps> = ({ pool, isLong, amount, tokenPrice, gasFee }) => {
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);

    const flippedToken = useMemo(
        () => (isLong ? pool.shortToken : pool.longToken),
        [isLong, pool.longToken, pool.shortToken],
    );
    const selectedToken = pool.name?.split('-')[1]?.split('/')[0];
    const selectedTokenOraclePrice = toApproxCurrency(pool.oraclePrice);
    const flippedAmount = calcNotionalValue(tokenPrice, amount);
    const flippedExpectedAmount: string = flippedAmount.div(tokenPrice ?? 1).toFixed(0);

    const flippedExpectedTokensMinted: string =
        amount.gt(0) ? `${flippedExpectedAmount} ${flippedToken.symbol}` : '0';
    const flippedEquivalentExposure: number =
        (flippedAmount.toNumber() / pool.oraclePrice.toNumber()) * pool.leverage;
    const flippedCommitAmount: number = flippedAmount.toNumber() / pool.oraclePrice.toNumber();

    return (
                        <>
                            <Section label="Receive" className="header">
                                <Styles.SumText>
                                    <Logo
                                        className="inline mr-2"
                                        size="md"
                                        ticker={tokenSymbolToLogoTicker(flippedToken.symbol)}
                                    />
                                    {flippedToken.symbol}
                                </Styles.SumText>
                            </Section>
                            <Styles.Divider />

                            <Section label="Expected Amount" className="header">
                                <Styles.SumText>
                                    {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 3)} ${
                                        flippedToken.symbol
                                    }`}
                                </Styles.SumText>
                            </Section>
                            {showTransactionDetails && (
                                <Styles.SectionDetails>
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
                                        <ExpectedTokenPrice tokenPrice={tokenPrice} />
                                    </Section>
                                    <Section
                                        label={`Expected Amount of ${isLong ? 'Short' : 'Long'} Tokens`}
                                        showSectionDetails
                                    >
                                        <div>
                                            <span className="opacity-50">{flippedExpectedTokensMinted}</span>
                                        </div>
                                    </Section>
                                </Styles.SectionDetails>
                            )}

                            <Section label="Expected Fees" className="header">
                                <Styles.SumText>
                                    {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 3)} ${
                                        pool.quoteToken.symbol
                                    }`}
                                </Styles.SumText>
                            </Section>
                            {showTransactionDetails && (
                                <Styles.SectionDetails>
                                    {/* <Section label="Protocol Fee" showSectionDetails>
                                        <div>
                                            <span className="opacity-50">
                                                {`${amount.div(tokenPrice ?? 1).toFixed(3)}`} tokens
                                            </span>
                                        </div>
                                    </Section> */}
                                    <Section label="Gas Fee" showSectionDetails>
                                        <div>
                                            <ApproxCommitGasFee amount={amount} gasFee={gasFee} />
                                        </div>
                                    </Section>
                                </Styles.SectionDetails>
                            )}

                            <Section label="Expected Exposure" className="header">
                                <Styles.SumText setColor="red">
                                    {flippedEquivalentExposure.toFixed(3)} {selectedToken}
                                </Styles.SumText>
                            </Section>
                            {showTransactionDetails && (
                                <Styles.SectionDetails>
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
                                            <span className="opacity-50">{pool.leverage}x</span>
                                        </div>
                                    </Section>
                                </Styles.SectionDetails>
                            )}
                            <Styles.ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                                <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
                            </Styles.ShowDetailsButton>
                        </>
    );
};

export default FlipSummary;
