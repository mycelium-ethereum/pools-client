import React, { useCallback, useMemo } from 'react';
import { CommitEnum } from '@tracer-protocol/pools-js';
import Pagination, { PageNumber } from '~/components/General/Pagination';
import { useHistoricCommits } from '~/hooks/useHistoricCommits';
import { PAGE_ENTRIES } from '~/hooks/usePagination';
import { TradeHistory } from '~/types/commits';
import HistoricCommitsTable from './HistoricCommitsTable';
import * as Styles from './styles';
import { OverviewTable } from '../OverviewTable';
import { CommitTypeDropdown, OverviewTableSearch } from '../OverviewTable/Actions';
import { CommitTypeFilter, PortfolioAction, PortfolioState } from '../state';

export const HistoricCommits = ({
    historicCommitsFilter,
    historicCommitsSearch,
    dispatch,
}: {
    historicCommitsFilter: PortfolioState['historicCommitsFilter'];
    historicCommitsSearch: PortfolioState['historicCommitsSearch'];
    dispatch: React.Dispatch<PortfolioAction>;
}): JSX.Element => {
    const { loading, tradeHistory, totalRecords, page, setPage } = useHistoricCommits(historicCommitsFilter);

    const searchFilterFunc = useCallback(
        (commit): boolean => {
            const searchString = historicCommitsSearch.toLowerCase();
            return Boolean(
                commit.tokenIn.symbol.toLowerCase().match(searchString) ||
                    commit.tokenOut.symbol.toLowerCase().match(searchString),
            );
        },
        [historicCommitsSearch],
    );

    const typeFilterFunc = useCallback(
        (commit: TradeHistory): boolean => {
            switch (historicCommitsFilter) {
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
        [historicCommitsFilter],
    );

    const filteredCommits = useMemo(
        () => tradeHistory.filter(typeFilterFunc).filter(searchFilterFunc),
        [tradeHistory, historicCommitsFilter, historicCommitsSearch],
    );

    return (
        <OverviewTable
            title="Commit History"
            subTitle="Your past orders."
            firstActionTitle="Commit Type"
            firstAction={
                <CommitTypeDropdown
                    selected={historicCommitsFilter}
                    setCommitTypeFilter={(v) =>
                        void dispatch({ type: 'setHistoricCommitsFilter', filter: v as CommitTypeFilter })
                    }
                />
            }
            secondAction={
                <OverviewTableSearch
                    search={historicCommitsSearch}
                    setSearch={(search) => void dispatch({ type: 'setHistoricCommitsSearch', search })}
                />
            }
        >
            <HistoricCommitsTable loading={loading} commits={filteredCommits} />
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
        </OverviewTable>
    );
};

export default HistoricCommits;
