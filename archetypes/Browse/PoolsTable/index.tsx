import { Table, TableBody, TableHeader, TableHeading } from '@components/General/Table';
import { Pool } from '@hooks/usePool';
import { PoolType, SideType } from '@libs/types/General';
import React from 'react';
import PoolRow from './PoolRow';

type Heading = {
    text: string;
    width: string; // string width
};
export default (({ pools, openTradeModal }) => {
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
                    <PoolRow key={`pool-row-${pool.name}`} poolInfo={pool} openTradeModal={openTradeModal} />
                ))}
            </TableBody>
        </Table>
    );
}) as React.FC<{
    pools: PoolType[];
    openTradeModal: (pool: Pool, side: SideType) => void;
}>;

// last heading is for mint and burn
const headings: Heading[] = [
    {
        text: 'Token',
        width: 'auto',
    },
    {
        text: 'Last Price',
        width: 'auto',
    },
    {
        text: 'Oracle Price',
        width: 'auto',
    },
    {
        text: '24h Change',
        width: 'auto',
    },
    {
        text: 'Rebalance Multiplier',
        width: 'auto',
    },
    {
        text: '',
        width: '40%',
    },
];
