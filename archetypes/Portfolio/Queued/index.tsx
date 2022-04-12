import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { CommitEnum, CommitActionEnum } from '@tracer-protocol/pools-js';
import TWButtonGroup from '~/components/General/TWButtonGroup';
import { Table } from '~/components/General/TWTable';
import { CommitActionToQueryFocusMap } from '~/constants/commits';
import { useStore } from '~/store/main';
import { selectProvider } from '~/store/Web3Slice';
import { QueuedCommit } from '~/types/commits';

import QueuedCommitHeader from './QueuedCommitHeader';
import { QueuedCommitRow } from './QueuedCommitRows';
import { PageOptions } from '..';
import { NoEntries } from '../NoEntries';

const queuedOptions: (numMints: number, numBurns: number, numFlips: number) => PageOptions = (
    numMints,
    numBurns,
    numFlips,
) => {
    return [
        {
            key: CommitActionEnum.mint,
            text: <>Pending Mints ({numMints})</>,
        },
        {
            key: CommitActionEnum.burn,
            text: <>Pending Burns ({numBurns})</>,
        },
        {
            key: CommitActionEnum.flip,
            text: <>Pending Flips ({numFlips})</>,
        },
    ];
};

export const QueuedCommits = ({
    focus,
    commits,
}: {
    focus: CommitActionEnum;
    commits: QueuedCommit[];
}): JSX.Element => {
    const router = useRouter();
    const provider = useStore(selectProvider);

    const { mintCommits, burnCommits, flipCommits } = useMemo(
        () => ({
            mintCommits: commits.filter(
                (commit) => commit.type === CommitEnum.longMint || commit.type === CommitEnum.shortMint,
            ),
            burnCommits: commits.filter(
                (commit) => commit.type === CommitEnum.longBurn || commit.type === CommitEnum.shortBurn,
            ),
            flipCommits: commits.filter(
                (commit) =>
                    commit.type === CommitEnum.longBurnShortMint || commit.type === CommitEnum.shortBurnLongMint,
            ),
        }),
        [commits],
    );

    const focusedCommits = useMemo(() => {
        if (focus === CommitActionEnum.mint) {
            return mintCommits;
        } else if (focus === CommitActionEnum.burn) {
            return burnCommits;
        } else {
            return flipCommits;
        }
    }, [focus, mintCommits, burnCommits, flipCommits]);

    return (
        <div className="my-5 rounded-xl bg-theme-background p-5 shadow">
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
                    options={queuedOptions(mintCommits.length, burnCommits.length, flipCommits.length)}
                />
            </div>
            <Table>
                <QueuedCommitHeader focus={focus} />
                <tbody>
                    {focusedCommits.length === 0 ? (
                        <NoEntries focus={focus} isQueued />
                    ) : (
                        focusedCommits.map((commit) => (
                            <QueuedCommitRow
                                key={commit.txnHash}
                                focus={focus}
                                provider={provider ?? null}
                                {...commit}
                            />
                        ))
                    )}
                </tbody>
            </Table>
            <div className="flex">
                <div className="mt-8 max-w-2xl text-sm text-theme-text opacity-80">
                    * <strong>Token Price</strong> and{' '}
                    <strong>{focus === CommitActionEnum.mint ? 'Amount' : 'Return'}</strong> values are indicative only,
                    and represent the estimated values for the next rebalance, given the committed mints and burns and
                    change in price of the underlying asset.
                </div>
            </div>
        </div>
    );
};

export default QueuedCommits;
