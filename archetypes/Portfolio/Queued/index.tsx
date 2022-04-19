import React from 'react';
import { Table } from '~/components/General/TWTable';
import { useStore } from '~/store/main';
import { selectProvider } from '~/store/Web3Slice';
import { QueuedCommit } from '~/types/commits';

import QueuedCommitHeader from '../Tables/QueuedCommitHeader';
import { QueuedCommitRow } from '../Tables/QueuedCommitRows';
import { NoEntries } from '../NoEntries';

export const QueuedCommits = ({
    commits,
}: {
    commits: QueuedCommit[];
}): JSX.Element => {
    const provider = useStore(selectProvider);

    return (
        <div className="my-5 rounded-xl bg-theme-background p-5 shadow">
            <Table>
                <QueuedCommitHeader />
                <tbody>
                    {commits.length === 0 ? (
                        <NoEntries isQueued />
                    ) : (
                        commits.map((commit) => (
                            <QueuedCommitRow
                                key={commit.txnHash}
                                provider={provider ?? null}
                                {...commit}
                            />
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default QueuedCommits;
