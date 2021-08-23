// https://choosealicense.com/licenses/lgpl-3.0/
// inspiration from https://github.com/ChainSafe/web3-context

import * as React from 'react';
import { useState, useEffect } from 'react';
import Onboard from '@tracer-protocol/onboard';
import { API as OnboardApi, Wallet, Initialization } from '@tracer-protocol/onboard/dist/src/interfaces';
import { formatEther } from '@ethersproject/units';
import { Network, networkConfig } from './Web3Context.Config';
import ApproveConnectionModal from '@components/Legal/ApproveConnectionModal';
import { providers, ethers } from 'ethers';

import Cookies from 'universal-cookie';

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
    const [account, setAccount] = useState<string | undefined>(undefined);
    const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);
    const [network, setNetwork] = useState<number | undefined>(undefined);
    const [provider, setProvider] = useState<providers.Web3Provider | undefined>(undefined);
    const [ethBalance, setEthBalance] = useState<number | undefined>(undefined);
    const [gasPrice, setGasPrice] = useState<number>(0);
    const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
    const [onboard, setOnboard] = useState<OnboardApi | undefined>(undefined);
    const [isReady, setIsReady] = useState<boolean>(false);
    const [config, setConfig] = useState<Network>(networkConfig[0]);
    const [showTerms, setShowTerms] = useState<boolean>(false);
    const [acceptedTerms, acceptTerms] = useState(false);

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
                    networkId: networkIds ? networkIds[0] : 42, //Default to kovan
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
                            wallet &&
                                wallet?.provider &&
                                setProvider(new ethers.providers.Web3Provider(wallet.provider, 'any'));
                            setNetwork(network);
                            console.info(`Changing network ${network}`);
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
        const cookies = new Cookies();
        if (acceptedTerms) {
            cookies.set('acceptedTerms', 'true', { path: '/' });
            handleConnect();
            setShowTerms(false);
        }
    }, [acceptedTerms]);

    useEffect(() => {
        const signer = provider?.getSigner();
        console.log(signer, "Signer")
        setSigner(signer);
    }, [provider, account]);

    React.useMemo(() => {
        let mounted = true;
        const fetch = async () => {
            const gasPrice = await (provider as ethers.providers.JsonRpcProvider).getGasPrice();
            console.log(gasPrice, "fetched gas price")
            if (mounted) {
                setGasPrice(parseInt(ethers.utils.formatUnits(gasPrice, "gwei")))
            }
        }
        if (provider) {
            fetch()
        }
        return () => {
            mounted = false;
        }

    }, [provider])

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

    const acceptLegalTerms = () => {
        const cookies = new Cookies();
        if (cookies.get('acceptedTerms') !== 'true') {
            setShowTerms(true);
        } else {
            setShowTerms(false);
            acceptTerms(true);
        }
        return acceptedTerms;
    };

    const handleConnect = async () => {
        if (onboard) {
            try {
                const accepted = acceptLegalTerms();
                if (accepted) {
                    await onboard?.walletSelect();
                    await checkIsReady();
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const web3Context = React.useMemo(() => ({
        account: account,
        signer: signer,
        network: network,
        ethBalance: ethBalance,
        provider: provider,
        wallet: wallet,
        gasPrice,
        config,
    }), [provider, signer, gasPrice, account, network, ethBalance, config, wallet])

    const onboardState = onboard?.getState();
    return (
        <>
            <OnboardContext.Provider value={{
                onboard: onboard,
                isReady: isReady,
                checkIsReady,
                isMobile: !!onboardState?.mobileDevice,
                resetOnboard,
                handleConnect,
            }}>
                <Web3Context.Provider
                    value={web3Context}
                >
                    {children}
                </Web3Context.Provider>
            </OnboardContext.Provider>
            <ApproveConnectionModal
                acceptedTerms={acceptedTerms}
                show={showTerms}
                setShow={setShowTerms}
                acceptTerms={acceptTerms}
            />
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
