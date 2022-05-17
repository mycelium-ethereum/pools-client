import { CommitActionEnum, CommitEnum, SideEnum } from '@tracer-protocol/pools-js/types';

export const CommitTypeMap = {
    LongBurn: CommitEnum.longBurn,
    LongMint: CommitEnum.longMint,
    ShortBurn: CommitEnum.shortBurn,
    ShortMint: CommitEnum.shortMint,
    LongBurnShortMint: CommitEnum.longBurnShortMint,
    ShortBurnLongMint: CommitEnum.shortBurnLongMint,
};

export const CommitActionSideMap: Record<CommitActionEnum, Record<SideEnum, CommitEnum>> = {
    [CommitActionEnum.mint]: {
        [SideEnum.long]: CommitEnum.longMint,
        [SideEnum.short]: CommitEnum.shortMint,
    },
    [CommitActionEnum.burn]: {
        [SideEnum.long]: CommitEnum.longBurn,
        [SideEnum.short]: CommitEnum.shortBurn,
    },
    [CommitActionEnum.flip]: {
        [SideEnum.long]: CommitEnum.longBurnShortMint,
        [SideEnum.short]: CommitEnum.shortBurnLongMint,
    },
};

export const CommitTypeName: Record<CommitEnum, string> = {
    [CommitEnum.shortBurnLongMint]: 'FLIP',
    [CommitEnum.longBurnShortMint]: 'FLIP',
    [CommitEnum.shortMint]: 'MINT',
    [CommitEnum.longMint]: 'MINT',
    [CommitEnum.shortBurn]: 'BURN',
    [CommitEnum.longBurn]: 'BURN',
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
