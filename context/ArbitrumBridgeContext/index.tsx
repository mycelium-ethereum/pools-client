import React, { useContext, useCallback, useState, useMemo } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { useWeb3 } from '../Web3Context/Web3Context';
import { networkConfig, Network } from '../Web3Context/Web3Context.Config';
import { useTransactionContext } from '../TransactionContext';
import { ERC20__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
import {
    destinationNetworkLookup,
    bridgeableAssets,
    bridgeableTickers,
    isArbitrumNetwork,
    BridgeableAssets,
} from '@libs/utils/bridge';
import { Bridge, L1TokenData, L2TokenData, Inbox__factory } from 'arb-ts';
import { Children } from '@libs/types/General';

import { BridgeableAsset, BridgeableBalances } from '../../libs/types/General';
import { ARBITRUM, MAINNET, MAX_SOL_UINT } from '@libs/constants';

type CachedBridges = {
    [account: string]: {
        [networkId: string]: Bridge;
    };
};

interface ArbitrumBridgeProps {
    bridgeToken: (tokenAddress: string, amount: BigNumber, callback: () => void) => void;
    bridgeEth: (amount: BigNumber, callback: () => void) => void;
    approveToken: (tokenAddress: string, spender: string) => void;
    refreshBridgeableBalance: (asset: BridgeableAsset) => Promise<void>;
    fromNetwork: Network;
    toNetwork: Network;
    bridgeableAssets: BridgeableAssets;
    bridgeableBalances: BridgeableBalances;
}

export const ArbitrumBridgeContext = React.createContext<ArbitrumBridgeProps>({
    bridgeToken: (tokenAddress: string, amount: BigNumber) =>
        console.debug(`arbitrumBridge.bridgeToken not ready`, tokenAddress, amount),
    bridgeEth: (amount: BigNumber, callback: () => void) =>
        console.debug(`arbitrumBridge.bridgeEth not ready`, amount, callback),
    approveToken: (tokenAddress: string, spender: string) =>
        console.debug(`arbitrumBridge.approve not ready`, tokenAddress, spender),
    refreshBridgeableBalance: async (asset: BridgeableAsset) =>
        console.debug(`arbitrumBridge.refreshBridgeableBalance not ready`, asset),
    fromNetwork: networkConfig[MAINNET],
    toNetwork: networkConfig[ARBITRUM],
    bridgeableAssets: {},
    bridgeableBalances: {},
});

const BRIDGEABLE_ASSET_ETH = {
    name: 'Ethereum',
    symbol: bridgeableTickers.ETH,
    address: null,
    displayDecimals: 6,
    decimals: 18,
};

const withdrawalToastBody = (
    <>
        It will take approximately 8 days to receive your funds on Ethereum. To view pending withdrawals, visit the
        official Arbitrum bridge.
    </>
);

const depositToastBody = (
    <>
        It may take up to 10 minutes to receive your funds on Arbitrum. To view pending deposits, visit the official
        Arbitrum bridge.
    </>
);

export const ArbitrumBridgeStore: React.FC = ({ children }: Children) => {
    const { account, signer, provider, network = MAINNET } = useWeb3();
    const { handleTransaction } = useTransactionContext();
    const [bridgeableBalances, setBridgeableBalances] = useState<BridgeableBalances>({});
    const [cachedBridges, setCachedBridges] = useState<CachedBridges>({});

    const fromNetwork = useMemo(() => networkConfig[network], [network]);
    const toNetwork = useMemo(() => networkConfig[destinationNetworkLookup[network]], [network]);

    const getBridge = useCallback(async () => {
        if (!provider) {
            console.info('Void getBridge return: provider not defined');
            return;
        }

        if (!account) {
            console.debug('Void getBridge return: account not defined');
            return;
        }

        if (!fromNetwork || !toNetwork) {
            console.debug('Void getBridge return: from or to network not defined');
            return;
        }

        if (cachedBridges[account]?.[fromNetwork.id]) {
            return cachedBridges[account]?.[fromNetwork.id];
        }

        const ethSigner = isArbitrumNetwork(fromNetwork.id)
            ? new ethers.providers.JsonRpcProvider(toNetwork.publicRPC).getSigner(account)
            : provider.getSigner(account);
        const arbSigner = isArbitrumNetwork(fromNetwork.id)
            ? provider.getSigner(account)
            : new ethers.providers.JsonRpcProvider(toNetwork.publicRPC).getSigner(account);

        const bridge = await Bridge.init(ethSigner, arbSigner);

        setCachedBridges((previousValue) => ({
            ...previousValue,
            [account]: {
                ...(previousValue?.[account] || {}),
                [network]: bridge,
            },
        }));

        return bridge;
    }, [fromNetwork?.id, toNetwork?.id, account, provider]);

    const bridgeEth = async (amount: BigNumber, callback: () => void) => {
        if (!handleTransaction) {
            console.error('Failed to bridge ETH: handleTransaction is unavailable');
            return;
        }

        if (!account) {
            console.error('Failed to bridge ETH: account is unavailable');
            return;
        }

        const bridge = await getBridge();
        if (!bridge) {
            console.error('Failed to bridge ETH: bridge is unavailable');
            return;
        }

        if (!provider) {
            console.error('Failed to bridge ETH: provider is unavailable');
            return;
        }

        if (!fromNetwork) {
            console.error('Failed to bridge ETH: fromNetwork is unavailable');
            return;
        }

        if (isArbitrumNetwork(fromNetwork.id)) {
            // on layer 2, withdraw eth to layer 1
            const arbSys = bridge.l2Bridge.arbSys;

            handleTransaction(arbSys.withdrawEth, [account, { value: ethers.utils.parseEther(amount.toFixed()) }], {
                onSuccess: () => {
                    callback();
                    refreshBridgeableBalance(BRIDGEABLE_ASSET_ETH);
                },
                onError: () => {
                    callback();
                },
                statusMessages: {
                    waiting: {
                        title: `Submitting ETH withdrawal from ${fromNetwork.name}`,
                        body: '',
                    },
                    success: {
                        title: `Submitted ETH withdrawal from ${fromNetwork.name}`,
                        body: withdrawalToastBody,
                    },
                    error: {
                        title: `Failed to submit ETH withdrawal from ${fromNetwork.name}`,
                        body: '',
                    },
                },
            });
        } else {
            // on layer 1, deposit eth to layer 2

            const inboxAddress = await bridge.l1GatewayRouter.inbox();
            const inbox = new Inbox__factory(bridge.l1Signer).attach(inboxAddress);

            const [maxSubmissionPrice] = await bridge.l2Bridge.getTxnSubmissionPrice(0);

            handleTransaction(
                inbox.depositEth,
                [maxSubmissionPrice, { value: ethers.utils.parseEther(amount.toFixed()) }],
                {
                    onSuccess: () => {
                        callback();
                        refreshBridgeableBalance(BRIDGEABLE_ASSET_ETH);
                    },
                    onError: () => {
                        callback();
                    },
                    statusMessages: {
                        waiting: {
                            title: `Submitting ETH deposit to ${toNetwork.name}`,
                            body: '',
                        },
                        success: {
                            title: `Submitted ETH deposit to ${toNetwork.name}`,
                            body: depositToastBody,
                        },
                        error: {
                            title: `Failed to submit ETH deposit to ${toNetwork.name}`,
                            body: '',
                        },
                    },
                },
            );
        }
    };

    // takes the token address and an amount to deposit
    // wrote these two to be not be hard fixed to USDC
    const bridgeToken = async (tokenAddress: string, amount: BigNumber, callback: () => void) => {
        if (!handleTransaction) {
            console.error('Failed to bridge ERC20, handleTransaction is unavailable');
            return;
        }
        if (!account) {
            console.error('Failed to bridge ERC20: account is unavailable');
            return;
        }

        const bridge = await getBridge();

        if (!bridge) {
            console.error('Failed to bridge ERC20: bridge is unavailable');
            return;
        }
        if (!provider) {
            console.error('Failed to bridge ERC20: provider is unavailable');
            return;
        }
        if (!fromNetwork) {
            console.error('Failed to bridge ERC20: fromNetwork is unavailable');
            return;
        }

        const bridgeableToken = bridgeableAssets[fromNetwork.id].find((token) => token.address === tokenAddress);
        if (!bridgeableToken) {
            console.error(`Failed to bridge ERC20: bridgeable token not found with address ${tokenAddress}`);
            return;
        }
        if (isArbitrumNetwork(fromNetwork.id)) {
            // we are on layer 2, withdraw back to layer 1

            const l1TokenAddress = await bridge.l2Bridge.getERC20L1Address(tokenAddress);

            handleTransaction(
                bridge.l2Bridge.l2GatewayRouter.functions['outboundTransfer(address,address,uint256,bytes)'],
                [l1TokenAddress, account, ethers.utils.parseUnits(amount.toFixed(), bridgeableToken.decimals), '0x'],
                {
                    onSuccess: () => {
                        callback();
                        refreshBridgeableBalance(bridgeableToken);
                    },
                    onError: () => {
                        callback();
                    },
                    statusMessages: {
                        waiting: {
                            title: `Submitting ${bridgeableToken.symbol} withdrawal from ${fromNetwork.name}`,
                            body: '',
                        },
                        success: {
                            title: `Submitted ${bridgeableToken.symbol} withdrawal from ${fromNetwork.name}`,
                            body: withdrawalToastBody,
                        },
                        error: {
                            title: `Failed to submit ${bridgeableToken.symbol} withdrawal from ${fromNetwork.name}`,
                            body: '',
                        },
                    },
                },
            );
        } else {
            // we are on layer 1, deposit into layer 2

            const depositParams = await bridge.getDepositTxParams({
                erc20L1Address: tokenAddress,
                amount: ethers.utils.parseUnits(amount.toFixed(), bridgeableToken.decimals),
                destinationAddress: account,
            });

            const abiCoder = new ethers.utils.AbiCoder();
            const data = abiCoder.encode(['uint256', 'bytes'], [depositParams.maxSubmissionCost, '0x']);

            handleTransaction(
                bridge.l1GatewayRouter.outboundTransfer,
                [
                    depositParams.erc20L1Address,
                    depositParams.destinationAddress || account,
                    depositParams.amount,
                    depositParams.maxGas,
                    depositParams.gasPriceBid,
                    data,
                    {
                        value: depositParams.l1CallValue,
                    },
                ],
                {
                    onSuccess: () => {
                        callback();
                        refreshBridgeableBalance(bridgeableToken);
                    },
                    onError: () => {
                        callback();
                    },
                    statusMessages: {
                        waiting: {
                            title: `Submitting ${bridgeableToken.symbol} deposit to ${toNetwork.name}`,
                            body: '',
                        },
                        success: {
                            title: `Submitted ${bridgeableToken.symbol} deposit to ${toNetwork.name}`,
                            body: depositToastBody,
                        },
                        error: {
                            title: `Failed to submit ${bridgeableToken.symbol} deposit to ${toNetwork.name}`,
                            body: '',
                        },
                    },
                },
            );
        }
    };

    const approveToken = (tokenAddress: string, spender: string) => {
        if (!handleTransaction) {
            console.error('Failed to approve bridgeable token: handleTransaction unavailable');
            return;
        }

        if (!signer) {
            console.error('Failed to approve token: signer undefined');
            return;
        }

        // @ts-ignore
        const token = ERC20__factory.connect(tokenAddress, signer);

        const bridgeableToken = bridgeableAssets[fromNetwork.id].find((token) => token.address === tokenAddress);
        if (!bridgeableToken) {
            console.error(`Failed to approve ERC20: bridgeable token not found with address ${tokenAddress}`);
            return;
        }

        handleTransaction(token.approve, [spender, MAX_SOL_UINT], {
            onSuccess: () => {
                // TODO convert to hashmap to avoid looping both here and in bridgeToken
                if (fromNetwork) {
                    if (bridgeableToken) {
                        refreshBridgeableBalance(bridgeableToken);
                    }
                }
            },
            statusMessages: {
                waiting: {
                    title: `Unlocking ${bridgeableToken.symbol}`,
                    body: '',
                },
                success: {
                    title: `Unlocked ${bridgeableToken.symbol}`,
                    body: '',
                },
                error: {
                    title: `Unlock ${bridgeableToken.symbol} failed`,
                    body: '',
                },
            },
        });
    };

    const refreshBridgeableBalance = async (asset: BridgeableAsset): Promise<void> => {
        const newBridgeableBalances = Object.assign({}, bridgeableBalances);

        if (!account) {
            console.error('Failed to refresh bridgeable balance: account is unavailable');
            return;
        }

        const bridge = await getBridge();

        if (!bridge) {
            console.error('Failed to refresh bridgeable balance: bridge is unavailable');
            return;
        }
        if (!fromNetwork) {
            console.error('Failed to refresh bridgeable balance: fromNetwork is unavailable');
        }

        console.debug('Fetching bridge balances');

        // ensure the network and account entries are initialised
        newBridgeableBalances[fromNetwork.id] = newBridgeableBalances[fromNetwork.id] || {};
        newBridgeableBalances[fromNetwork.id][account] = newBridgeableBalances[fromNetwork.id][account] || {};

        try {
            if (asset.symbol === bridgeableTickers.ETH) {
                const balance = isArbitrumNetwork(fromNetwork.id)
                    ? await bridge?.l2Bridge.getL2EthBalance()
                    : await bridge?.l1Bridge.getL1EthBalance();

                newBridgeableBalances[fromNetwork.id][account][asset.symbol] = {
                    balance: new BigNumber(ethers.utils.formatEther(balance)),
                    allowance: new BigNumber(ethers.utils.formatEther(balance)),
                    spender: '',
                };
            } else if (asset.address) {
                const tokenData = isArbitrumNetwork(fromNetwork.id)
                    ? await bridge.l2Bridge.getL2TokenData(asset.address)
                    : await bridge.l1Bridge.getL1TokenData(asset.address);

                const erc20GatewayAddress = await getERC20GatewayAddress(fromNetwork, asset, bridge);

                const [allowance, decimals] = await Promise.all([
                    tokenData.contract.allowance(account, erc20GatewayAddress),
                    isL1TokenData(tokenData) ? tokenData.decimals : tokenData.contract.decimals(),
                ]);

                newBridgeableBalances[fromNetwork.id][account][asset.symbol] = {
                    balance: new BigNumber(ethers.utils.formatUnits(tokenData.balance, decimals)),
                    allowance: new BigNumber(ethers.utils.formatUnits(allowance, decimals)),
                    spender: erc20GatewayAddress,
                };
            }

            setBridgeableBalances(newBridgeableBalances);
        } catch (error) {
            console.error('Fauled to fetch bridge balances', error);
        }
    };

    return (
        <ArbitrumBridgeContext.Provider
            value={{
                bridgeToken,
                bridgeEth,
                approveToken,
                refreshBridgeableBalance,
                fromNetwork,
                toNetwork,
                bridgeableAssets,
                bridgeableBalances,
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
    return Boolean((tokenData as any).decimals);
};

const getERC20GatewayAddress = async (fromNetwork: Network, asset: BridgeableAsset, bridge: Bridge) => {
    if (!asset.address) {
        throw new Error('Could not get ERC20GatewayAddress: asset address is unknown');
    }

    if (isArbitrumNetwork(fromNetwork.id)) {
        const l1Address = await bridge.l2Bridge.getERC20L1Address(asset.address);
        if (!l1Address) {
            throw new Error(
                `Could not get ERC20GatewayAddress: l2 address ${asset.address} has no known corresponding l1 address`,
            );
        }
        return bridge.l2Bridge.getGatewayAddress(l1Address);
    }

    return bridge.l1Bridge.getGatewayAddress(asset.address);
};
