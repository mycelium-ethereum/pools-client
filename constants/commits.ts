import { CommitActionEnum, CommitEnum } from '@tracer-protocol/pools-js/types';

export const CommitTypeMap = {
    LongBurn: CommitEnum.longBurn,
    LongMint: CommitEnum.longMint,
    ShortBurn: CommitEnum.shortBurn,
    ShortMint: CommitEnum.shortMint,
    LongBurnShortMint: CommitEnum.longBurnShortMint,
    ShortBurnLongMint: CommitEnum.shortBurnLongMint,
};

const mintQueryFocus = 'mint';
const burnQueryFocus = 'burn';
const flipQueryFocus = 'flip';
export type QueryFocus = typeof mintQueryFocus | typeof burnQueryFocus | typeof flipQueryFocus;

export const CommitToQueryFocusMap: Record<CommitEnum, QueryFocus> = {
    [CommitEnum.longMint]: mintQueryFocus,
    [CommitEnum.shortMint]: mintQueryFocus,
    [CommitEnum.longBurn]: burnQueryFocus,
    [CommitEnum.shortBurn]: burnQueryFocus,
    [CommitEnum.longBurnShortMint]: flipQueryFocus,
    [CommitEnum.shortBurnLongMint]: flipQueryFocus,
};

export const CommitActionToQueryFocusMap: Record<CommitActionEnum, QueryFocus> = {
    [CommitActionEnum.mint]: mintQueryFocus,
    [CommitActionEnum.burn]: burnQueryFocus,
    [CommitActionEnum.flip]: flipQueryFocus,
};

export const PENDING_COMMIT = 1;
