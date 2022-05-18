import React from 'react';
import NoTableEntries from '~/components/General/NoTableEntries';
import { Table, TableHeader, TableHeaderCell } from '~/components/General/TWTable';
import { ClaimedTokenRow } from './ClaimedTokenRow';
import { OnClickCommit, TokenRowProps } from '../state';

export const ClaimedTokensTable = ({
    rows,
    onClickCommitAction,
}: {
    rows: TokenRowProps[];
    onClickCommitAction: OnClickCommit;
}): JSX.Element => {
    return (
        <>
            <Table fullHeight={false}>
                <TableHeader>
                    <tr>
                        <TableHeaderCell>Token</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Value</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Acquisition Cost</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Unrealised PnL</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Leveraged Value</TableHeaderCell>
                        <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                    </tr>
                </TableHeader>
                <tbody>
                    {rows.length === 0 ? (
                        <NoTableEntries>You have no claimed tokens.</NoTableEntries>
                    ) : (
                        rows.map((token) => (
                            <ClaimedTokenRow {...token} key={token.address} onClickCommitAction={onClickCommitAction} />
                        ))
                    )}
                </tbody>
            </Table>
        </>
    );
};

export default ClaimedTokensTable;
