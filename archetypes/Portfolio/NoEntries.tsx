import React from 'react';
import { FullSpanCell } from '~/components/General/TWTable';
import NoItems from '~/public/img/no-queued.svg';

export const NoEntries = ({ isQueued }: { isQueued?: boolean }): JSX.Element => (
    <tr>
        <FullSpanCell>
            <div className="my-12 text-center">
                <NoItems className="mx-auto mb-5" />
                <div className="text-cool-gray-500">
                    {isQueued ? `You have no pending commits.` : `You have no commit history.`}
                </div>
            </div>
        </FullSpanCell>
    </tr>
);
