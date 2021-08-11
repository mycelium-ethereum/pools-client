import { CurrencyType, PoolType } from '@libs/types/General';
import { BigNumber, ethers } from 'ethers';

/**
 * Simple func to convert a number to a percentage by multiplying
 *  it by 100 and returning the string
 * Fixes the return to two decimal places.
 * @param
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
 * @param num_ number to convert to currency
 * @returns returns the LocaleString representation of the value
 */
export const etherToApproxCurrency: (num: BigNumber) => string = (num) => {
    if (!num || num?.eq(0)) {
        // reject if num is falsey or is 0
        return '$0.00';
    }
    const parsedNum = parseFloat(ethers.utils.formatEther(num));
    return parsedNum.toLocaleString('en-us', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
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
        // reject if num is falsey
        return '$0.00';
    }
    return num.toLocaleString('en-us', {
        style: 'currency',
        currency: 'USD',
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
    'd'?: number,
    'h'?: number,
    'm'?: number,
    's': number
}  = (time) => {

    let difference = time - (Date.now() / 1000);
    if (difference > 0) {
      return(
        {
            d: Math.floor(difference / (1000 * 60 * 60 * 24)),
            h: Math.floor((difference / (1000 * 60 * 60)) % 24),
            m: Math.floor((difference / 1000 / 60) % 60),
            s: Math.floor((difference / 1000) % 60)
        }
    )}
    return {
        s: 0
    }
}

/**
 * Formats a given date into HH:MM:SS
 * @param date Object to format
 * @returns string of HH:MM:SS
 */
export const formatDate: (date: Date) => string = (date) =>
    `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

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
 * Deconstructs the pools names and releseases a list of options
 * @param pools list of pool names
 * @requires pools names to follow naming convention
 */
export const deconstructNames: (pools: PoolType[]) => {
    leverageOptions: string[],
    settlementOptions: (CurrencyType | "All")[],
} = (pools) => {
    // Naming convention 1UP-TSLA/USD+aDAI
    // 2DOWN-TSLA/USD+aDAI
    // leverageSIDE-base/quote+collateral
    // collateral === settlement

    const leverageOptions: string[] = ["All"]
    const settlementOptions: (CurrencyType | "All")[] = ["All"];

    pools.map((pool) => {
        const poolName = pool.name;
        let [leverage_, _base, quote, collateral] = poolName.replace('+', '-').split('-');
        // fetch leverage
        let leverage;
        if (leverage_.includes('DOWN')) {
            leverage = leverage_.replace('DOWN', '')
        } else {
            leverage = leverage_.replace('UP', '')
        }
        // set collateral to quote if its falsey
        collateral = !!collateral ? collateral : quote;

        if (!leverageOptions.includes(leverage)) {
            leverageOptions.push(leverage)
        }
        if (!settlementOptions.includes(collateral as CurrencyType)) {
            settlementOptions.push(collateral as CurrencyType)
        }
    })
    return {
        leverageOptions,
        settlementOptions
    }
}


/**
 * Function to convert an ethers big number to a js number
 */
export const formatEtherBigNumber = (num: BigNumber) => parseInt(ethers.utils.formatEther(num)).toFixed(2)
