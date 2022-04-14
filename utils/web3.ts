import { ethers } from 'ethers';

export function isAddress(value: string): boolean {
    try {
        return !!ethers.utils.getAddress(value);
    } catch {
        return false;
    }
}
