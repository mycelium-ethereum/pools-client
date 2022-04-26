import React, { useCallback, useMemo } from 'react';
import { CommitEnum } from '@tracer-protocol/pools-js';
import usePendingCommits from '~/hooks/useQueuedCommits';
import { QueuedCommit } from '~/types/commits';
import QueuedCommitsTable from './QueuedCommitsTable';
import { OverviewTable } from '../OverviewTable';
import { CommitTypeDropdown, OverviewTableSearch } from '../OverviewTable/Actions';
import { CommitTypeFilter, PortfolioAction, PortfolioState } from '../state';

export const QueuedCommits = ({
    queuedCommitsFilter,
    queuedCommitsSearch,
    dispatch,
}: {
    queuedCommitsFilter: PortfolioState['queuedCommitsFilter'];
    queuedCommitsSearch: PortfolioState['queuedCommitsSearch'];
    dispatch: React.Dispatch<PortfolioAction>;
}): JSX.Element => {
    const commits = usePendingCommits();

    const searchFilterFunc = useCallback(
        (commit: QueuedCommit): boolean => {
            const searchString = queuedCommitsSearch.toLowerCase();
            return Boolean(
                commit.tokenIn.symbol.toLowerCase().match(searchString) ||
                    commit.tokenOut.symbol.toLowerCase().match(searchString),
            );
        },
        [queuedCommitsSearch],
    );

    const typeFilterFunc = useCallback(
        (commit): boolean => {
            switch (queuedCommitsFilter) {
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
        [queuedCommitsFilter],
    );

    const filteredCommits = useMemo(
        () => commits.filter(typeFilterFunc).filter(searchFilterFunc),
        [commits, queuedCommitsFilter, queuedCommitsSearch],
    );

    return (
        <OverviewTable
            title="Pending"
            subTitle="Your queued orders. Come back once they are processed to claim."
            firstActionTitle="Commit Type"
            firstAction={
                <CommitTypeDropdown
                    selected={queuedCommitsFilter}
                    setCommitTypeFilter={(v) =>
                        void dispatch({ type: 'setQueuedCommitsFilter', filter: v as CommitTypeFilter })
                    }
                />
            }
            secondAction={
                <OverviewTableSearch
                    search={queuedCommitsSearch}
                    setSearch={(search) => void dispatch({ type: 'setQueuedCommitsSearch', search })}
                />
            }
            rowCount={commits.length}
        >
            <QueuedCommitsTable commits={filteredCommits} />
        </OverviewTable>
    );
};
export default QueuedCommits;
