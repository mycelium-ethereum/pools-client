import { Table, TableBody, TableHeader, TableHeading } from '@components/General/Table';
import { PoolType } from '@libs/types/General';
import React from 'react';
import PoolRow from './PoolRow';

type Heading = {
    text: string;
    width: string; // string width
};
export default (({ pools }) => {
    return (
        <Table>
            <TableHeader>
                {headings.map((heading, index) => (
                    <TableHeading key={`pool-heading-row-${index}`} width={heading.width}>
                        {heading.text}
                    </TableHeading>
                ))}
            </TableHeader>
            <TableBody>
                {pools.map((pool) => (
                    <PoolRow key={`pool-row-${pool.name}`} poolInfo={pool} />
                ))}
            </TableBody>
        </Table>
    );
}) as React.FC<{
    pools: PoolType[];
}>;

// last heading is for mint and burn
const headings: Heading[] = [
    {
        text: 'TOKEN',
        width: 'auto',
    },
    {
        text: 'LAST PRICE',
        width: 'auto',
    },
    {
        text: '24H CHANGE',
        width: 'auto',
    },
    {
        text: '30D REALISED APY',
        width: 'auto',
    },
    {
        text: 'REBALANCE RATE',
        width: 'auto',
    },
    {
        text: 'TVL',
        width: 'auto',
    },
    {
        text: 'MY HOLDINGS',
        width: 'auto',
    },
    {
        text: '',
        width: '30%',
    },
];
