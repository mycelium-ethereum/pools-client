import React from 'react';
import usePendingCommits from '~/hooks/useQueuedCommits';
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
        >
            <QueuedCommitsTable commits={commits} typeFilter={queuedCommitsFilter} searchFilter={queuedCommitsSearch} />
        </OverviewTable>
    );
};
export default QueuedCommits;
