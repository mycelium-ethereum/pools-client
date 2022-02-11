import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { SideEnum, CommitActionEnum } from '@libs/constants';
import { CommitEnum } from '@tracer-protocol/pools-js';

/**
 * Simple func to convert a number to a percentage by multiplying
 *  it by 100 and returning the string
 * Fixes the return to two decimal places.
 * @returns 0.00% if the number is NaN < 0.001 for very small percentages and the percentage otherwise
 */
export const toPercent: (value: number) => string = (value) => {
    if (Number.isNaN(value) || !value) {
        return '0.00%';
    }
    const percentage = value * 100;
    if (percentage < 0.001) {
        return '< 0.001%';
    }
    return `${percentage.toFixed(2)}%`;
};

/**
 * Rounds the number to a given amount of decimal places
 * @param num number to round
 * @param decimalPlaces number of decimal places
 * @returns the rounded number
 */
export const round: (num: number, decimalPlaces: number) => number = (num, decimalPlaces) => {
    const p = Math.pow(10, decimalPlaces);
    const n = num * p * (1 + Number.EPSILON);
    return Math.round(n) / p;
};

/**
 * Returns a currency representation of a given ether BigNumber
 * @returns returns the LocaleString representation of the value
 */
export const etherToApproxCurrency: (num: BigNumber, decimals?: number) => string = (num, decimals = 2) => {
    if (!num || num?.eq(0)) {
        // reject if num is falsey or is 0
        const ZERO = 0;
        return `${ZERO.toFixed(decimals)}`;
    }
    const parsedNum = parseFloat(ethers.utils.formatEther(num.toString()));
    return parsedNum.toLocaleString('en-us', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
    });
};

/**
 * Returns a currency representation of a given number or BigNumber
 * @param num_ number to convert to currency
 * @param precision number of decimals / precision to use
 * @returns returns the LocaleString representation of the value
 */
export const toApproxCurrency: (num_: BigNumber | number, precision?: number) => string = (num_, precision) => {
    let num = num_;
    if (typeof num !== 'number' && num) {
        num = (num_ as BigNumber)?.toNumber();
    }
    if (!num) {
        // reject if num is faulty
        return '$0.00';
    }
    return num.toLocaleString('en-us', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: precision ?? 2,
    });
};

export const toApproxLocaleString: (num_: BigNumber | number, precision?: number) => string = (num_, precision) => {
    let num = num_;
    if (typeof num !== 'number' && num) {
        num = (num_ as BigNumber)?.toNumber();
    }
    if (!num) {
        // reject if num is faulty
        return '0.00';
    }
    return num.toLocaleString('en-us', {
        minimumFractionDigits: precision ?? 2,
    });
};

/**
 * Gets the position text based on an account balance
 * @param balance base balance
 * @returns text corresponding to position
 */
export const getPositionText: (balance: BigNumber) => 'NONE' | 'SHORT' | 'LONG' = (balance) => {
    if (balance.eq(0)) {
        return 'NONE';
    } else if (balance.lt(0)) {
        return 'SHORT';
    } else {
        return 'LONG';
    }
};

/**
 * Calculates how much time has passed between two timestamps
 * @param current current timestamp
 * @param previous target timestamp
 * @returns the amount of time that has elapsed between previous and current
 */
export const timeAgo: (current: number, previous: number) => string = (current, previous) => {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;
    const elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + 's';
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + 'm';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + 'h';
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + 'd';
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + 'm';
    } else {
        return Math.round(elapsed / msPerYear) + 'y';
    }
};

/**
 *
 * @param time as timestamp value in seconds
 */
export const timeTill: (time: number) => {
    d?: number;
    h?: number;
    m?: number;
    s: number;
} = (time) => {
    const difference = time - Date.now() / 1000;
    if (difference > 0) {
        return {
            d: Math.floor(difference / (60 * 60 * 24)),
            h: Math.floor((difference / (60 * 60)) % 24),
            m: Math.floor((difference / 60) % 60),
            s: Math.floor(difference % 60),
        };
    }
    return {
        s: 0,
    };
};

/**
 * Formats a given date into YY/MM/DD HH:MM.
 * Optional to hide either the date or the time string or both (returning an empty string)
 * @param date Object to format
 * @param options object containing booleans to hide either the date or time string
 * @returns string of YY/MM/DD HH:MM
 */
export const formatDate: (
    date: Date,
    options?: {
        hideTime: boolean;
        hideDate: boolean;
    },
) => { timeString: string; dateString: string } = (
    date,
    { hideTime, hideDate } = {
        hideDate: false,
        hideTime: false,
    },
) => {
    const dateString = !hideDate ? `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ` : '';
    const timeString = !hideTime ? `${date.getHours()}:${date.getMinutes()}` : '';
    return { timeString, dateString };
};

/**
 * Checks if a number is an arbitrarily small number. Returns is an approximated value instead
 * @param num
 * @param currency
 * @returns
 */
export const isVerySmall: (num: BigNumber, currency: boolean) => string = (num, currency) => {
    const isSmall = num.lt(0.000001); // some arbitrarily small number
    if (currency) {
        if (isSmall && num.eq(0)) {
            return `≈ ${toApproxCurrency(0)}`;
        } else {
            return toApproxCurrency(num);
        }
    } else {
        if (isSmall && !num.eq(0)) {
            return `≈ ${num.toNumber().toFixed(4)}`;
        } else {
            return `${num.toNumber().toFixed(4)}`;
        }
    }
};

/**
 * Converts a side and a token to a commitType
 * @param side long or short (buy or sell)
 * @param token mint or burn token
 * @returns the corresponding value to commit with
 */
export const toCommitType: (side: SideEnum, token: CommitActionEnum) => CommitEnum = (side, token) => {
    if (side === SideEnum.long) {
        if (token === CommitActionEnum.burn) {
            return CommitEnum.longBurn;
        } else {
            return CommitEnum.longMint;
        }
    } else {
        if (token === CommitActionEnum.burn) {
            return CommitEnum.shortBurn;
        } else {
            return CommitEnum.shortMint;
        }
    }
};

/**
 * Calculates the percentage increase/decrease between two values
 * @param newValue
 * @param oldValue
 * @returns the percentage difference between the two given values
 */
export const calcPercentageDifference: (newValue: number, oldValue: number) => number = (newValue, oldValue) =>
    Number.isNaN(oldValue) || !oldValue ? 0 : ((newValue - oldValue) / oldValue) * 100;

export const marketSymbolToAssetName: Record<string, string> = {
    'ETH/USD': 'Ethereum',
    'EUR/USD': 'Euro',
    'BTC/USD': 'Bitcoin',
    'TOKE/USD': 'Tokemak',
    'LINK/USD': 'Chainlink',
    'AAVE/USD': 'AAVE',
};

export const tickerToName: (ticker: string) => string = (ticker) => {
    const [leverage, market] = ticker.split('-');
    return `${leverage}-${marketSymbolToAssetName[market]}`;
};

export const getPriceFeedUrl: (v: string) => string = (v) => {
    if (!v) {
        return 'https://data.chain.link/arbitrum/mainnet/crypto-usd/';
    }

    let name = v?.split('-')[1];
    name = name?.toLowerCase();
    name = /\//.test(name) ? name?.replace('/', '-') : '';

    const market = /eur/.test(name) ? 'fiat' : 'crypto-usd';
    const FEED_URL = `https://data.chain.link/arbitrum/mainnet/${market}/`;

    return `${FEED_URL}${name}`;
};
