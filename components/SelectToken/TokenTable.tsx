import React from 'react';
import { Heading } from '@libs/types/General';
import { Table, TableHeader, TableHeading, TableBody, TableRow, TableCell } from '@components/General/Table';
import { TokenBreakdown } from '@libs/types/General';
import styled from 'styled-components';
import { toApproxCurrency } from '@libs/utils';

// const TokenTable
export default (({ tokens }) => {
    return (
        <Table>
            <TableHeader>
                {headings.map((heading, index) => (
                    /* ts -> token-select-heading-row */
                    <TableHeading key={`tshr-${index}`} width={heading.width}>
                        {heading.text}
                    </TableHeading>
                ))}
            </TableHeader>
            <TableBody>
                {tokens.map((token, index) => (
                    <TokenRow key={`txr-${index}`} {...token} />
                ))}
            </TableBody>
        </Table>
    );
}) as React.FC<{
    tokens: TokenBreakdown[];
}>;

const TokenRow = styled(({ name, balance, tokenPrice, supply, className }) => {
    return (
        <TableRow className={className}>
            <TableCell>{name}</TableCell>
            <TableCell>{balance.toFixed(2)}</TableCell>
            <TableCell>{toApproxCurrency(tokenPrice)}</TableCell>
            <TableCell>{toApproxCurrency(tokenPrice.times(supply))}</TableCell>
        </TableRow>
    );
})<TokenBreakdown>``;

// last heading is for buttons
const headings: Heading[] = [
    {
        text: 'TOKEN',
        width: 'auto',
    },
    {
        text: 'BALANCE',
        width: 'auto',
    },
    {
        text: 'TOKEN PRICE',
        width: 'auto',
    },
    {
        text: 'TOTAL',
        width: 'auto',
    },
];
