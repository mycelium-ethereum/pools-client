import React from 'react';
import Loading from '~/components/General/Loading';
import { NoTableEntries } from '~/components/General/NoTableEntries';
import { FullSpanCell, Table } from '~/components/General/TWTable';
import { TableHeader, TableHeaderCell } from '~/components/General/TWTable';
import { TradeHistory } from '~/types/commits';
import { HistoricCommitRow } from './HisoricCommitRows';
import { OverviewHeaderRow } from '../OverviewTable/styles';

export const HistoricCommitsTable = ({
    loading,
    commits,
}: {
    loading: boolean;
    commits: TradeHistory[];
}): JSX.Element => {
    return (
        <Table fullHeight={false}>
            <TableHeader>
                <OverviewHeaderRow>
                    <TableHeaderCell>From</TableHeaderCell>
                    <TableHeaderCell colSpan={3} />
                    <TableHeaderCell>To</TableHeaderCell>
                    <TableHeaderCell colSpan={5} />
                </OverviewHeaderRow>
                <OverviewHeaderRow>
                    <TableHeaderCell>Type</TableHeaderCell>
                    <TableHeaderCell>Amount</TableHeaderCell>
                    <TableHeaderCell>Token In</TableHeaderCell>
                    <TableHeaderCell>{/* Empty cell for arrow */}</TableHeaderCell>
                    <TableHeaderCell>Price</TableHeaderCell>
                    <TableHeaderCell>Amount</TableHeaderCell>
                    <TableHeaderCell>Token Out</TableHeaderCell>
                    <TableHeaderCell>Fees</TableHeaderCell>
                    <TableHeaderCell>Date</TableHeaderCell>
                    <TableHeaderCell>{/* Empty cell for actions */}</TableHeaderCell>
                </OverviewHeaderRow>
            </TableHeader>
            {loading ? (
                <tr>
                    <FullSpanCell>
                        <Loading className="mx-auto my-8 w-10" />
                    </FullSpanCell>
                </tr>
            ) : (
                <tbody>
                    {commits.length === 0 ? (
                        <NoTableEntries>You have no commit history.</NoTableEntries>
                    ) : (
                        commits.map((commit) => <HistoricCommitRow key={commit.txnHashIn} {...commit} />)
                    )}
                </tbody>
            )}
        </Table>
    );
};

export default HistoricCommitsTable;
