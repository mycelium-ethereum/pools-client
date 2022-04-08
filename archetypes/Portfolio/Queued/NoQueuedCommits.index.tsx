import React from 'react';
import { CommitActionEnum } from '@tracer-protocol/pools-js';
import NoQueued from '~/public/img/no-queued.svg';

const TYPE_MAP: Record<CommitActionEnum, string> = {
    [CommitActionEnum.burn]: 'burns',
    [CommitActionEnum.mint]: 'mints',
    [CommitActionEnum.flip]: 'flips',
};

export const NoQueuedCommits = ({ focus }: { focus: CommitActionEnum }): JSX.Element => (
    <tr>
        <td colSpan={4}>
            <div className="my-20 text-center">
                <NoQueued className="mx-auto mb-5" />
                <div className="text-cool-gray-500">You have no pending {TYPE_MAP[focus]}.</div>
            </div>
        </td>
    </tr>
);
