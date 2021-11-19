import { SideEnum, CommitEnum } from '@tracer-protocol/pools-js/types/enums';
import { ethers } from 'ethers';

export const SIDE_MAP: Record<SideEnum, string> = {
    [SideEnum.long]: 'Long',
    [SideEnum.short]: 'Short',
};

// Commit actions enum
export enum CommitActionEnum {
    mint = 0,
    burn = 1,
}

// Focused on either buys or shorts when viewing pending commits
export enum CommitsFocusEnum {
    mints = 0,
    burns = 1,
}

export const PENDING_COMMIT = 1;

export const COMMIT_TYPE_MAP: Record<CommitEnum, string> = {
    [CommitEnum.shortMint]: 'Buying',
    [CommitEnum.shortBurn]: 'Selling',
    [CommitEnum.longMint]: 'Buying',
    [CommitEnum.longBurn]: 'Selling',
};

// export const EMPTY_TOKEN: PoolToken = {
//     name: '',
//     symbol: '',
//     decimals: 18,
//     address: '',
//     balance: new BigNumber(0),
//     supply: new BigNumber(0),
//     approvedAmount: new BigNumber(0),
//     side: SideEnum.short,
// };

// networks
export const ARBITRUM_RINKEBY = '421611';
export const ARBITRUM = '42161';
export const MAINNET = '1';
export const RINKEBY = '4';
export const KOVAN = '42';

export const MAX_SOL_UINT = ethers.BigNumber.from('340282366920938463463374607431768211455');

export const TCR_DECIMALS = 18;
export const USDC_DECIMALS = 6;
