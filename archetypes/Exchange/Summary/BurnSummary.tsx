import React, { useState } from 'react';
import { calcNotionalValue } from '@tracer-protocol/pools-js';
import { Section } from '@components/General';
import { toApproxCurrency } from '@libs/utils/converters';

import { SumText, SectionDetails, ShowDetailsButton, Transparent } from './styles';
import ApproxCommitGasFee from './ApproxCommitGasFee';
import { ExpectedTokenPrice } from './Sections';
import { BurnSummaryProps } from './types';
import ArrowDown from '@public/img/general/caret-down-white.svg';

export const BurnSummary: React.FC<BurnSummaryProps> = ({ amount, tokenPrice, pool, gasFee }) => {
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);
    return (
        <>
            <Section label="Expected Token Value" className="header">
                <SumText>
                    {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 2)} ${pool.quoteTokenSymbol}`}
                </SumText>
            </Section>
            {showTransactionDetails && (
                <SectionDetails>
                    <Section label="Tokens" showSectionDetails>
                        <Transparent>{`${amount}`} tokens</Transparent>
                    </Section>
                    <Section label="Expected Price" showSectionDetails>
                        <ExpectedTokenPrice tokenPrice={tokenPrice} />
                    </Section>
                </SectionDetails>
            )}

            <Section label="Expected Fees" className="header">
                <SumText>
                    {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 3)} ${pool.quoteTokenSymbol}`}
                </SumText>
            </Section>
            {showTransactionDetails && (
                <SectionDetails>
                    <Section label="Gas Fee" showSectionDetails>
                        <div>
                            <ApproxCommitGasFee amount={amount} gasFee={gasFee} />
                        </div>
                    </Section>
                </SectionDetails>
            )}
            <ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
            </ShowDetailsButton>
        </>
    );
};

export default BurnSummary;
