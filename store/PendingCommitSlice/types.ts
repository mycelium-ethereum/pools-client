import { PendingCommitInfo } from '~/types/pools';

export interface IPendingCommitSlice {
    commits: Record<string, Record<string, PendingCommitInfo>>;
    addCommit: (commitInfo: PendingCommitInfo) => void;
    addMutlipleCommits: (commits: PendingCommitInfo[]) => void;
    removeCommits: (pool: string, updateIntervalId: number) => void;
}
