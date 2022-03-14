import React, { useMemo, useState } from 'react';
import { calcNotionalValue } from '@tracer-protocol/pools-js';
import { Section, Logo, tokenSymbolToLogoTicker } from '@components/General';
import { toApproxCurrency } from '@libs/utils/converters';

import * as Styles from './styles';
import ApproxCommitGasFee from './ApproxCommitGasFee';
import { ExpectedTokenPrice } from './Sections';
import { FlipSummaryProps } from './types';

import ArrowDown from '@public/img/general/caret-down-white.svg';

const FlipSummary: React.FC<FlipSummaryProps> = ({ pool, isLong, inputAmount, amount, tokenPrice, gasFee, token }) => {
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);

    const flippedToken = useMemo(
        () => (isLong ? pool.shortToken : pool.longToken),
        [isLong, pool.longToken, pool.shortToken],
    );
    const expectedAmount = amount.div(tokenPrice ?? 1).toFixed(0);
    const selectedToken = pool.name?.split('-')[1]?.split('/')[0];
    const selectedTokenOraclePrice = toApproxCurrency(pool.oraclePrice);
    const expectedTokensMinted = `${Number(expectedAmount) > 0 ? expectedAmount : ''} ${token.symbol}`;
    const equivalentExposureFlip = (inputAmount / pool.oraclePrice.toNumber()) * pool.leverage;

    const commitAmount = inputAmount / pool.oraclePrice.toNumber();
    return (
        <>
            <Section label="Receive" className="header">
                <Styles.SumText>
                    <Logo className="inline mr-2" size="md" ticker={tokenSymbolToLogoTicker(flippedToken.symbol)} />
                    {flippedToken.symbol}
                </Styles.SumText>
            </Section>
            <Styles.Divider />

            <Section label="Expected Amount" className="header">
                <Styles.SumText>
                    {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 3)} ${flippedToken.symbol}`}
                </Styles.SumText>
            </Section>
            {showTransactionDetails && (
                <Styles.SectionDetails>
                    <Section label="Expected Long Token Value" showSectionDetails>
                        <Styles.Transparent>{`${amount.div(tokenPrice ?? 1).toFixed(3)}`} USDC</Styles.Transparent>
                    </Section>
                    <Section label="Expected Short Token Price" showSectionDetails>
                        <ExpectedTokenPrice tokenPrice={tokenPrice} />
                    </Section>
                    <Section label="Expected Amount of Short Tokens" showSectionDetails>
                        <Styles.Transparent>{expectedTokensMinted}</Styles.Transparent>
                    </Section>
                </Styles.SectionDetails>
            )}

            <Section label="Expected Fees" className="header">
                <Styles.SumText>
                    {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 3)} ${pool.quoteToken.symbol}`}
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
                    {equivalentExposureFlip.toFixed(3)} {selectedToken}
                </Styles.SumText>
            </Section>
            {showTransactionDetails && (
                <Styles.SectionDetails>
                    <Section
                        label={`Commit Amount (${selectedToken}) at ${selectedTokenOraclePrice} USD/${selectedToken}`}
                        showSectionDetails
                    >
                        <Styles.Transparent>
                            {commitAmount.toFixed(3)} {selectedToken}
                        </Styles.Transparent>
                    </Section>
                    <Section label="Pool Leverage" showSectionDetails>
                        <Styles.Transparent>{pool.leverage}x</Styles.Transparent>
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
