import { MarketFilterEnum } from '~/types/filters';

export const marketFilter: (poolName: string, marketFilterState: MarketFilterEnum) => boolean = (
    poolName,
    marketFilterState,
) => {
    switch (marketFilterState) {
        case MarketFilterEnum.All:
            return true;
        // case MarketFilterEnum.EUR:
            // return poolName.replace(/.\-/g, '').split('/')[0] === 'EUR';
        // case MarketFilterEnum.TOKE:
            // return poolName.replace(/.\-/g, '').split('/')[0] === 'TOKE';
        case MarketFilterEnum.LINK:
            return poolName.replace(/.\-/g, '').split('/')[0] === 'LINK';
        case MarketFilterEnum.ETH:
            return poolName.replace(/.\-/g, '').split('/')[0] === 'ETH';
        case MarketFilterEnum.BTC:
            return poolName.replace(/.\-/g, '').split('/')[0] === 'BTC';
        // case MarketFilterEnum.AAVE:
            // return poolName.replace(/.\-/g, '').split('/')[0] === 'AAVE';
        default:
            return false;
    }
};

export const generalMarketFilter: (poolName: string, marketFilterState: MarketFilterEnum) => boolean = (
    name,
    marketFilterState,
) => {
    switch (marketFilterState) {
        case MarketFilterEnum.All:
            return true;
        // case MarketFilterEnum.EUR:
            // return name.search('EUR') > -1;
        // case MarketFilterEnum.TOKE:
            // return name.search('TOKE') > -1;
        case MarketFilterEnum.LINK:
            return name.search('LINK') > -1;
        case MarketFilterEnum.ETH:
            return name.search('ETH') > -1;
        case MarketFilterEnum.BTC:
            return name.search('BTC') > -1;
        // case MarketFilterEnum.AAVE:
            // return name.search('AAVE') > -1;
        default:
            return false;
    }
};
