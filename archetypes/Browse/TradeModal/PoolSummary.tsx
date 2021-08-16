
import TimeLeft from '@components/TimeLeft';
import { toApproxCurrency } from '@libs/utils';
import BigNumber from 'bignumber.js';
import React from 'react';
import styled from 'styled-components';

export default (({ expectedPrice, tokenName, nextRebalance, rebalanceMultiplier }) => {
    console.log(nextRebalance)
    return (
        <Summary>
            <Title>Mint Summary</Title>
            <Section>
                <Label>Expected price</Label>
                <Value>{toApproxCurrency(expectedPrice)}</Value>
            </Section>
            <Section>
                <Label>Expected tokens</Label>
                <Value>{tokenName}</Value>
            </Section>
            <Section>
                <Label>Next mint</Label>
                <Value>
                    <TimeLeft targetTime={nextRebalance} />
                </Value>
            </Section>
            <Section>
                <Label>Rebalance Multiplier</Label>
                <Value>{rebalanceMultiplier.toFixed(2)}*</Value>
            </Section>
        </Summary>
    );
}) as React.FC<{
    expectedPrice: BigNumber;
    tokenName: string;
    nextRebalance: number;
    rebalanceMultiplier: BigNumber;
}>;

const Summary = styled.div`
    border: 1px solid var(--color-secondary);
    margin: 1rem 0;
    padding: 0.5rem;
`;

const Title = styled.h2`
`

const Section = styled.div``;
const Label = styled.span`
    font-weight: bold;
`;
const Value = styled.span`
    margin-left: 0.5rem;
`;



