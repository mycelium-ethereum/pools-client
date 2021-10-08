import React, { useContext, useEffect, useState, useMemo } from 'react';
// import { Bridge } from 'arb-ts';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { IInbox, ArbSys, GatewayRouter } from 'arb-ts/dist/lib/abi';
import { useWeb3 } from '../Web3Context/Web3Context';
import { networkConfig, Network } from '../Web3Context/Web3Context.Config';
import { useTransactionContext } from '../TransactionContext';
import { ERC20__factory, ERC20 } from '@tracer-protocol/perpetual-pools-contracts/types';
// import { useArbTokenBridge } from 'token-bridge-sdk';
import {
    destinationNetworkLookup,
    bridgeableTokens,
    bridgeableTickers,
    arbitrumContracts,
} from '../../libs/utils/bridge';
import { Bridge, L1TokenData, L2TokenData, Inbox__factory, L1ERC20Gateway__factory } from 'arb-ts';
import { Children } from '@libs/types/General';

import {
    BridgeableAsset,
    // BridgeableBalance,
    BridgeableBalances,
} from '../../libs/types/General';
import { ARBITRUM, MAINNET, MAX_SOL_UINT } from '@libs/constants';

type Contracts = {
    INBOX: IInbox | null;
    ARBSYS: ArbSys | null;
    GATEWAY_ROUTER: GatewayRouter | null;
};

const defaultContracts = {
    INBOX: null,
    ARBSYS: null,
    GATEWAY_ROUTER: null,
};

interface ArbitrumBridgeProps {
    bridgeToken: (tokenAddress: string, amount: BigNumber) => void;
    bridgeEth: (amount: BigNumber) => void;
    approveToken: (tokenAddress: string, spender: string) => void;
    refreshBridgeableBalance: (asset: BridgeableAsset) => Promise<void>;
    fromNetwork: Network;
    toNetwork: Network;
    bridgeableTokenList: typeof bridgeableTokens[string];
    bridgeableAssetList: BridgeableAsset[];
    bridgeableBalances: BridgeableBalances;
    contracts: Contracts;
    showBridgeModal: () => void;
    hideBridgeModal: () => void;
    bridgeModalIsOpen: boolean;
}

export const ArbitrumBridgeContext = React.createContext<ArbitrumBridgeProps>({
    bridgeToken: (tokenAddress: string, amount: BigNumber) =>
        console.debug(`arbitrumBridge.bridgeToken not ready`, tokenAddress, amount),
    bridgeEth: (amount: BigNumber) => console.debug(`arbitrumBridge.bridgeEth not ready`, amount),
    approveToken: (tokenAddress: string, spender: string) =>
        console.debug(`arbitrumBridge.approve not ready`, tokenAddress, spender),
    refreshBridgeableBalance: async (asset: BridgeableAsset) =>
        console.debug(`arbitrumBridge.refreshBridgeableBalance not ready`, asset),
    fromNetwork: networkConfig[MAINNET],
    toNetwork: networkConfig[ARBITRUM],
    bridgeableTokenList: [],
    bridgeableAssetList: [],
    bridgeableBalances: {},
    contracts: defaultContracts,
    showBridgeModal: () => console.debug('arbitrumBridge.showBridgeModal not ready'),
    hideBridgeModal: () => console.debug('arbitrumBridge.hideBridgeModal not ready'),
    bridgeModalIsOpen: false,
});

export const ArbitrumBridgeStore: React.FC = ({ children }: Children) => {
    const { account, signer, provider, network = 1 } = useWeb3();
    const { handleTransaction } = useTransactionContext();
    // const [bridge, setBridge] = useState<Bridge | null>(null);
    const [bridgeableBalances, setBridgeableBalances] = useState<BridgeableBalances>({});
    const [bridgeModalIsOpen, setBridgeModalIsOpen] = useState(false);
    const [bridge, setBridge] = useState<Bridge | null>(null);

    const fromNetwork = useMemo(() => networkConfig[network], [network]);
    const toNetwork = useMemo(() => networkConfig[destinationNetworkLookup[network]], [network]);

    const bridgeableTokenList = useMemo(() => bridgeableTokens[network], [network]);

    const bridgeableAssetList: BridgeableAsset[] = useMemo(() => {
        if (!toNetwork) {
            console.log('RETURNING EMPTY LIST BECAUSE NO toNetwork');
            return [];
        }
        return [
            ...bridgeableTokenList,
            {
                name: 'Ethereum',
                symbol: bridgeableTickers.ETH,
                address: null,
            },
        ];
    }, [bridgeableTokenList]);

    const contracts: Contracts = useMemo(() => {
        return {
            INBOX: arbitrumContracts[network]?.INBOX
                ? (new ethers.Contract(
                      arbitrumContracts[network].INBOX.address,
                      arbitrumContracts[network].INBOX.abi,
                      signer,
                  ) as IInbox)
                : null,
            ARBSYS: arbitrumContracts[network]?.ARBSYS
                ? (new ethers.Contract(
                      arbitrumContracts[network].ARBSYS.address,
                      arbitrumContracts[network].ARBSYS.abi,
                      signer,
                  ) as ArbSys)
                : null,
            GATEWAY_ROUTER: arbitrumContracts[network]?.GATEWAY_ROUTER
                ? (new ethers.Contract(
                      arbitrumContracts[network].GATEWAY_ROUTER.address,
                      arbitrumContracts[network].GATEWAY_ROUTER.abi,
                      signer,
                  ) as GatewayRouter)
                : null,
        };
    }, [network, signer]);

    useEffect(() => {
        if (!provider) {
            return;
        }
        const createBridge = async () => {
            console.log('FROM CHAIN ID', fromNetwork.id, fromNetwork.publicRPC);
            console.log('TO CHAIN ID', toNetwork.id, toNetwork.publicRPC);

            // await provider._networkPromise;

            console.log('OG SIGNER', signer);

            const ethSigner = fromNetwork.isArbitrum
                ? new ethers.providers.JsonRpcProvider(toNetwork.publicRPC).getSigner(account)
                : provider.getSigner(account);

            const arbSigner = fromNetwork.isArbitrum
                ? provider.getSigner(account)
                : new ethers.providers.JsonRpcProvider(toNetwork.publicRPC).getSigner(account);

            const [ethChainId, arbChainId] = await Promise.all([ethSigner.getChainId(), arbSigner.getChainId()]);

            console.log('ETH SIGNER', ethSigner, ethChainId);
            console.log('ARB SIGNER', arbSigner, arbChainId);

            // const stuff = {
            //     ethSigner,
            //     arbSigner,
            // };

            // console.log('MAKING BRIDGE', stuff);

            const bridge = await Bridge.init(ethSigner, arbSigner);

            // console.log('GOT THE BRIDGE', bridge.l1Bridge);

            setBridge(bridge);
        };

        createBridge();
    }, [fromNetwork]);

    // const bridgeEth = (amount: BigNumber) => {
    //     if (!handleTransaction) {
    //         console.error('Failed to bridge ETH: handleTransaction is unavailable');
    //         return;
    //     }
    //     if (!account) {
    //         console.error('Failed to bridge ETH: account is unavailable');
    //     }
    //     if (!fromNetwork.isArbitrum && contracts.INBOX) {
    //         // we are on layer 1, deposit into layer 2
    //         handleTransaction(contracts.INBOX.depositEth, ['0', { value: ethers.utils.parseEther(amount.toFixed()) }]);
    //     } else if (fromNetwork.isArbitrum && contracts.ARBSYS) {
    //         // we are on layer 2, withdraw back to layer 1
    //         if (!account) {
    //             console.error('Failed to withdraw ETH from L2: account unavailable');
    //         }
    //         handleTransaction(contracts.ARBSYS.withdrawEth, [
    //             account,
    //             { value: ethers.utils.parseEther(amount.toFixed()) },
    //         ]);
    //     } else {
    //         console.error('Failed to bridge token: inbox contract or transaction handler undefined');
    //     }
    // };

    const bridgeEth = async (amount: BigNumber) => {
        if (!handleTransaction) {
            console.error('Failed to bridge ETH: handleTransaction is unavailable');
            return;
        }
        if (!account) {
            console.error('Failed to bridge ETH: account is unavailable');
            return;
        }
        if (!bridge) {
            console.error('Failed to bridge ETH: bridge is unavailable');
            return;
        }
        if (!provider) {
            console.error('Failed to bridge ETH: provider is unavailable');
            return;
        }

        console.log('BRIDGING ETH', bridge);

        if (fromNetwork.isArbitrum) {
            // on layer 2, withdraw eth to layer 1
            const arbSys = bridge.l2Bridge.arbSys;

            handleTransaction(arbSys.withdrawEth, [account, { value: ethers.utils.parseEther(amount.toFixed()) }]);
        } else {
            // on layer 1, deposit eth to layer 2

            const inboxAddress = await bridge.l1GatewayRouter.inbox();
            const inbox = new Inbox__factory(provider.getSigner(0)).attach(inboxAddress);

            handleTransaction(inbox.depositEth, ['0', { value: ethers.utils.parseEther(amount.toFixed()) }]);
        }
    };

    // takes the token address and an amount to deposit
    // wrote these two to be not be hard fixed to USDC
    const bridgeToken = async (tokenAddress: string, amount: BigNumber) => {
        if (!handleTransaction) {
            console.error('Failed to bridge ERC20, handleTransaction is unavailable');
            return;
        }
        if (!account) {
            console.error('Failed to bridge ERC20: account is unavailable');
            return;
        }
        if (!bridge) {
            console.error('Failed to bridge ERC20: bridge is unavailable');
            return;
        }
        if (!provider) {
            console.error('Failed to bridge ERC20: provider is unavailable');
            return;
        }
        const bridgeableToken = bridgeableTokenList.find((token) => token.address === tokenAddress);
        if (!bridgeableToken) {
            console.error(`Failed to bridge ERC20: bridgeable token not found with address ${tokenAddress}`);
            return;
        }
        if (fromNetwork.isArbitrum) {
            // we are on layer 2, withdraw back to layer 1
            if (!account) {
                console.error('Failed to withdraw ETH from L2: account unavailable');
            }
            // handleTransaction(contracts.ARBSYS.withdrawEth, [
            //     account,
            //     { value: ethers.utils.parseEther(amount.toFixed()) },
            // ]);
        } else {
            // we are on layer 1, deposit into layer 2

            // const gatewayRouter = bridge.l1GatewayRouter;

            console.log('DOING STUFF', bridge);

            const gasPriceBid = await bridge.l2Provider.getGasPrice();

            console.log('gasPriceBid', gasPriceBid);

            const l1GatewayAddress = await bridge.l1Bridge.getGatewayAddress(tokenAddress);

            console.log('l1GatewayAddress', l1GatewayAddress);

            const l1Gateway = new L1ERC20Gateway__factory(provider.getSigner(account)).attach(l1GatewayAddress);

            const sender = await bridge.l1Bridge.getWalletAddress();
            console.log('sender', sender);

            const depositCallData = await l1Gateway.getOutboundCalldata(
                tokenAddress,
                sender,
                account,
                amount.toFixed(),
                '0x',
            );

            console.log('depositCallData', depositCallData);

            const txnSubmissionPrice = await bridge.l2Bridge.getTxnSubmissionPrice(depositCallData.length - 2);

            console.log('txnSubmissionPrice', txnSubmissionPrice);

            // const depositParams = await bridge.getDepositTxParams({
            //     erc20L1Address: tokenAddress,
            //     amount: ethers.utils.parseUnits(amount.toFixed(), bridgeableToken.decimals),
            //     // destinationAddress: account,
            // });

            // console.log('GOT DEPOSIT PARAMS', depositParams);

            // handleTransaction(gatewayRouter.outboundTransfer, [

            // ]);

            // bridge.deposit(tokenAddress, ethers.utils.parseUnits(amount.toFixed(), bridgeableToken.decimals));

            // console.log('GAS PRICE', gasPrice);
        }
    };

    const approveToken = (tokenAddress: string, spender: string) => {
        if (!handleTransaction) {
            console.error('Failed to approve bridgeable token: handleTransaction unavailable');
            return;
        }

        const token = new ethers.Contract(tokenAddress, ERC20__factory.abi, signer) as ERC20;

        handleTransaction(token.approve, [spender, MAX_SOL_UINT], {
            onSuccess: () => {
                // TODO convert to hashmap to avoid looping both here and in bridgeToken
                const bridgeableAsset = bridgeableTokenList.find((token) => token.address === tokenAddress);

                if (bridgeableAsset) {
                    refreshBridgeableBalance(bridgeableAsset);
                }
            },
        });
    };

    const refreshBridgeableBalance = async (asset: BridgeableAsset): Promise<void> => {
        console.log('REFRESHING BALANCE', asset);
        const newBridgeableBalances = Object.assign({}, bridgeableBalances);

        if (!provider || !signer || !bridge || !account) {
            return;
        }
        // ensure the top level (network) entry is initialised

        newBridgeableBalances[network] = newBridgeableBalances[network] || {};
        // if we are bridging a token from L1 -> L2, the spender is the gateway router for the L1 network

        try {
            if (asset.symbol === bridgeableTickers.ETH) {
                const balance = fromNetwork.isArbitrum
                    ? await bridge?.l2Bridge.getL2EthBalance()
                    : await bridge?.l1Bridge.getL1EthBalance();

                newBridgeableBalances[network][asset.symbol] = {
                    balance: new BigNumber(ethers.utils.formatEther(balance)),
                    allowance: new BigNumber(ethers.utils.formatEther(balance)),
                    spender: '',
                };
            } else if (asset.address) {
                const tokenData = fromNetwork.isArbitrum
                    ? await bridge.l2Bridge.getL2TokenData(asset.address)
                    : await bridge.l1Bridge.getL1TokenData(asset.address);

                const gatewayAddress = fromNetwork.isArbitrum
                    ? bridge.l2Bridge.l2GatewayRouter.address
                    : bridge.l1Bridge.l1GatewayRouter.address;

                const [allowance, decimals] = await Promise.all([
                    tokenData.contract.allowance(account, gatewayAddress),
                    isL1TokenData(tokenData) ? tokenData.decimals : tokenData.contract.decimals(),
                ]);

                newBridgeableBalances[network][asset.symbol] = {
                    balance: new BigNumber(ethers.utils.formatUnits(tokenData.balance, decimals)),
                    allowance: new BigNumber(ethers.utils.formatUnits(allowance, decimals)),
                    spender: gatewayAddress,
                };

                console.log('NEW BALANCE', newBridgeableBalances[network][asset.symbol]);
            }

            setBridgeableBalances(newBridgeableBalances);
        } catch (error) {
            console.error(error);
        }
    };

    const showBridgeModal = () => setBridgeModalIsOpen(true);
    const hideBridgeModal = () => setBridgeModalIsOpen(false);

    return (
        <ArbitrumBridgeContext.Provider
            value={{
                bridgeToken,
                bridgeEth,
                approveToken,
                refreshBridgeableBalance,
                fromNetwork,
                toNetwork,
                bridgeableTokenList,
                bridgeableAssetList,
                bridgeableBalances,
                contracts,
                showBridgeModal,
                hideBridgeModal,
                bridgeModalIsOpen,
            }}
        >
            {children}
        </ArbitrumBridgeContext.Provider>
    );
};

export const useArbitrumBridge: () => ArbitrumBridgeProps = () => {
    const context = useContext(ArbitrumBridgeContext);
    if (context === undefined) {
        throw new Error(`useArbitrumBridge must be called within ArbitrumBridge`);
    }
    return context;
};

const isL1TokenData = (tokenData: L1TokenData | L2TokenData): tokenData is L1TokenData => {
    console.log('IS L1 TOKEN', Boolean((tokenData as any).decimals));
    return Boolean((tokenData as any).decimals);
};
