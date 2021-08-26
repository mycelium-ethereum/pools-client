import React from 'react';
import { toApproxCurrency } from '@libs/utils';
import { Section, Button } from '..';
import styled from 'styled-components';
import { PendingCommitInfo } from '@libs/types/General';
import TimeLeft from '@components/TimeLeft';

export default (({ amount, value, action, updateInterval, frontRunningInterval, lastUpdate }) => {
    // console.log(lastUpdate, "Form pending")
    return (
        <>
            <Section label={'Timetill upKeep'}>
                <TimeLeft targetTime={lastUpdate.plus(updateInterval).toNumber()} />
            </Section>
            <Section label={'Timetill final bets'}>
                <TimeLeft targetTime={lastUpdate.plus(updateInterval).minus(frontRunningInterval).toNumber()} />
            </Section>
            <Section label={'Amount'}>{amount?.toNumber()}</Section>
            <Section label={'Expected Value'}>
                {toApproxCurrency(value)}
                <Token ticker={'DAI'} />
            </Section>
            <Action onClick={action?.onClick}>{action?.text}</Action>
        </>
    );
}) as React.FC<PendingCommitInfo>;

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
