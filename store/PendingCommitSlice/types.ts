import { PendingCommitAmounts, PendingCommitInfo } from '~/types/commits';

export interface IPendingCommitSlice {
    commits: Record<string, Record<string, PendingCommitInfo>>;
    userPending: Record<string, Record<string, PendingCommitAmounts>>;
    addCommit: (commitInfo: PendingCommitInfo) => void;
    addMultipleCommits: (commits: PendingCommitInfo[]) => void;
    removeCommits: (pool: string, updateIntervalId: number) => void;
}
