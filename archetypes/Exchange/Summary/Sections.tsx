import React from 'react';
import BigNumber from 'bignumber.js';
import { calcNotionalValue } from '@tracer-protocol/pools-js';
import { Logo, Section, tokenSymbolToLogoTicker } from '~/components/General';
import { toApproxCurrency } from '~/utils/converters';
import ApproxCommitGasFee from './ApproxCommitGasFee';
import * as Styles from './styles';
import { BaseSection } from './types';
import { calcNumTokens } from './utils';

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
        gasFee: BigNumber;
    } & BaseSection
> = ({ amount, gasFee, showTransactionDetails }) => {
    // TODO amount will not always be a USD value if the settlement asset is not
    //  a stable coin. Need to make sure settlement asset gets converted
    const totalCost = amount.plus(gasFee);
    return (
        <>
            <Section label="Total Costs" className="header">
                <Styles.SumText>{toApproxCurrency(totalCost)}</Styles.SumText>
            </Section>
            {showTransactionDetails && (
                <Styles.SectionDetails>
                    <Section label="Commit Amount" showSectionDetails>
                        <Styles.Transparent>{toApproxCurrency(amount)}</Styles.Transparent>
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
        nextTokenPrice: BigNumber;
        tokenSymbol: string;
    } & BaseSection
> = ({ expectedTokensMinted, nextTokenPrice, tokenSymbol, showTransactionDetails }) => (
    <>
        <Section label="Expected Tokens Minted" className="header">
            <Styles.SumText>
                {expectedTokensMinted > 0 ? expectedTokensMinted.toFixed(3) : ''} {tokenSymbol}
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
                    <ExpectedTokenPrice tokenPrice={nextTokenPrice} />
                </Section>
            </Styles.SectionDetails>
        )}
    </>
);

// Burn token value (BurnSummary)
export const ExpectedTokenValue: React.FC<
    {
        settlementTokenSymbol: string;
        amount: BigNumber;
        nextTokenPrice: BigNumber;
    } & BaseSection
> = ({ amount, nextTokenPrice, settlementTokenSymbol, showTransactionDetails }) => (
    <>
        <Section label="Expected Token Value" className="header">
            <Styles.SumText>
                {`${toApproxCurrency(calcNotionalValue(nextTokenPrice, amount), 2)} ${settlementTokenSymbol}`}
            </Styles.SumText>
        </Section>
        {showTransactionDetails && (
            <Styles.SectionDetails>
                <Section label="Tokens" showSectionDetails>
                    <Styles.Transparent>{`${amount}`} tokens</Styles.Transparent>
                </Section>
                <Section label="Expected Price" showSectionDetails>
                    <ExpectedTokenPrice tokenPrice={nextTokenPrice} />
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
        isLong: boolean;
    } & BaseSection
> = ({ label, showTransactionDetails, expectedExposure, commitAmount, baseAsset, oraclePrice, poolLeverage, isLong }) => {
    return (
        <>
            <Section label={label} className="header">
                <Styles.SumText setColor={`${isLong ? "green" : "red"}`}>
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
        amount: BigNumber;
        gasFee: BigNumber;
    } & BaseSection
> = ({ amount, gasFee, showTransactionDetails }) => {
    // TODO add protocol fee to totalFee
    const totalFee = gasFee.toNumber();
    return (
        <>
            <Section label="Expected Fees" className="header">
                <Styles.SumText>{`${toApproxCurrency(totalFee, 3)} USD`}</Styles.SumText>
            </Section>
            {showTransactionDetails && (
                <Styles.SectionDetails>
                    {/*<Section label="Protocol Fee" showSectionDetails>
                        <Styles.Transparent>
                            {`${amount.div(tokenPrice ?? 1).toFixed(3)}`} tokens
                        </Styles.Transparent>
                        </Section>*/}
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
        nextFlipTokenPrice: BigNumber;
        isLong: boolean;
        flippedTokenSymbol: string;
        expectedNotionalReturn: BigNumber;
        settlementTokenSymbol: string;
    } & BaseSection
> = ({
    showTransactionDetails,
    nextFlipTokenPrice,
    isLong,
    flippedTokenSymbol,
    expectedNotionalReturn,
    settlementTokenSymbol,
}) => {
    const expectedFlippedTokens: string = calcNumTokens(expectedNotionalReturn, nextFlipTokenPrice).toFixed(2);
    return (
        <>
            <Section label="Expected Amount" className="header">
                <Styles.SumText>{`${expectedFlippedTokens} ${flippedTokenSymbol}`}</Styles.SumText>
            </Section>
            {showTransactionDetails && (
                <Styles.SectionDetails>
                    <Section label={`Expected ${isLong ? 'Long' : 'Short'} Token Value`} showSectionDetails>
                        <Styles.Transparent>
                            {`${toApproxCurrency(expectedNotionalReturn, 2)} ${settlementTokenSymbol}`}
                        </Styles.Transparent>
                    </Section>
                    <Section label={`Expected ${isLong ? 'Short' : 'Long'} Token Price`} showSectionDetails>
                        <ExpectedTokenPrice tokenPrice={nextFlipTokenPrice} />
                    </Section>
                    <Section label={`Expected Amount of ${isLong ? 'Short' : 'Long'} Tokens`} showSectionDetails>
                        <Styles.Transparent>
                            {expectedFlippedTokens} ${flippedTokenSymbol}
                        </Styles.Transparent>
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
            <Logo className="mr-2 inline" size="md" ticker={tokenSymbolToLogoTicker(tokenSymbol)} />
            {tokenSymbol}
        </Styles.SumText>
    </Section>
);
