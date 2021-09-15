// https://choosealicense.com/licenses/lgpl-3.0/
// inspiration from https://github.com/ChainSafe/web3-context

import * as React from 'react';
import { useState, useEffect } from 'react';
import Onboard from '@tracer-protocol/onboard';
import { API as OnboardApi, Wallet, Initialization } from '@tracer-protocol/onboard/dist/src/interfaces';
import { formatEther } from '@ethersproject/units';
import { Network, networkConfig } from './Web3Context.Config';
import { providers, ethers } from 'ethers';
import { useToasts } from 'react-toast-notifications';
import { switchNetworks } from '@libs/utils/rpcMethods';
import { ARBITRUM_RINKEBY } from '@libs/constants';

export type OnboardConfig = Partial<Omit<Initialization, 'networkId'>>;

type Web3ContextProps = {
    cacheWalletSelection?: boolean;
    checkNetwork?: boolean;
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
    ethBalance?: number;
    gasPrice?: number;
    network?: number;
    wallet?: Wallet;
    blockNumber: number;
    config?: Network;
    provider?: providers.Web3Provider;
};

const Web3Context = React.createContext<Web3Context | undefined>(undefined);
const OnboardContext = React.createContext<OnboardContext | undefined>(undefined);

/**
 * Handles connection through BlockNative Onboard library
 */
const Web3Store: React.FC<Web3ContextProps> = ({
    children,
    onboardConfig,
    networkIds,
    cacheWalletSelection = true,
    checkNetwork = (networkIds && networkIds.length > 0) || false,
}) => {
    const errorToastID = React.useRef<string>('');
    const { addToast, updateToast } = useToasts();
    const [account, setAccount] = useState<string | undefined>(undefined);
    const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);
    const [network, setNetwork] = useState<number | undefined>(undefined);
    const [provider, setProvider] = useState<providers.Web3Provider | undefined>(undefined);
    const [ethBalance, setEthBalance] = useState<number | undefined>(undefined);
    const [blockNumber, setBlockNumber] = useState<number>(0);
    const [gasPrice, setGasPrice] = useState<number>(0);
    const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
    const [onboard, setOnboard] = useState<OnboardApi | undefined>(undefined);
    const [isReady, setIsReady] = useState<boolean>(false);
    const [config, setConfig] = useState<Network>(networkConfig[0]);

    // Initialize OnboardJS
    useEffect(() => {
        const initializeOnboard = async () => {
            const checks = [{ checkName: 'accounts' }, { checkName: 'connect' }];
            if (networkIds && checkNetwork) {
                checks.push({ checkName: 'network' });
            }

            try {
                const onboard = Onboard({
                    ...onboardConfig,
                    networkId: networkIds ? networkIds[0] : 421611, //Default to arb
                    walletCheck: checks,
                    subscriptions: {
                        address: (address) => {
                            console.info(`Changing address: ${address}`);
                            setAccount(address);
                            checkIsReady();
                            onboardConfig?.subscriptions?.address && onboardConfig?.subscriptions?.address(address);
                        },
                        wallet: (wallet) => {
                            if (wallet.provider) {
                                wallet.name &&
                                    cacheWalletSelection &&
                                    localStorage.setItem('onboard.selectedWallet', wallet.name);
                                setWallet(wallet);
                                setProvider(new ethers.providers.Web3Provider(wallet.provider, 'any'));
                            } else {
                                setWallet(undefined);
                            }
                            onboardConfig?.subscriptions?.wallet && onboardConfig.subscriptions.wallet(wallet);
                        },
                        network: (network) => {
                            if (!networkIds || networkIds.includes(network)) {
                                onboard.config({ networkId: network });
                            }
                            console.info(`Changing network ${network}`);
                            setNetwork(network);
                            setConfig(networkConfig[network]);
                            checkIsReady();
                            onboardConfig?.subscriptions?.network && onboardConfig.subscriptions.network(network);
                        },
                        balance: (balance) => {
                            try {
                                const bal = Number(formatEther(balance));
                                !isNaN(bal) ? setEthBalance(bal) : setEthBalance(0);
                            } catch (error) {
                                setEthBalance(0);
                            }
                            onboardConfig?.subscriptions?.balance && onboardConfig.subscriptions.balance(balance);
                        },
                    },
                });

                const savedWallet = localStorage.getItem('onboard.selectedWallet');
                cacheWalletSelection && savedWallet && onboard.walletSelect(savedWallet);

                setOnboard(onboard);
            } catch (error) {
                console.error('Error initializing onboard', error);
            }
        };

        initializeOnboard();
    }, []);

    useEffect(() => {
        const signer = provider?.getSigner();
        setSigner(signer);
    }, [provider, account]);

    React.useMemo(() => {
        let mounted = true;
        if (provider) {
            provider.getBlockNumber().then((num) => {
                console.debug(`Setting block number: ${num}`);
                if (mounted) {
                    setBlockNumber(num);
                }
            });
            provider.getGasPrice().then((gasPrice) => {
                console.debug(`Setting gas price: ${gasPrice.toNumber()}`);
                if (mounted) {
                    setGasPrice(parseFloat(ethers.utils.formatUnits(gasPrice, 'gwei')));
                }
            });
        }
        return () => {
            mounted = false;
        };
    }, [provider, network]);

    useEffect(() => {
        console.debug('Detected wallet change');
        if (wallet && wallet?.provider) {
            console.debug('Setting new provider');
            const provider = new ethers.providers.Web3Provider(wallet.provider, 'any');
            setProvider(provider);
        }
    }, [wallet]);

    // unsupported network popup
    useEffect(() => {
        if (!networkConfig[network ?? -1] && provider) {
            // ignore if we are already showing the error
            if (!errorToastID.current) {
                const toastId = addToast(
                    [
                        'Unsupported Network',
                        <span key="unsupported-network-content">
                            <a
                                className="mt-3 text-sm underline cursor-pointer hover:opacity-80 text-tracer-400"
                                onClick={() => {
                                    switchNetworks(provider, ARBITRUM_RINKEBY);
                                }}
                            >
                                Switch to Arbitrum Mainnet
                            </a>
                            <br />
                            <a
                                href="https://developer.offchainlabs.com/docs/user_quickstart"
                                target="_blank"
                                rel="noreferrer noopner"
                                className="mt-3 text-sm underline cursor-pointer hover:opacity-80 text-tracer-400"
                            >
                                Learn more here
                            </a>
                        </span>,
                    ],
                    {
                        appearance: 'error',
                        autoDismiss: false,
                    },
                );
                // @ts-ignore
                errorToastID.current = toastId;
            }
        } else {
            if (errorToastID.current) {
                updateToast(errorToastID.current as unknown as string, {
                    content: 'Switched Network',
                    appearance: 'success',
                    autoDismiss: true,
                });
                errorToastID.current = '';
            }
        }
    }, [network]);

    const checkIsReady = async () => {
        const isReady = await onboard?.walletCheck();
        setIsReady(!!isReady);
        if (!isReady) {
            setEthBalance(0);
        }
        return !!isReady;
    };

    const resetOnboard = async () => {
        localStorage.setItem('onboard.selectedWallet', '');
        setIsReady(false);
        await onboard?.walletReset();
    };

    const handleConnect = async () => {
        if (onboard) {
            try {
                await onboard?.walletSelect();
                await checkIsReady();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const web3Context = React.useMemo(
        () => ({
            account: account,
            signer: signer,
            network: network,
            ethBalance: ethBalance,
            provider: provider,
            wallet: wallet,
            gasPrice,
            blockNumber,
            config,
        }),
        [provider, signer, gasPrice, account, network, ethBalance, config, wallet, blockNumber],
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

const useWeb3: () => Web3Context = () => {
    const context = React.useContext(Web3Context);
    if (context === undefined) {
        throw new Error('useWeb3 must be used within a OnboardProvider');
    }
    return context;
};

export const useWeb3Actions: () => OnboardContext = () => {
    const context = React.useContext(OnboardContext);
    if (context === undefined) {
        throw new Error('useWeb3Actions must be used within a OnboardProvider');
    }
    return context;
};

export { Web3Store, useWeb3 };
