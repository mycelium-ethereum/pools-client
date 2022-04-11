import React from 'react';
import { CommitActionEnum } from '@tracer-protocol/pools-js';
import { TableHeader, TableHeaderCell } from '~/components/General/TWTable';

export const QueuedTableHeader = ({ focus }: { focus: CommitActionEnum }): JSX.Element => {
    switch (focus) {
        case CommitActionEnum.mint:
            return (
                <TableHeader>
                    <tr>
                        <TableHeaderCell>Token</TableHeaderCell>
                        <TableHeaderCell>Amount</TableHeaderCell>
                        <TableHeaderCell>Tokens / Price *</TableHeaderCell>
                        <TableHeaderCell>Mint In</TableHeaderCell>
                        <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                    </tr>
                </TableHeader>
            );
        case CommitActionEnum.burn:
            return (
                <TableHeader>
                    <tr>
                        <TableHeaderCell>Token</TableHeaderCell>
                        <TableHeaderCell>Amount</TableHeaderCell>
                        <TableHeaderCell>Return / Price *</TableHeaderCell>
                        <TableHeaderCell>Burn In</TableHeaderCell>
                        <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                    </tr>
                </TableHeader>
            );
        case CommitActionEnum.flip:
            return (
                <TableHeader>
                    <tr>
                        <TableHeaderCell>From</TableHeaderCell>
                        <TableHeaderCell />
                        <TableHeaderCell>To</TableHeaderCell>
                        <TableHeaderCell />
                        <TableHeaderCell>Flip In</TableHeaderCell>
                        <TableHeaderCell />
                    </tr>
                    <tr>
                        <TableHeaderCell>Token / Price *</TableHeaderCell>
                        <TableHeaderCell>Amount *</TableHeaderCell>
                        <TableHeaderCell>Token / Price *</TableHeaderCell>
                        <TableHeaderCell>Amount *</TableHeaderCell>
                        <TableHeaderCell />
                        <TableHeaderCell />
                    </tr>
                </TableHeader>
            );
        default:
            return <></>;
    }
};

export default QueuedTableHeader;
