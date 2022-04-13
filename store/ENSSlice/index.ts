import { ethers } from 'ethers';
import { StateSlice } from '~/store/types';
import { IENSSlice } from './types';
import { StoreState } from '..';

const TTL = 86400 * 1000; // 1 day in milliseconds

const storeENSName = (account: string, name: string): void => {
    const ensName = {
        name,
        expiry: Date.now() + TTL,
    };
    localStorage.setItem(ethers.utils.getAddress(account), JSON.stringify(ensName));
};

const getCachedENS = (account: string): string | null => {
    const nameStr = localStorage.getItem(ethers.utils.getAddress(account));
    if (!nameStr) {
        return null;
    }
    const ensName = JSON.parse(nameStr);
    const now = Date.now();
    if (now > ensName.expiry) {
        localStorage.removeItem(ethers.utils.getAddress(account));
        return null;
    }
    return ensName.name;
};

export const createENSSlice: StateSlice<IENSSlice> = (set, get) => ({
    ensName: undefined,
    mainnetProvider: new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_MAINNET_L1_RPC),
    checkENSName: async (account) => {
        if (!account) {
            set({ ensName: undefined });
            return;
        }
        try {
            let name: string | null = getCachedENS(account);
            if (!name) {
                console.count('Fetching ENS name');
                set({ ensName: undefined });
                name = await get().mainnetProvider.lookupAddress(account);
                name && storeENSName(account, name);
            }
            if (name) {
                set({ ensName: name });
            }
        } catch (err) {
            console.error('Failed to fetch ens name', err);
            set({ ensName: undefined });
        }
    },
});

export const selectENSName: (state: StoreState) => IENSSlice['ensName'] = (state) => state.ensSlice.ensName;
export const selectCheckENSName: (state: StoreState) => IENSSlice['checkENSName'] = (state) =>
    state.ensSlice.checkENSName;
