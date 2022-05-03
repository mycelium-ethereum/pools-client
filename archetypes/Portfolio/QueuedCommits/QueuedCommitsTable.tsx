import React from 'react';
import { NoTableEntries } from '~/components/General/NoTableEntries';
import { Table, TableHeaderCell } from '~/components/General/TWTable';
import { TableHeader } from '~/components/General/TWTable';
import { QueuedCommit } from '~/types/commits';
import { QueuedCommitRow } from './QueuedCommitRow';
import { OverviewHeaderRow } from '../OverviewTable/styles';

export const QueuedCommitsTable = ({ commits }: { commits: QueuedCommit[] }): JSX.Element => {
    return (
        <Table fullHeight={false}>
            <TableHeader>
                <OverviewHeaderRow>
                    <TableHeaderCell>From</TableHeaderCell>
                    <TableHeaderCell colSpan={3} />
                    <TableHeaderCell>To</TableHeaderCell>
                    <TableHeaderCell colSpan={4} />
                </OverviewHeaderRow>
                <OverviewHeaderRow>
                    <TableHeaderCell>Type</TableHeaderCell>
                    <TableHeaderCell>Amount</TableHeaderCell>
                    <TableHeaderCell>Token In</TableHeaderCell>
                    <TableHeaderCell>{/* Empty cell for arrow */}</TableHeaderCell>
                    <TableHeaderCell>Price</TableHeaderCell>
                    <TableHeaderCell>Amount</TableHeaderCell>
                    <TableHeaderCell>Token Out</TableHeaderCell>
                    <TableHeaderCell>Receive In</TableHeaderCell>
                    <TableHeaderCell>{/* Empty cell for actions */}</TableHeaderCell>
                </OverviewHeaderRow>
            </TableHeader>
            <tbody>
                {commits.length === 0 ? (
                    <NoTableEntries>You have no pending commits.</NoTableEntries>
                ) : (
                    commits.map((commit) => <QueuedCommitRow key={commit.txnHash} {...commit} />)
                )}
            </tbody>
        </Table>
    );
};

export default QueuedCommitsTable;
