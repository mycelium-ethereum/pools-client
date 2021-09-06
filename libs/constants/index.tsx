import { CommitType, PoolToken, SideType } from '@libs/types/General';
import BigNumber from 'bignumber.js';

// side types
export const LONG = 0;
export const SHORT = 1;
export const SIDE_MAP: Record<SideType, string> = {
    [LONG]: 'Long',
    [SHORT]: 'Short',
};

// token types
export const MINT = 0;
export const BURN = 1;

// token type constants
export const SHORT_MINT = 0;
export const SHORT_BURN = 1;
export const LONG_MINT = 2;
export const LONG_BURN = 3;

export const PENDING_COMMIT = 1;

export const COMMIT_TYPE_MAP: Record<CommitType, string> = {
    [SHORT_MINT]: 'Buying',
    [SHORT_BURN]: 'Selling',
    [LONG_MINT]: 'Buying',
    [LONG_BURN]: 'Selling',
};

export const EMPTY_TOKEN: PoolToken = {
    name: '',
    symbol: '',
    address: '',
    balance: new BigNumber(0),
    supply: new BigNumber(0),
    approved: false,
    side: SHORT,
};

// networks
export const ARBITRUM = '421611';
export const KOVAN = '42';

// Commit context
export const BUYS = 0;
export const SELLS = 1;
