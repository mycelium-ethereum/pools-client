import React, { useContext, useState, useEffect, useMemo } from 'react';
// import { Bridge } from 'arb-ts';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
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
import { ARBITRUM, MAINNET } from '@libs/constants';

type Contracts = {
    INBOX: ethers.Contract | null;
};

interface ArbitrumBridgeProps {
    bridgeToken: (tokenAddress: string, amount: BigNumber) => void;
    bridgeEth: (amount: BigNumber) => void;
    approve: (tokenAddress: string) => void;
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
    approve: (tokenAddress: string) => console.debug(`arbitrumBridge.approve not ready`, tokenAddress),
    refreshBridgeableBalance: async (asset: BridgeableAsset) =>
        console.debug(`arbitrumBridge.refreshBridgeableBalance not ready`, asset),
    fromNetwork: networkConfig[MAINNET],
    toNetwork: networkConfig[ARBITRUM],
    bridgeableTokenList: [],
    bridgeableAssetList: [],
    bridgeableBalances: {},
    contracts: { INBOX: null },
    showBridgeModal: () => console.debug('arbitrumBridge.showBridgeModal not ready'),
    hideBridgeModal: () => console.debug('arbitrumBridge.hideBridgeModal not ready'),
    bridgeModalIsOpen: false,
});

export const ArbitrumBridgeStore: React.FC = ({ children }: Children) => {
    const { signer, provider, network = 1 } = useWeb3();
    const { handleTransaction } = useTransactionContext();
    // const [bridge, setBridge] = useState<Bridge | null>(null);
    const [bridgeableBalances, setBridgeableBalances] = useState<BridgeableBalances>({});
    const [bridgeModalIsOpen, setBridgeModalIsOpen] = useState(false);

    const fromNetwork = useMemo(() => networkConfig[network], [network]);
    const toNetwork = useMemo(() => networkConfig[destinationNetworkLookup[network]], [network]);

    useEffect(() => {
        console.log(`bridgeModalIsOpen changed to `, bridgeModalIsOpen);
    }, [bridgeModalIsOpen]);

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
                ticker: bridgeableTickers.ETH,
                address: null,
            },
        ];
    }, [bridgeableTokenList]);

    const contracts: Contracts = useMemo(() => {
        if (!arbitrumContracts[network]) {
            return {
                INBOX: null,
            };
        }

        return {
            INBOX: new ethers.Contract(
                arbitrumContracts[network].INBOX.address,
                arbitrumContracts[network].INBOX.abi,
                signer,
            ),
        };
    }, [network, signer]);

    const bridgeEth = (amount: BigNumber) => {
        // getBridge();
        if (contracts.INBOX && handleTransaction) {
            handleTransaction(contracts.INBOX.depositEth, ['0', { value: ethers.utils.parseEther(amount.toFixed()) }]);
        } else {
            console.error('Failed to bridge token: inbox contract or transaction handler undefined');
        }
    };

    // takes the token address and an amount to deposit
    // wrote these two to be not be hard fixed to USDC
    const bridgeToken = (tokenAddress: string, amount: BigNumber) => {
        console.log(`arbitrumBridge.bridgeToken unimplemented`, tokenAddress, amount);
    };

    const refreshBridgeableBalance = async (asset: BridgeableAsset): Promise<void> => {
        console.log('refreshing balance', asset);

        const newBridgeableBalances = Object.assign({}, bridgeableBalances);

        if (!provider || !signer) {
            return;
        }
        // ensure the top level (network) entry is initialised

        newBridgeableBalances[network] = newBridgeableBalances[network] || {};

        const signerAddress = await signer.getAddress();

        console.log('getting balance for address', signerAddress);

        try {
            if (asset.ticker === bridgeableTickers.ETH) {
                const balance = await provider.getBalance(signerAddress);
                newBridgeableBalances[network][asset.ticker] = {
                    balance: new BigNumber(ethers.utils.formatEther(balance)),
                    approved: true,
                };
            } else if (asset.address) {
                const tokenContract = new ethers.Contract(asset.address, ERC20__factory.abi, provider) as ERC20;
                const [balance, decimals] = await Promise.all([
                    tokenContract.balanceOf(signerAddress),
                    tokenContract.decimals(),
                ]);
                console.log('TOKEN BALANCE', balance.toString());
                newBridgeableBalances[network][asset.ticker] = {
                    balance: new BigNumber(ethers.utils.formatUnits(balance, decimals)),
                    approved: true,
                };
            }

            console.log('GOT NEW BRIDGEABLE BALANCES', newBridgeableBalances);

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
                approve: (tokenAddress: string) => console.log('approving', tokenAddress),
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
