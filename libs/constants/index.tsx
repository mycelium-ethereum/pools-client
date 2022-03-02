import { ethers } from 'ethers';
import { CommitEnum } from '@tracer-protocol/pools-js/types';

// Side types
export enum SideEnum {
    long = 0,
    short = 1,
}

// Commit actions enum
export enum CommitActionEnum {
    mint = 0,
    burn = 1,
    flip = 2,
}

export const CommitTypeMap = {
    LongBurn: CommitEnum.longBurn,
    LongMint: CommitEnum.longMint,
    ShortBurn: CommitEnum.shortBurn,
    ShortMint: CommitEnum.shortMint,
    LongFlip: CommitEnum.longBurnShortMint,
    ShortFlip: CommitEnum.longBurnShortMint,
};

const mintQueryFocus = 'mint';
const burnQueryFocus = 'burn';
const flipQueryFocus = 'flip';
type QueryFocus = typeof mintQueryFocus | typeof burnQueryFocus | typeof flipQueryFocus;

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

export const TokenToFarmAddressMap: (tokenAddress: string | null) => string = (tokenAddress) => {
    switch (tokenAddress) {
        // 1L-BTC/USD
        case '0x1616bF7bbd60E57f961E83A602B6b9Abb6E6CAFc':
            return '0xA2bACCD1AA980f80b37BC950CE3eE2d5816d7EC0';
        // 1S-BTC/USD
        case '0x052814194f459aF30EdB6a506eABFc85a4D99501':
            return '0xD04dDCAEca6bf283A430Cb9E847CEEd5Da419Fa0';
        // 3L-BTC/USD
        case '0x05A131B3Cd23Be0b4F7B274B3d237E73650e543d':
            return '0xEb05e160D3C1990719aa25d74294783fE4e3D3Ef';
        // 3S-BTC/USD
        case '0x85700dC0bfD128DD0e7B9eD38496A60baC698fc8':
            return '0xeA4FF5ED11F93AA0Ce7744B1D40093f52eA1cda8';
        // 1L-ETH/USD
        case '0x38c0a5443c7427e65A9Bf15AE746a28BB9a052cc':
            return '0xA18413dC5506A91138e0604C283E36B021b8849B';
        // 1S-ETH/USD
        case '0xf581571DBcCeD3A59AaaCbf90448E7B3E1704dcD':
            return '0x9769F208239C740cC40E9CB3427c34513213B83f';
        // 3L-ETH/USD
        case '0xaA846004Dc01b532B63FEaa0b7A0cB0990f19ED9':
            return '0x07cCcDC913bCbab246fC6E38E81b0C53AaB3De9b';
        // 3S-ETH/USD
        case '0x7d7E4f49a29dDA8b1eCDcf8a8bc85EdcB234E997':
            return '0xE1c9C69a26BD5c6E4b39E6870a4a2B01b4e033bC';
        default:
            return '';
    }
};

export const PENDING_COMMIT = 1;

// Networks
export const ARBITRUM_RINKEBY = '421611';
export const ARBITRUM = '42161';
export const MAINNET = '1';
export const RINKEBY = '4';
export const KOVAN = '42';

export const MAX_SOL_UINT = ethers.BigNumber.from('340282366920938463463374607431768211455');

export const TCR_DECIMALS = 18;
export const USDC_DECIMALS = 6;
