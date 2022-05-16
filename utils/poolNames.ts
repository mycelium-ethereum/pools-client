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

// given a pool symbol or token symbol, get the marketSymbol
export const getMarketSymbol = (poolSymbol?: string): string => {
    if (!poolSymbol) {
        return '';
    }
    const marketRegex = /([A-Z]*\/[A-Z]*)/g;
    const market = poolSymbol.match(marketRegex);
    console.log('found market', market);
    return market ? market[0] : '';
};

// given a pool symbol or token symbol, get the leverage
export const getMarketLeverage = (poolSymbol?: string): number => {
    if (!poolSymbol) {
        return 0;
    }
    const leverageRegex = /([0-9]*)(?:|L|S)\-/g;
    const leverage = poolSymbol.match(leverageRegex);
    return leverage ? parseInt(leverage[0].replace('-', '')) : 0;
};

/**
 * Get the market info from relevant pool symbol.
 * Will work on pool symbols and pool token symbols
 * @param poolSymbol either poolSymbol or pool token symbol
 */
export const getMarketInfoFromSymbol = (
    poolSymbol: string,
): {
    leverage: number;
    marketSymbol: string;
    marketBase: string;
} => {
    const marketSymbol = getMarketSymbol(poolSymbol);
    const leverage = getMarketLeverage(poolSymbol);
    return {
        marketSymbol,
        leverage,
        marketBase: getBaseAssetFromMarket(marketSymbol),
    };
};

/**
 * Removes the +{SETTLEMENT_TOKEN} from the poolName or tokenSymbol
 * @param poolSymbol can either be a pool token symbol or pool symbol
 * @returns the poolSymbol with SETTLEMENT_TOKEN removed or poolSymbol if no SETTLEMENT was found
 */
export const getShortenedSymbol = (poolSymbol: string): string => poolSymbol.split('+')?.[0] ?? poolSymbol;

// gets the market base asset from pool name
export const getBaseAsset = (poolName?: string): string => getBaseAssetFromMarket(getMarketSymbol(poolName));

// gets the market base asset from marketSymbol
export const getBaseAssetFromMarket = (marketSymbol: string): string => marketSymbol.split('/')?.[0] ?? '';
