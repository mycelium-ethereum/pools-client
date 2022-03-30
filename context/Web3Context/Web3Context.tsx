import React, { createContext, useEffect, useRef } from 'react';
import { ethers, providers } from 'ethers';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { API as OnboardApi, Initialization, Wallet } from '@tracer-protocol/onboard/dist/src/interfaces';
import { Network } from '~/types/networks';
import { useStore } from '@store/main';
import { selectIsDark } from '@store/ThemeSlice';
import { selectWeb3Slice } from '@store/Web3Slice';

export type OnboardConfig = Partial<Omit<Initialization, 'networkId'>>;

type Web3ContextProps = {
    cacheWalletSelection?: boolean;
    children: React.ReactNode;
    networkIds?: number[];
    onboardConfig?: OnboardConfig;
};

type OnboardContext = {
    isReady: boolean;
    isMobile: boolean;
    onboard?: OnboardApi;
    checkIsReady(): Promise<boolean>;
    resetOnboard(): void;
    handleConnect(): void;
};

type Web3Context = {
    account?: string;
    signer?: ethers.Signer;
    gasPrice?: number;
    network?: KnownNetwork;
    wallet?: Wallet;
    blockNumber: number;
    config?: Network;
    provider?: providers.JsonRpcProvider;
    unsupportedNetworkPopupRef: React.MutableRefObject<string>;
};

const Web3Context = createContext<Web3Context | undefined>(undefined);
const OnboardContext = createContext<OnboardContext | undefined>(undefined);

// const DEFAULT_NETWORK = ARBITRUM;
// const DEFAULT_WSS_RPC = networkConfig[DEFAULT_NETWORK].publicWebsocketRPC;

/**
 * Handles connection through BlockNative Onboard library
 */
const Web3Store: React.FC<Web3ContextProps> = ({ children }) => {
    const isDark = useStore(selectIsDark);

    const { onboard, account, provider, network, wallet, isReady, handleConnect, checkIsReady, resetOnboard } =
        useStore(selectWeb3Slice);

    // const usingDefaultProvider = useRef(true);
    const unsupportedNetworkPopupRef = useRef<string>('');

    // connect wallet on start if saved wallet
    useEffect(() => {
        const savedWallet = window.localStorage.getItem('onboard.selectedWallet');
        if (savedWallet) {
            (async () => {
                await onboard.walletSelect(savedWallet);
                await onboard.walletCheck();
            })();
        }
    }, []);

    // change theme
    useEffect(() => {
        if (onboard) {
            onboard?.config({ darkMode: isDark });
        }
    }, [isDark]);

    // useEffect(() => {
    // let mounted = true;
    // const waitForDefaultProvider = async () => {
    // if (DEFAULT_WSS_RPC) {
    // const provider_ = new ethers.providers.WebSocketProvider(DEFAULT_WSS_RPC);
    // websocket providers need to initiate
    // console.debug('Waiting for provider', provider_.ready);
    // await provider_.ready;
    // console.debug('Provider ready, setting provider', usingDefaultProvider.current);
    // if (usingDefaultProvider.current) {
    // if the provider has not been set by onboard
    // if (mounted) {
    // setNetwork(DEFAULT_NETWORK);
    // setConfig(networkConfig[DEFAULT_NETWORK]);
    // setProvider(provider_);
    // }
    // }
    // }
    // };
    // if (onboard && checkIsReady()) {
    // waitForDefaultProvider();
    // }
    // return () => {
    // mounted = false;
    // };
    // }, [onboard]);

    const web3Context = React.useMemo(
        () => ({
            account: account,
            signer: provider?.getSigner(),
            network: network,
            provider: provider,
            wallet: wallet,
            gasPrice: 0,
            blockNumber: 0,
            config: undefined,
            unsupportedNetworkPopupRef,
        }),
        [provider, account, network, wallet],
    );

    const onboardState = onboard?.getState();
    return (
        <>
            <OnboardContext.Provider
                value={{
                    onboard: onboard,
                    isReady: isReady,
                    checkIsReady,
                    isMobile: !!onboardState?.mobileDevice,
                    resetOnboard,
                    handleConnect,
                }}
            >
                <Web3Context.Provider value={web3Context}>{children}</Web3Context.Provider>
            </OnboardContext.Provider>
        </>
    );
};

export { Web3Store };
