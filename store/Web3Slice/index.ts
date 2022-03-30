import { StateSlice } from '@store/types';
import Onboard from '@tracer-protocol/onboard';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { ethers } from 'ethers';
// import { API as OnboardApi, Initialization, Wallet } from '@tracer-protocol/onboard/dist/src/interfaces';
import { onboardConfig } from '~/constants/onboard';
import { StoreState } from '..';
import { IWeb3Slice } from './types';

export const createWeb3Slice: StateSlice<IWeb3Slice> = (set, get) => ({
    account: undefined,
    network: undefined,
    provider: undefined,
    wallet: undefined,
    isReady: false,

    onboard: Onboard({
        ...onboardConfig,
        darkMode: true, // get().theme === Theme.Dark,
        subscriptions: {
            address: (address) => {
                console.info(`Changing address: ${address}`);
                set({ account: address });
                // onboardConfig?.subscriptions?.address && onboardConfig?.subscriptions?.address(address);
            },
            wallet: (wallet) => {
                console.debug('Detected wallet change');
                if (wallet.provider) {
                    console.debug('Setting wallet provider');
                    if (wallet.name) {
                        // cacheWalletSelection
                        window.localStorage.setItem('onboard.selectedWallet', wallet.name);
                    }
                    const provider_ = new ethers.providers.Web3Provider(wallet.provider, 'any');
                    console.debug('Waiting for injected wallet provider');
                    provider_.ready.then(() => {
                        console.debug('Injected wallet provider ready');
                        console.debug('Setting injected wallet provider', provider_);
                        set({ wallet });
                        // usingDefaultProvider.current = false;
                        set({ provider: provider_ });
                        if (provider_?.network.chainId) {
                            set({ network: provider_.network.chainId.toString() as KnownNetwork });
                        }
                    });
                } else {
                    set({ wallet: undefined });
                }
                // onboardConfig?.subscriptions?.wallet && onboardConfig.subscriptions.wallet(wallet);
            },
            network: (network) => {
                get().onboard.config({ networkId: network });
                console.info(`Changing network ${network}`);
                const network_ = network?.toString() as KnownNetwork;
                set({ network: network_ });
                // onboardConfig?.subscriptions?.network && onboardConfig.subscriptions.network(network);
            },
        },
    }),

    checkIsReady: async () => {
        const isReady = await get()
            .onboard?.walletCheck()
            .catch((_err) => false);
        console.debug('Wallet is ready', isReady);
        set({ isReady: !!isReady });
        return !!isReady;
    },

    resetOnboard: async () => {
        window.localStorage.setItem('onboard.selectedWallet', '');
        set({ isReady: false });
        get().onboard?.walletReset();
    },

    handleConnect: async () => {
        if (get().onboard) {
            try {
                const selectedWallet = await get().onboard?.walletSelect();
                if (selectedWallet) {
                    await get().checkIsReady();
                }
            } catch (err) {
                console.error(err);
            }
        }
    },
});

export const selectWeb3Slice: (state: StoreState) => IWeb3Slice = (state) => state.web3Slice;
export const selectProvider: (state: StoreState) => IWeb3Slice['provider'] = (state) => state.web3Slice.provider;

export const selectOnboardActions: (state: StoreState) => {
    resetOnboard: IWeb3Slice['resetOnboard'];
    handleConnect: IWeb3Slice['handleConnect'];
} = (state) => ({
    handleConnect: state.web3Slice.handleConnect,
    resetOnboard: state.web3Slice.resetOnboard,
});
