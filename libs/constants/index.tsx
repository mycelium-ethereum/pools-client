import { PoolToken } from '@libs/types/General';
import BigNumber from 'bignumber.js';

// side types
export enum SideEnum {
    long = 0,
    short = 1,
}
export const SIDE_MAP: Record<SideEnum, string> = {
    [SideEnum.long]: 'Long',
    [SideEnum.short]: 'Short',
};

// token types
export enum CommitActionEnum {
    mint = 0,
    burn = 1,
}

// token type constants

export enum CommitEnum {
    short_mint = 0,
    short_burn = 1,
    long_mint = 2,
    long_burn = 3,
}

export const PENDING_COMMIT = 1;

export const COMMIT_TYPE_MAP: Record<CommitEnum, string> = {
    [CommitEnum.short_mint]: 'Buying',
    [CommitEnum.short_burn]: 'Selling',
    [CommitEnum.long_mint]: 'Buying',
    [CommitEnum.long_burn]: 'Selling',
};

export const EMPTY_TOKEN: PoolToken = {
    name: '',
    symbol: '',
    address: '',
    balance: new BigNumber(0),
    supply: new BigNumber(0),
    approved: false,
    side: SideEnum.short,
};

// networks
export const ARBITRUM = '421611';
export const KOVAN = '42';

// Commit context
export const BUYS = 0;
export const SELLS = 1;
