import React, { useMemo } from 'react';
import { CommitEnum, CommitsFocusEnum } from '@libs/constants';

import usePendingCommits from '@libs/hooks/useQueuedCommits';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { Table, TableHeader, TableHeaderCell } from '@components/General/TWTable';
import { CommitRow } from '@components/PendingCommits';
import Pagination, { PageNumber } from '@components/General/Pagination';
import usePagination, { PAGE_ENTRIES } from '@libs/hooks/usePagination';

// const Queued
export default (({ focus }) => {
    const { provider } = useWeb3();

    const commits = usePendingCommits();

    const { mintCommits, burnCommits } = useMemo(
        () => ({
            mintCommits: commits.filter(
                (commit) => commit.type === CommitEnum.long_mint || commit.type === CommitEnum.short_mint,
            ),
            burnCommits: commits.filter(
                (commit) => commit.type === CommitEnum.long_burn || commit.type === CommitEnum.short_burn,
            ),
        }),
        [commits],
    );

    const { setPage, page, paginatedArray, numPages } = usePagination(
        focus === CommitsFocusEnum.mints ? mintCommits : burnCommits,
    );

    return (
        <div className="bg-theme-background rounded-xl shadow m-4 p-4">
            <div className="flex justify-between">
                <h1 className="text-bold text-2xl text-theme-text">
                    {`Queued ${focus === CommitsFocusEnum.mints ? 'Mints' : 'Burns'}`}
                </h1>
            </div>
            <Table>
                {focus === CommitsFocusEnum.mints ? (
                    <>
                        <TableHeader>
                            <TableHeaderCell>Token</TableHeaderCell>
                            <TableHeaderCell>Spent (USDC)</TableHeaderCell>
                            <TableHeaderCell>Token Price (USDC) *</TableHeaderCell>
                            <TableHeaderCell>Amount (Tokens) *</TableHeaderCell>
                            <TableHeaderCell>Receive in</TableHeaderCell>
                            <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                        </TableHeader>
                        {paginatedArray.map((commit, index) => (
                            <CommitRow
                                key={`pcr-${index}`}
                                index={index}
                                provider={provider ?? null}
                                {...commit}
                                burnRow={false}
                            />
                        ))}
                    </>
                ) : (
                    <>
                        <TableHeader>
                            <TableHeaderCell>Token</TableHeaderCell>
                            <TableHeaderCell>Sold (Tokens)</TableHeaderCell>
                            <TableHeaderCell>Token Price (USDC) *</TableHeaderCell>
                            <TableHeaderCell>Return (USDC) *</TableHeaderCell>
                            <TableHeaderCell>Burn in</TableHeaderCell>
                            <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                        </TableHeader>
                        {paginatedArray.map((commit, index) => (
                            <CommitRow
                                key={`pcr-${index}`}
                                index={index}
                                provider={provider ?? null}
                                {...commit}
                                burnRow={true}
                            />
                        ))}
                    </>
                )}
            </Table>
            <div className="flex">
                <div className="mt-8 max-w-2xl text-sm text-theme-text opacity-80">
                    * <strong>Token Price</strong> and{' '}
                    <strong>{focus === CommitsFocusEnum.mints ? 'Amount' : 'Return'}</strong> values are indicative
                    only, and represent the estimated values for the next rebalance, given the committed mints and burns
                    and change in price of the underlying asset.
                </div>
                <div className="ml-auto mt-auto px-4 sm:px-6 py-3">
                    <PageNumber
                        page={page}
                        numResults={focus === CommitsFocusEnum.mints ? mintCommits.length : burnCommits.length}
                        resultsPerPage={PAGE_ENTRIES}
                    />
                    <Pagination
                        onLeft={({ nextPage }) => {
                            setPage(nextPage);
                        }}
                        onRight={({ nextPage }) => {
                            setPage(nextPage);
                        }}
                        onDirect={({ nextPage }) => {
                            console.log(nextPage);
                            setPage(nextPage);
                        }}
                        numPages={numPages}
                        selectedPage={page}
                    />
                </div>
            </div>
        </div>
    );
}) as React.FC<{
    focus: CommitsFocusEnum;
}>;
