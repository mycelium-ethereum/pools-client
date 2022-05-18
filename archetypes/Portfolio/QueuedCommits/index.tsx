import React, { useCallback, useMemo } from 'react';
import { CommitEnum } from '@tracer-protocol/pools-js';
import useQueuedCommits from '~/hooks/useQueuedCommits';
import { QueuedCommit } from '~/types/commits';
import { escapeRegExp } from '~/utils/helpers';
import QueuedCommitsTable from './QueuedCommitsTable';
import { OverviewTable } from '../OverviewTable';
import { CommitTypeDropdown, OverviewTableSearch } from '../OverviewTable/Actions';
import { CommitTypeFilter, OverviewPageFocus, PortfolioAction, PortfolioState } from '../state';

export const QueuedCommits = ({
    queuedCommitsFilter,
    queuedCommitsSearch,
    dispatch,
}: {
    queuedCommitsFilter: PortfolioState['queuedCommitsFilter'];
    queuedCommitsSearch: PortfolioState['queuedCommitsSearch'];
    dispatch: React.Dispatch<PortfolioAction>;
}): JSX.Element => {
    const { rows: commits, isLoading } = useQueuedCommits();

    const searchFilterFunc = useCallback(
        (commit: QueuedCommit): boolean => {
            const searchString = escapeRegExp(queuedCommitsSearch.toLowerCase());
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
            pageFocus={OverviewPageFocus.Queued}
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
            isLoading={isLoading}
            rowCount={commits.length}
        >
            <QueuedCommitsTable commits={filteredCommits} />
        </OverviewTable>
    );
};
export default QueuedCommits;
