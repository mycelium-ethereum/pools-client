import { ethers } from 'ethers';
import { StateSlice } from '~/store/types';
import { IENSSlice } from './types';
import { StoreState } from '..';

const TTL = 259200 * 1000; // 3 days in milliseconds

type CachedName = {
    name: string;
    expiry: number;
};

const storeENSName = (account: string, name: string): void => {
    const ensName: CachedName = {
        name,
        expiry: Date.now() + TTL,
    };
    localStorage.setItem(ethers.utils.getAddress(account), JSON.stringify(ensName));
};

const getCachedENS = (account: string): CachedName | null => {
    const nameStr = localStorage.getItem(ethers.utils.getAddress(account));
    if (!nameStr) {
        return null;
    }
    const ensName = JSON.parse(nameStr);
    return ensName;
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
            const cachedName: CachedName | null = getCachedENS(account);
            const now = Date.now();
            if (!cachedName || now > cachedName.expiry) {
                // set so we display address straight away
                set({ ensName: undefined });
                console.count('Fetching ENS name');
                const ensName = await get().mainnetProvider.lookupAddress(account);
                if (!ensName) {
                    // can fall through without setting
                    storeENSName(account, account);
                } else {
                    storeENSName(account, ensName);
                    set({ ensName: ensName });
                }
            } else {
                set({ ensName: cachedName.name });
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
