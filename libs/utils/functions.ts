import { MarketFilterEnum } from '@libs/types/General';

export function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ');
}

export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export const marketFilter: (poolName: string, marketFilterState: MarketFilterEnum) => boolean = (
    poolName,
    marketFilterState,
) => {
    switch (marketFilterState) {
        case MarketFilterEnum.All:
            return true;
        case MarketFilterEnum.EUR:
            return poolName.replace(/.\-/g, '').split('/')[0] === 'EUR';
        case MarketFilterEnum.TOKE:
            return poolName.replace(/.\-/g, '').split('/')[0] === 'TOKE';
        case MarketFilterEnum.LINK:
            return poolName.replace(/.\-/g, '').split('/')[0] === 'LINK';
        case MarketFilterEnum.ETH:
            return poolName.replace(/.\-/g, '').split('/')[0] === 'ETH';
        case MarketFilterEnum.BTC:
            return poolName.replace(/.\-/g, '').split('/')[0] === 'BTC';
        case MarketFilterEnum.AAVE:
            return poolName.replace(/.\-/g, '').split('/')[0] === 'AAVE';
        default:
            return false;
    }
};
