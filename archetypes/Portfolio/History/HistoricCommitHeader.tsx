import React from 'react';
import { CommitActionEnum } from '@tracer-protocol/pools-js';
import { TableHeader, TableHeaderCell } from '~/components/General/TWTable';

export const HistoryTableHeader = ({ focus }: { focus: CommitActionEnum }): JSX.Element => {
    switch (focus) {
        case CommitActionEnum.mint:
            return (
                <TableHeader>
                    <tr>
                        <TableHeaderCell>Time / Date</TableHeaderCell>
                        <TableHeaderCell>Token</TableHeaderCell>
                        <TableHeaderCell>Amount</TableHeaderCell>
                        <TableHeaderCell>Tokens / Price</TableHeaderCell>
                        <TableHeaderCell colSpan={2}>Protocol Fee</TableHeaderCell>
                    </tr>
                </TableHeader>
            );
        case CommitActionEnum.burn:
            return (
                <TableHeader>
                    <tr>
                        <TableHeaderCell>Time / Date</TableHeaderCell>
                        <TableHeaderCell>Token</TableHeaderCell>
                        <TableHeaderCell>Amount / Price</TableHeaderCell>
                        <TableHeaderCell>Return</TableHeaderCell>
                        <TableHeaderCell colSpan={2}>Fee</TableHeaderCell>
                    </tr>
                </TableHeader>
            );
        case CommitActionEnum.flip:
            return (
                <TableHeader>
                    <tr>
                        <TableHeaderCell>Time / Date</TableHeaderCell>
                        <TableHeaderCell colSpan={2}>From</TableHeaderCell>
                        <TableHeaderCell colSpan={2}>To</TableHeaderCell>
                        <TableHeaderCell colSpan={2}>Fee</TableHeaderCell>
                    </tr>
                    <tr>
                        <TableHeaderCell />
                        <TableHeaderCell>Token / Price</TableHeaderCell>
                        <TableHeaderCell>Amount</TableHeaderCell>
                        <TableHeaderCell>Token / Price</TableHeaderCell>
                        <TableHeaderCell colSpan={3}>Amount</TableHeaderCell>
                    </tr>
                </TableHeader>
            );
        default:
            return <></>;
    }
};

export default HistoryTableHeader;
