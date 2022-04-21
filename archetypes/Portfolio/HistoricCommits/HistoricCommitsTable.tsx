import React, { useCallback, useMemo } from 'react';
import { CommitEnum } from '@tracer-protocol/pools-js';
import Loading from '~/components/General/Loading';
import Pagination, { PageNumber } from '~/components/General/Pagination';
import { FullSpanCell, Table } from '~/components/General/TWTable';
import { TableHeader, TableHeaderCell } from '~/components/General/TWTable';
import { useHistoricCommits } from '~/hooks/useHistoricCommits';
import { PAGE_ENTRIES } from '~/hooks/usePagination';
import { TradeHistory } from '~/types/commits';
import { HistoricCommitRow } from './HisoricCommitRows';
import * as Styles from './styles';
import { NoEntries } from '../NoEntries';
import { OverviewHeaderRow } from '../OverviewTable/styles';
import { CommitTypeFilter } from '../state';

export const HistoricCommitsTable = ({
    typeFilter,
    searchFilter,
}: {
    typeFilter: CommitTypeFilter;
    searchFilter: string;
}): JSX.Element => {
    const { loading, tradeHistory, totalRecords, page, setPage } = useHistoricCommits(typeFilter);

    const searchFilterFunc = useCallback(
        (commit): boolean => {
            const searchString = searchFilter.toLowerCase();
            return Boolean(
                commit.tokenIn.symbol.toLowerCase().match(searchString) ||
                    commit.tokenOut.symbol.toLowerCase().match(searchString),
            );
        },
        [searchFilter],
    );

    const typeFilterFunc = useCallback(
        (commit: TradeHistory): boolean => {
            switch (typeFilter) {
                case CommitTypeFilter.Burn:
                    return commit.commitType === CommitEnum.longBurn || commit.commitType === CommitEnum.shortBurn;
                case CommitTypeFilter.Mint:
                    return commit.commitType === CommitEnum.longMint || commit.commitType === CommitEnum.shortMint;
                case CommitTypeFilter.Burn:
                    return (
                        commit.commitType === CommitEnum.longBurnShortMint ||
                        commit.commitType === CommitEnum.shortBurnLongMint
                    );
                case CommitTypeFilter.All:
                default:
                    return true;
            }
        },
        [typeFilter],
    );

    const filteredCommits = useMemo(
        () => tradeHistory.filter(typeFilterFunc).filter(searchFilterFunc),
        [tradeHistory, typeFilter, searchFilter],
    );

    return (
        <div>
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
                        {filteredCommits.length === 0 ? (
                            <NoEntries />
                        ) : (
                            filteredCommits.map((commit) => (
                                <HistoricCommitRow key={commit.txnHashIn} {...commit} />
                            ))
                        )}
                    </tbody>
                )}
            </Table>
            <Styles.PaginationWrapper>
                <PageNumber page={page} numResults={totalRecords} resultsPerPage={PAGE_ENTRIES} />
                <div>
                    <Pagination
                        onLeft={({ nextPage }) => {
                            setPage(nextPage);
                        }}
                        onRight={({ nextPage }) => {
                            setPage(nextPage);
                        }}
                        onDirect={({ nextPage }) => {
                            setPage(nextPage);
                        }}
                        numPages={Math.ceil(totalRecords / PAGE_ENTRIES) || 1}
                        selectedPage={page}
                    />
                </div>
            </Styles.PaginationWrapper>
        </div>
    );
};

export default HistoricCommitsTable;
