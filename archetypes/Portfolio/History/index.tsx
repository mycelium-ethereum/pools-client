import React from 'react';
import { useRouter } from 'next/router';
import { CommitActionEnum } from '@tracer-protocol/pools-js';
import Loading from '~/components/General/Loading';
import Pagination, { PageNumber } from '~/components/General/Pagination';
import TWButtonGroup from '~/components/General/TWButtonGroup';
import { FullSpanCell, Table } from '~/components/General/TWTable';
import { CommitActionToQueryFocusMap } from '~/constants/commits';
import { useHistoricCommits } from '~/hooks/useHistoricCommits';
import { PAGE_ENTRIES } from '~/hooks/usePagination';
import { HistoricCommitRow } from './HisoricCommitRows';
import HistoricCommitHeader from './HistoricCommitHeader';
import { PageOptions } from '..';
import { NoEntries } from '../NoEntries';

const historyOptions: PageOptions = [
    {
        key: CommitActionEnum.mint,
        text: 'Mint History',
    },
    {
        key: CommitActionEnum.burn,
        text: 'Burn History',
    },
    {
        key: CommitActionEnum.flip,
        text: 'Flip History',
    },
];

export const HistoricCommits = ({ focus }: { focus: CommitActionEnum }): JSX.Element => {
    const router = useRouter();
    const { loading, tradeHistory, totalRecords, page, setPage } = useHistoricCommits(focus);

    return (
        <div className="mt-5 rounded-xl bg-theme-background p-5 shadow">
            <div className="mb-5">
                <TWButtonGroup
                    value={focus}
                    size="lg"
                    onClick={(option) =>
                        router.push({
                            query: {
                                focus: CommitActionToQueryFocusMap[option as CommitActionEnum],
                            },
                        })
                    }
                    color="tracer"
                    options={historyOptions}
                />
            </div>
            <Table>
                <HistoricCommitHeader focus={focus} />
                {loading ? (
                    <tr>
                        <FullSpanCell>
                            <Loading className="mx-auto my-8 w-10" />
                        </FullSpanCell>
                    </tr>
                ) : (
                    <tbody>
                        {tradeHistory.length === 0 ? (
                            <NoEntries focus={focus} />
                        ) : (
                            tradeHistory.map((commit) => (
                                <HistoricCommitRow key={commit.txnHashIn} focus={focus} {...commit} />
                            ))
                        )}
                    </tbody>
                )}
            </Table>
            <div className="ml-auto mt-auto px-4 py-3 sm:px-6">
                <PageNumber page={page} numResults={totalRecords} resultsPerPage={PAGE_ENTRIES} />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
            </div>
        </div>
    );
};

export default HistoricCommits;
