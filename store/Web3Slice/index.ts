import { ethers } from 'ethers';
import Onboard from '@tracer-protocol/onboard';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { DEFAULT_WSS_RPC, DEFAULT_NETWORK } from '~/constants/networks';
import { onboardConfig } from '~/constants/onboard';
import { StateSlice } from '~/store/types';
import { IWeb3Slice } from './types';
import { StoreState } from '..';

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
            },
            network: (network) => {
                get().onboard.config({ networkId: network });
                console.info(`Changing network ${network}`);
                const network_ = network?.toString() as KnownNetwork;
                set({ network: network_ });
            },
        },
    }),

    defaultProvider: undefined,
    setDefaultProvider: async () => {
        if (!!DEFAULT_WSS_RPC) {
            const defaultProvider = new ethers.providers.WebSocketProvider(DEFAULT_WSS_RPC);
            await defaultProvider.ready;
            // if a provider is already set dont set it again
            if (!get().provider) {
                console.debug('Provider not set, using default provider');
                set({ defaultProvider, network: DEFAULT_NETWORK });
            }
        }
    },

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
        if (!!get().onboard) {
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
export const selectProvider: (state: StoreState) => IWeb3Slice['provider'] = (state) =>
    state.web3Slice.provider ?? state.web3Slice.defaultProvider;
export const selectNetwork: (state: StoreState) => IWeb3Slice['network'] = (state) => state.web3Slice.network;
export const selectAccount: (state: StoreState) => IWeb3Slice['account'] = (state) => state.web3Slice.account;
export const selectHandleConnect: (state: StoreState) => IWeb3Slice['handleConnect'] = (state) =>
    state.web3Slice.handleConnect;
export const selectOnboard: (state: StoreState) => IWeb3Slice['onboard'] = (state) => state.web3Slice.onboard;
export const selectSetDefaultProvider: (state: StoreState) => IWeb3Slice['setDefaultProvider'] = (state) =>
    state.web3Slice.setDefaultProvider;

export const selectWalletInfo: (state: StoreState) => {
    wallet: IWeb3Slice['wallet'];
    account: IWeb3Slice['account'];
    network: IWeb3Slice['network'];
} = (state) => ({
    account: state.web3Slice.account,
    wallet: state.web3Slice.wallet,
    network: state.web3Slice.network,
});

export const selectOnboardActions: (state: StoreState) => {
    resetOnboard: IWeb3Slice['resetOnboard'];
    handleConnect: IWeb3Slice['handleConnect'];
} = (state) => ({
    handleConnect: state.web3Slice.handleConnect,
    resetOnboard: state.web3Slice.resetOnboard,
});

export const selectWeb3Info: (state: StoreState) => {
    provider: IWeb3Slice['provider'];
    network: IWeb3Slice['network'];
    account: IWeb3Slice['account'];
    signer?: ethers.providers.JsonRpcSigner;
} = (state) => ({
    provider: state.web3Slice.provider ?? state.web3Slice.defaultProvider,
    network: state.web3Slice.network,
    account: state.web3Slice.account,
    signer: state.web3Slice.provider?.getSigner(),
});
