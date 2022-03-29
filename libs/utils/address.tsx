import { getAddress } from '@ethersproject/address';

export function isAddress(value: string): boolean {
    try {
        return !!getAddress(value);
    } catch {
        return false;
    }
}
