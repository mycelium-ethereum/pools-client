import React from 'react';
import { Heading } from '@libs/types/General';
import { Table, TableHeader, TableHeading, TableBody, TableRow, TableCell } from '@components/General/Table';
import { TokenBreakdown } from '@libs/types/General';
import styled from 'styled-components';
import { toApproxCurrency } from '@libs/utils/converters';
import { useSwapContext } from '@context/SwapContext';

// const TokenTable
export default (({ tokens, onClose }) => {
    const { swapDispatch } = useSwapContext();
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
                    <TokenRow
                        key={`txr-${index}`}
                        {...token}
                        onClick={() => {
                            if (swapDispatch) {
                                swapDispatch({ type: 'setSide', value: token.side });
                                swapDispatch({ type: 'setSelectedPool', value: token.pool });
                            }
                            onClose();
                        }}
                    />
                ))}
            </TableBody>
        </Table>
    );
}) as React.FC<{
    tokens: TokenBreakdown[];
    onClose: () => any;
}>;

const TokenRow = styled(({ name, balance, tokenPrice, supply, onClick, className }) => {
    return (
        <TableRow className={className} onClick={onClick}>
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
