import React, { useContext, useState, useMemo } from 'react';
// import { Bridge } from 'arb-ts';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { IInbox, ArbSys, GatewayRouter } from 'arb-ts/dist/lib/abi';
import { useWeb3 } from '../Web3Context/Web3Context';
import { networkConfig, Network } from '../Web3Context/Web3Context.Config';
import { useTransactionContext } from '../TransactionContext';
import { ERC20__factory, ERC20 } from '@tracer-protocol/perpetual-pools-contracts/types';
import {
    destinationNetworkLookup,
    bridgeableTokens,
    bridgeableTickers,
    arbitrumContracts,
} from '../../libs/utils/bridge';
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
    const { account, signer, provider, network = 1, gasPrice } = useWeb3();
    const { handleTransaction } = useTransactionContext();
    // const [bridge, setBridge] = useState<Bridge | null>(null);
    const [bridgeableBalances, setBridgeableBalances] = useState<BridgeableBalances>({});
    const [bridgeModalIsOpen, setBridgeModalIsOpen] = useState(false);

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

    const bridgeEth = (amount: BigNumber) => {
        if (!handleTransaction) {
            console.error('Failed to bridge ETH: handleTransaction is unavailable');
            return;
        }
        if (!account) {
            console.error('Failed to bridge ETH: account is unavailable');
        }
        if (!fromNetwork.isLayer2 && contracts.INBOX) {
            // we are on layer 1, deposit into layer 2
            handleTransaction(contracts.INBOX.depositEth, ['0', { value: ethers.utils.parseEther(amount.toFixed()) }]);
        } else if (fromNetwork.isLayer2 && contracts.ARBSYS) {
            // we are on layer 2, withdraw back to layer 1
            if (!account) {
                console.error('Failed to withdraw ETH from L2: account unavailable');
            }
            handleTransaction(contracts.ARBSYS.withdrawEth, [
                account,
                { value: ethers.utils.parseEther(amount.toFixed()) },
            ]);
        } else {
            console.error('Failed to bridge token: inbox contract or transaction handler undefined');
        }
    };

    // takes the token address and an amount to deposit
    // wrote these two to be not be hard fixed to USDC
    const bridgeToken = (tokenAddress: string, amount: BigNumber) => {
        if (!handleTransaction) {
            console.error('Failed to bridge ETH, handleTransaction is unavailable');
            return;
        }
        if (!account) {
            console.error('Failed to bridge ETH: account is unavailable');
            return;
        }
        const bridgeableToken = bridgeableTokenList.find((token) => token.address === tokenAddress);
        if (!bridgeableToken) {
            console.error(`Failed to bridge ETH: bridgeable token not found with address ${tokenAddress}`);
            return;
        }
        if (!gasPrice) {
            console.error(`Failed to bridge ETH: cannot determine gas price`);
            return;
        }
        if (!fromNetwork.isLayer2 && contracts.GATEWAY_ROUTER) {
            // we are on layer 1, deposit into layer 2

            console.log('GAS PRICE', gasPrice);

            handleTransaction(contracts.GATEWAY_ROUTER.outboundTransfer, [
                tokenAddress,
                account,
                ethers.utils.parseUnits(amount.toFixed(), bridgeableToken.decimals),
                '100000000000000',
                '10000',
                // ethers.utils.parseEther(gasPrice.toString()).mul(1000),
                // ethers.utils.parseEther(gasPrice.toString()).mul(10),
                [],
            ]);
        } else if (fromNetwork.isLayer2 && contracts.ARBSYS) {
            // we are on layer 2, withdraw back to layer 1
            if (!account) {
                console.error('Failed to withdraw ETH from L2: account unavailable');
            }
            handleTransaction(contracts.ARBSYS.withdrawEth, [
                account,
                { value: ethers.utils.parseEther(amount.toFixed()) },
            ]);
        } else {
            console.error('Failed to bridge token: inbox contract or handleTransaction unavailable');
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
        const newBridgeableBalances = Object.assign({}, bridgeableBalances);

        if (!provider || !signer) {
            return;
        }
        // ensure the top level (network) entry is initialised

        newBridgeableBalances[network] = newBridgeableBalances[network] || {};
        // if we are bridging a token from L1 -> L2, the spender is the gateway router for the L1 network
        if (!contracts.GATEWAY_ROUTER?.address) {
            console.error('Could not determine gateway router for current network');
            return;
        }

        const signerAddress = await signer.getAddress();

        try {
            if (asset.symbol === bridgeableTickers.ETH) {
                const balance = await provider.getBalance(signerAddress);
                newBridgeableBalances[network][asset.symbol] = {
                    balance: new BigNumber(ethers.utils.formatEther(balance)),
                    allowance: new BigNumber(ethers.utils.formatEther(balance)),
                    spender: '',
                    approved: true,
                };
            } else if (asset.address) {
                const tokenContract = new ethers.Contract(asset.address, ERC20__factory.abi, provider) as ERC20;
                const [balance, allowance, decimals] = await Promise.all([
                    tokenContract.balanceOf(signerAddress),
                    tokenContract.allowance(signerAddress, contracts.GATEWAY_ROUTER.address),
                    tokenContract.decimals(),
                ]);

                newBridgeableBalances[network][asset.symbol] = {
                    balance: new BigNumber(ethers.utils.formatUnits(balance, decimals)),
                    allowance: new BigNumber(ethers.utils.formatUnits(allowance, decimals)),
                    spender: contracts.GATEWAY_ROUTER.address,
                    approved: true,
                };

                console.log('UPDATED BALANCE', newBridgeableBalances[network][asset.symbol]);
            }

            setBridgeableBalances(newBridgeableBalances);
        } catch (error) {
            console.log(error);
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
