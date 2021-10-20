import { CommitEnum } from '@libs/constants';

export const isMintCommit = (commitType: CommitEnum): boolean => {
    return commitType === CommitEnum.long_mint || commitType === CommitEnum.short_mint;
};

export const isShortCommit = (commitType: CommitEnum): boolean => {
    return commitType === CommitEnum.short_burn || commitType === CommitEnum.short_mint;
};
