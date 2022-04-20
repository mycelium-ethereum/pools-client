import React, { useCallback, useMemo } from 'react';
import { CommitEnum } from '@tracer-protocol/pools-js';
import { Table, TableHeaderCell } from '~/components/General/TWTable';
import { TableHeader } from '~/components/General/TWTable';
import { useStore } from '~/store/main';
import { selectProvider } from '~/store/Web3Slice';
import { QueuedCommit } from '~/types/commits';
import { QueuedCommitRow } from './QueuedCommitRow';

import { NoEntries } from '../../NoEntries';
import { OverviewHeaderRow } from '../OverviewTable/styles';
import { CommitTypeFilter } from '../state';

export const QueuedCommitsTable = ({
    commits,
    typeFilter,
    searchFilter,
}: {
    commits: QueuedCommit[];
    typeFilter: CommitTypeFilter;
    searchFilter: string;
}): JSX.Element => {
    const provider = useStore(selectProvider);

    const searchFilterFunc = useCallback(
        (commit: QueuedCommit): boolean => {
            const searchString = searchFilter.toLowerCase();
            return Boolean(
                commit.tokenIn.symbol.toLowerCase().match(searchString) ||
                    commit.tokenOut.symbol.toLowerCase().match(searchString),
            );
        },
        [searchFilter],
    );

    const typeFilterFunc = useCallback(
        (commit): boolean => {
            switch (typeFilter) {
                case CommitTypeFilter.Burn:
                    return commit.type === CommitEnum.longBurn || commit.type === CommitEnum.shortBurn;
                case CommitTypeFilter.Mint:
                    return commit.type === CommitEnum.longMint || commit.type === CommitEnum.shortMint;
                case CommitTypeFilter.Burn:
                    return commit.type === CommitEnum.longBurnShortMint || commit.type === CommitEnum.shortBurnLongMint;
                case CommitTypeFilter.All:
                default:
                    return true;
            }
        },
        [typeFilter],
    );

    const filteredCommits = useMemo(
        () => commits.filter(typeFilterFunc).filter(searchFilterFunc),
        [commits, typeFilter, searchFilter],
    );

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
                {filteredCommits.length === 0 ? (
                    <NoEntries isQueued />
                ) : (
                    filteredCommits.map((commit) => (
                        <QueuedCommitRow key={commit.txnHash} provider={provider ?? null} {...commit} />
                    ))
                )}
            </tbody>
        </Table>
    );
};

export default QueuedCommitsTable;
