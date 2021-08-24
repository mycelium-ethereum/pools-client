import React from 'react';
import TimeLeft from '@components/TimeLeft';
import { toApproxCurrency } from '@libs/utils';
import BigNumber from 'bignumber.js';
import { Section, Button } from '..';
import styled from 'styled-components';

export default (({ amount, value, action, timeTillUpkeep, timeTillFrontRunning }) => {
    return (
        <>
            <Section label={'Timetill upKeep'}>
                <TimeLeft targetTime={timeTillUpkeep} />
            </Section>
            <Section label={'Timetill final bets'}>
                <TimeLeft targetTime={timeTillFrontRunning} />
            </Section>
            <Section label={'Amount'}>{amount}</Section>
            <Section label={'Expected Value'}>
                {toApproxCurrency(value)}
                <Token ticker={'DAI'} />
            </Section>
            <Action onClick={action.onClick}>{action.text}</Action>
        </>
    );
}) as React.FC<{
    amount: number | string;
    value: BigNumber;
    timeTillUpkeep: number;
    timeTillFrontRunning: number;
    action: {
        text: string;
        onClick: any;
    };
}>;

// it will only ever be dai to begin with
const Token = styled(({ ticker, className }) => {
    return (
        <span className={className}>
            {/* TODO uncoment and style */}
            {/* <img src={'/'} /> */}
            {ticker}
        </span>
    );
})<{ ticker: string }>`
    img {
    }
`;

const Action = styled(Button)``;
