import React, { useState } from 'react';
import { Section } from '@components/General';
import { toApproxCurrency } from '@libs/utils/converters';
import * as Styles from './styles';
import ApproxCommitGasFee from './ApproxCommitGasFee';
import { ExpectedTokenPrice } from './Sections';
import { MintSummaryProps } from './types';
import ArrowDown from '@public/img/general/caret-down-white.svg';

const MintSummary: React.FC<MintSummaryProps> = ({ amount, tokenPrice, token, pool, gasFee }) => {
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);

    const expectedAmount = amount.div(tokenPrice ?? 1).toFixed(0);
    const poolPowerLeverage = pool.leverage;

    const totalCommitmentAmount = amount.eq(0) ? toApproxCurrency(amount) : 0;
    const totalCost = amount.toNumber() <= 0 ? 0 : toApproxCurrency(amount);
    const expectedTokensMinted = `${Number(expectedAmount) > 0 ? expectedAmount : ''} ${token.symbol}`;
    const selectedToken = pool.name?.split('-')[1]?.split('/')[0];
    const selectedTokenOraclePrice = toApproxCurrency(pool.oraclePrice);
    const equivalentExposure = (amount.div(pool.oraclePrice.toNumber()).times(poolPowerLeverage)).toNumber();

    const commitAmount = amount.div(pool.oraclePrice).toNumber()
    return (
        <>
            <Section label="Total Costs" className="header">
                <Styles.SumText>{totalCost}</Styles.SumText>
            </Section>
            {showTransactionDetails && (
                <Styles.SectionDetails>
                    <Section label="Commit Amount" showSectionDetails>
                        <Styles.Transparent>
                            <span>{totalCommitmentAmount}</span>
                        </Styles.Transparent>
                    </Section>
                    <Section label="Gas Fee" showSectionDetails>
                        <ApproxCommitGasFee amount={amount} gasFee={gasFee} />
                    </Section>
                </Styles.SectionDetails>
            )}
            <Section label="Expected Tokens Minted" className="header">
                <Styles.SumText>{expectedTokensMinted}</Styles.SumText>
            </Section>
            {showTransactionDetails && (
                <Styles.SectionDetails>
                    <Section label="Expected Amount" showSectionDetails>
                        <Styles.Transparent>
                            <span>{`${amount.div(tokenPrice ?? 1).toFixed(3)}`} tokens</span>
                        </Styles.Transparent>
                    </Section>
                    <Section label="Expected Price" showSectionDetails>
                        <ExpectedTokenPrice tokenPrice={tokenPrice} />
                    </Section>
                </Styles.SectionDetails>
            )}
            <Section label="Expected Equivalent Exposure" className="header">
                <Styles.SumText setColor="green">
                    {equivalentExposure.toFixed(3)} {selectedToken}
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
                    <Section label="Pool Power Leverage" showSectionDetails>
                        <Styles.Transparent>{poolPowerLeverage}</Styles.Transparent>
                    </Section>
                </Styles.SectionDetails>
            )}
            <Styles.ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
            </Styles.ShowDetailsButton>
        </>
    );
};

export default MintSummary;
