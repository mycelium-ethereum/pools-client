import React from 'react';
import { CommitActionEnum } from '@tracer-protocol/pools-js';
import NoItems from '~/public/img/no-queued.svg';

const QUEUED_TYPE_MAP: Record<CommitActionEnum, string> = {
    [CommitActionEnum.burn]: 'burns',
    [CommitActionEnum.mint]: 'mints',
    [CommitActionEnum.flip]: 'flips',
};

const HISTORY_TYPE_MAP: Record<CommitActionEnum, string> = {
    [CommitActionEnum.burn]: 'burn',
    [CommitActionEnum.mint]: 'mint',
    [CommitActionEnum.flip]: 'flip',
};

const MAX_COLS = 100;

export const NoEntries = ({ focus, isQueued }: { focus: CommitActionEnum; isQueued?: boolean }): JSX.Element => (
    <tr>
        <td colSpan={MAX_COLS}>
            <div className="my-20 text-center">
                <NoItems className="mx-auto mb-5" />
                <div className="text-cool-gray-500">
                    {isQueued
                        ? `You have no pending ${QUEUED_TYPE_MAP[focus]}.`
                        : `You have no ${HISTORY_TYPE_MAP[focus]} history.`}
                </div>
            </div>
        </td>
    </tr>
);
