import React from 'react';
import BigNumber from 'bignumber.js';
import { Logo, Section, tokenSymbolToLogoTicker } from '@components/General';
import { toApproxCurrency } from '@libs/utils/converters';
import * as Styles from './styles';
import ApproxCommitGasFee from './ApproxCommitGasFee';
import { BaseSection } from './types';
import { calcNotionalValue } from '@tracer-protocol/pools-js';

export const ExpectedTokenPrice: React.FC<{
    tokenPrice: BigNumber;
}> = ({ tokenPrice }) => (
    <div>
        <Styles.Transparent>{` at ${toApproxCurrency(tokenPrice ?? 1, 2)} USD/token`}</Styles.Transparent>
    </div>
);

// Mint cost section (MintSummary)
export const TotalMintCosts: React.FC<
    {
        amount: BigNumber;
        gasFee?: string;
    } & BaseSection
> = ({ amount, gasFee, showTransactionDetails }) => {
    // TODO fix these
    const totalCommitmentAmount = amount.eq(0) ? toApproxCurrency(amount) : 0;
    const totalCost = amount.toNumber() <= 0 ? 0 : toApproxCurrency(amount);
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
        </>
    );
};

// Display the expected number of tokens that will be minted (MintSummary)
export const ExpectedTokensMinted: React.FC<
    {
        expectedTokensMinted: number;
        tokenPrice: BigNumber;
        tokenSymbol: string;
    } & BaseSection
> = ({ expectedTokensMinted, tokenPrice, tokenSymbol, showTransactionDetails }) => (
    <>
        <Section label="Expected Tokens Minted" className="header">
            <Styles.SumText>
                {expectedTokensMinted > 0 ? expectedTokensMinted : ''} {tokenSymbol}
            </Styles.SumText>
        </Section>
        {showTransactionDetails && (
            <Styles.SectionDetails>
                <Section label="Expected Amount" showSectionDetails>
                    <Styles.Transparent>
                        <span>{`${expectedTokensMinted.toFixed(3)}`} tokens</span>
                    </Styles.Transparent>
                </Section>
                <Section label="Expected Price" showSectionDetails>
                    <ExpectedTokenPrice tokenPrice={tokenPrice} />
                </Section>
            </Styles.SectionDetails>
        )}
    </>
);

// Burn token value (BurnSummary)
export const ExpectedTokenValue: React.FC<
    {
        quoteTokenSymbol: string;
        amount: BigNumber;
        tokenPrice: BigNumber;
    } & BaseSection
> = ({ amount, tokenPrice, quoteTokenSymbol, showTransactionDetails }) => (
    <>
        <Section label="Expected Token Value" className="header">
            <Styles.SumText>
                {`${toApproxCurrency(calcNotionalValue(tokenPrice, amount), 2)} ${quoteTokenSymbol}`}
            </Styles.SumText>
        </Section>
        {showTransactionDetails && (
            <Styles.SectionDetails>
                <Section label="Tokens" showSectionDetails>
                    <Styles.Transparent>{`${amount}`} tokens</Styles.Transparent>
                </Section>
                <Section label="Expected Price" showSectionDetails>
                    <ExpectedTokenPrice tokenPrice={tokenPrice} />
                </Section>
            </Styles.SectionDetails>
        )}
    </>
);

// Expected resultant exposure (MintSummary and FlipSummary)
export const ExpectedExposure: React.FC<
    {
        label: string;
        expectedExposure: number;
        commitAmount: number;
        baseAsset: string;
        oraclePrice: BigNumber;
        poolLeverage: number;
    } & BaseSection
> = ({ label, showTransactionDetails, expectedExposure, commitAmount, baseAsset, oraclePrice, poolLeverage }) => {
    return (
        <>
            <Section label={label} className="header">
                <Styles.SumText setColor="green">
                    {expectedExposure.toFixed(3)} {baseAsset}
                </Styles.SumText>
            </Section>
            {showTransactionDetails && (
                <Styles.SectionDetails>
                    <Section
                        label={`Commit Amount (${baseAsset}) at ${toApproxCurrency(oraclePrice)} USD/${baseAsset}`}
                        showSectionDetails
                    >
                        <Styles.Transparent>
                            {commitAmount.toFixed(3)} {baseAsset}
                        </Styles.Transparent>
                    </Section>
                    <Section label="Pool Power Leverage" showSectionDetails>
                        <Styles.Transparent>{poolLeverage}</Styles.Transparent>
                    </Section>
                </Styles.SectionDetails>
            )}
        </>
    );
};

// (BurnSummary and FlipSummary)
export const ExpectedFees: React.FC<
    {
        quoteTokenSymbol: string;
        commitNotionalValue: BigNumber;
        amount: BigNumber;
        gasFee?: string;
    } & BaseSection
> = ({ quoteTokenSymbol, commitNotionalValue, amount, gasFee, showTransactionDetails }) => {
    return (
        <>
            <Section label="Expected Fees" className="header">
                <Styles.SumText>{`${toApproxCurrency(commitNotionalValue, 3)} ${quoteTokenSymbol}`}</Styles.SumText>
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
        </>
    );
};

// (FlipSummary)
export const ExpectedFlipAmounts: React.FC<
    {
        tokenPrice: BigNumber;
        amount: BigNumber;
        isLong: boolean;
        flippedTokenSymbol: string;
        commitNotionalValue: BigNumber;
    } & BaseSection
> = ({ showTransactionDetails, tokenPrice, amount, isLong, flippedTokenSymbol, commitNotionalValue }) => {
    const flippedExpectedAmount: string = commitNotionalValue.div(tokenPrice ?? 1).toFixed(0);
    const flippedExpectedTokensMinted: string = amount.gt(0) ? `${flippedExpectedAmount} ${flippedTokenSymbol}` : '0';
    return (
        <>
            <Section label="Expected Amount" className="header">
                <Styles.SumText>{`${toApproxCurrency(commitNotionalValue, 3)} ${flippedTokenSymbol}`}</Styles.SumText>
            </Section>
            {showTransactionDetails && (
                <Styles.SectionDetails>
                    <Section label={`Expected ${isLong ? 'Long' : 'Short'} Token Value`} showSectionDetails>
                        <div>
                            <span className="opacity-50">
                                {`${toApproxCurrency(commitNotionalValue, 2)} `}
                                USDC
                            </span>
                        </div>
                    </Section>
                    <Section label={`Expected ${isLong ? 'Short' : 'Long'} Token Price`} showSectionDetails>
                        <ExpectedTokenPrice tokenPrice={tokenPrice} />
                    </Section>
                    <Section label={`Expected Amount of ${isLong ? 'Short' : 'Long'} Tokens`} showSectionDetails>
                        <div>
                            <Styles.Transparent>{flippedExpectedTokensMinted}</Styles.Transparent>
                        </div>
                    </Section>
                </Styles.SectionDetails>
            )}
        </>
    );
};

// (FlipSummary)
export const ReceiveToken: React.FC<{
    tokenSymbol: string;
}> = ({ tokenSymbol }) => (
    <Section label="Receive" className="header">
        <Styles.SumText>
            <Logo className="inline mr-2" size="md" ticker={tokenSymbolToLogoTicker(tokenSymbol)} />
            {tokenSymbol}
        </Styles.SumText>
    </Section>
);
