import React from 'react';
import { TableHeader, TableHeaderCell } from '~/components/General/TWTable';

export const QueuedTableHeader = (): JSX.Element => (
    <TableHeader>
        <tr>
            <TableHeaderCell>From</TableHeaderCell>
            <TableHeaderCell colSpan={2} />
            <TableHeaderCell>To</TableHeaderCell>
            <TableHeaderCell colSpan={4} />
        </tr>
        <tr>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
            <TableHeaderCell>Token In</TableHeaderCell>
            <TableHeaderCell>Price</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
            <TableHeaderCell>Token Out</TableHeaderCell>
            <TableHeaderCell>Receive In</TableHeaderCell>
            <TableHeaderCell>{/* Empty cell for actions */}</TableHeaderCell>
        </tr>
    </TableHeader>
);

export default QueuedTableHeader;
