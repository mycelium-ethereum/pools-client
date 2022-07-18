import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { isAddress } from 'ethers/lib/utils';

export function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ');
}

export const BNFromString = (str: string, decimals: number): BigNumber => {
    return new BigNumber(ethers.utils.formatUnits(str, decimals));
};

export const escapeRegExp = (text: string): string => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

export const randomIntInRange = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const marketRegex = /([A-Za-z]*\/[A-Za-z]*)/g;

const defaultTruncateLength = 10;

/**
 * Convert an ethereum address to a shortened preview
 * @param {string} address - Input ETH address
 * @returns An address with the middle truncated e.g '0x06...Df2'
 */
export const truncateMiddleEthAddress = (address: string, truncateLength?: number): string => {
    const strLength = truncateLength || defaultTruncateLength;
    if (!isAddress(address)) {
        console.warn('Calling toTruncatedMiddleEthAddress on a string not matching a valid Eth address format');
        return address;
    }

    if (strLength < 7) {
        console.warn('Cannot truncate Eth address by desired amount. Returning original string.');
        return address;
    }

    const leadingCharsNum = strLength / 2 - 1;
    const trailingCharsNum = strLength - leadingCharsNum - 3;

    return `${address.slice(0, leadingCharsNum)}...${address.slice(-trailingCharsNum)}`;
};
