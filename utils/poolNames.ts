/**
 * Format a market name into a chainlink feed url.
 * TODO the market name wont always match a chainlink feed url
 *  eg BTC/LINK does not exist as a feed but is a valid market name
 *  will need to find a solution for this but for now its ok
 */
export const getPriceFeedUrl: (market: string) => string = (market) => {
    if (!market) {
        return 'https://data.chain.link/arbitrum/mainnet/crypto-usd/';
    }
    const name = market.replace('/', '-').toLowerCase();
    const marketType = /eur/.test(name) ? 'fiat' : 'crypto-usd';
    const FEED_URL = `https://data.chain.link/arbitrum/mainnet/${marketType}/`;

    return `${FEED_URL}${name}`;
};

export const splitMarketTicker: (market: string) => {
    underlying: string;
    base: string;
} = (market) => {
    const [underlying, base] = market.split('/');
    return { underlying, base };
};

export const marketSymbolToAssetName: Record<string, string> = {
    'ETH/USD': 'Ethereum',
    'EUR/USD': 'Euro',
    'BTC/USD': 'Bitcoin',
    'TOKE/USD': 'Tokemak',
    'LINK/USD': 'Chainlink',
    'AAVE/USD': 'AAVE',
};

// export const tickerToName: (ticker: string) => string = (ticker) => {
// const [leverage, market] = ticker.split('-');
// return `${leverage}-${marketSymbolToAssetName[market]}`;
// };

// given a poolName, get the marketSymbol
export const getMarketSymbol = (poolName?: string): string => {
    if (!poolName) {
        return '';
    }
    const marketRegex = /([A-Z]*\/[A-Z]*)/g;
    const market = poolName.match(marketRegex);
    return market ? market[0] : '';
};

// given a poolName, get the leverage
export const getMarketLeverage = (poolName?: string): number => {
    if (!poolName) {
        return 0;
    }
    const leverageRegex = /([0-9]*)\-/g;
    const leverage = poolName.match(leverageRegex);
    return leverage ? parseInt(leverage[0]) : 0;
};

export const getMarketInfoFromPoolName = (
    poolName: string,
): {
    leverage: number;
    marketSymbol: string;
    marketBase: string;
} => {
    const marketSymbol = getMarketSymbol(poolName);
    const leverage = getMarketLeverage(poolName);
    return {
        marketSymbol,
        leverage,
        marketBase: getBaseAssetFromMarket(marketSymbol),
    };
};

// gets the market base asset from pool name
export const getBaseAsset = (poolName?: string): string => getBaseAssetFromMarket(getMarketSymbol(poolName));

// gets the market base asset from marketSymbol
export const getBaseAssetFromMarket = (marketSymbol: string): string => marketSymbol.split('/')?.[0] ?? '';
