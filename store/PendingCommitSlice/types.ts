import { CommitActionEnum } from '@tracer-protocol/pools-js';
import { PendingCommitInfo } from '~/types/pools';

export interface IPendingCommitSlice {
    commits: Record<string, Record<string, PendingCommitInfo>>;
    // updateCommits: boolean,
    focus: CommitActionEnum;

    addCommit: (commitInfo: PendingCommitInfo) => void;
    resetCommits: (pool: string) => void;
}
