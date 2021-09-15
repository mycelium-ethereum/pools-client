import { PoolToken } from '@libs/types/General';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

// side types
export enum SideEnum {
    long = 0,
    short = 1,
}
export const SIDE_MAP: Record<SideEnum, string> = {
    [SideEnum.long]: 'Long',
    [SideEnum.short]: 'Short',
};

// Commit actions enum
export enum CommitActionEnum {
    mint = 0,
    burn = 1,
}

// Commit type enum
export enum CommitEnum {
    short_mint = 0,
    short_burn = 1,
    long_mint = 2,
    long_burn = 3,
}

// Focused on either buys or shorts when viewing pending commits
export enum CommitsFocusEnum {
    buys = 0,
    sells = 1,
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
    decimals: 18,
    address: '',
    balance: new BigNumber(0),
    supply: new BigNumber(0),
    approvedAmount: new BigNumber(0),
    side: SideEnum.short,
};

// networks
export const ARBITRUM_RINKEBY = '421611';
export const ARBITRUM = '42161';
export const KOVAN = '42';

export const MAX_SOL_UINT = ethers.BigNumber.from('340282366920938463463374607431768211455');
