import { useState, useEffect, useMemo } from 'react';
import { Bridge } from 'arb-ts';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { useArbTokenBridge } from 'token-bridge-sdk';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { ERC20__factory, ERC20 } from '@tracer-protocol/perpetual-pools-contracts/types';
import { useTransactionContext } from '@context/TransactionContext';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';
import { destinationNetworkLookup, bridgeableTokens, bridgeableTickers, arbitrumContracts } from '@libs/utils';
import { BridgeableAsset, BridgeableBalance, BridgeableBalances, BridgeProviders } from '@libs/types/General';
import { BridgeAction } from '@components/ArbitrumBridge/state';
import { MAINNET, RINKEBY, ARBITRUM_ONE, ARBITRUM_RINKEBY } from '@libs/constants';
// import { useArbTokenBridge } from "token-bridge-sdk";

export default () => {
    const { signer, provider, network = 1 } = useWeb3();
    const { handleTransaction } = useTransactionContext();
    const [bridge, setBridge] = useState<Bridge | null>(null);
    const [bridgeableBalances, setBridgeableBalances] = useState<BridgeableBalances>({});
    const [bridgeProviders, setBridgeProviders] = useState<BridgeProviders>({});

    const fromNetwork = useMemo(() => networkConfig[network], [network]);
    const toNetwork = useMemo(() => networkConfig[destinationNetworkLookup[network]], [network]);

    // useEffect(() => {
    //     const getBridge = async () => {
    //         console.debug('Connecting arbitrum bridge');
    //         // can either be connected to eth bridging to arb or connected to arb bridging to eth
    //         const l1Provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_L1_RPC);
    //         const l2Provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_L2_RPC);

    //         console.log('GETTING BRIDGE, SIGNER: ', signer);

    //         if (signer) {
    //             let bridge;
    //             if (network === parseInt(ARBITRUM_RINKEBY)) {
    //                 console.debug('Bridging Arbitrum to Mainnet');
    //                 const l1Signer = signer?.connect(l1Provider);
    //                 bridge = await Bridge.init(l1Signer, signer);
    //             } else {
    //                 console.debug('Bridging Mainnet to Arbitrum');
    //                 const l2Signer = signer?.connect(l2Provider);
    //                 bridge = await Bridge.init(signer, l2Signer);
    //             }

    //             // I assume this is how to get approved
    //             console.log(
    //                 await bridge.getAndUpdateL1TokenData('0x7d66cde53cc0a169cae32712fc48934e610aef14'),
    //                 'bridge',
    //             );

    //             setBridge(bridge);
    //         } else {
    //             console.error('Signer can not be undefined');
    //         }
    //     };
    //     getBridge();
    // }, []);

    const getBridge = async (): Promise<Bridge | null> => {
        console.log('getting bridge');
        if (!fromNetwork || !toNetwork || !bridgeProviders[fromNetwork.id] || !bridgeProviders[toNetwork.id]) {
            console.log('BRIDGE PROVIDERS NOT SET');
            return null;
        }

        console.log('from network', fromNetwork, ethers.providers.getNetwork(fromNetwork.id));
        console.log('to network', toNetwork, ethers.providers.getNetwork(toNetwork.id));

        const l1Network = fromNetwork.id === MAINNET || fromNetwork.id === RINKEBY ? fromNetwork : toNetwork;

        const l2Network = fromNetwork.id === MAINNET || fromNetwork.id === RINKEBY ? toNetwork : fromNetwork;

        const l1Provider = bridgeProviders[l1Network.id];
        const l2Provider = bridgeProviders[l2Network.id];

        const bridge = await Bridge.init(
            l1Provider.getSigner(0),
            l2Provider.getSigner(0),
            arbitrumContracts[l1Network.id].l1GatewayRouterAddress,
            arbitrumContracts[l2Network.id].l1GatewayRouterAddress,
        );

        console.log('got bridge', bridge);

        return bridge;
    };

    const approve = (token: string) => {
        if (bridge && handleTransaction) {
            handleTransaction(bridge.approveToken, [token]);
        }
    };

    const bridgeableTokenList = useMemo(() => bridgeableTokens[network], [network]);

    const bridgeableAssetList: BridgeableAsset[] = useMemo(() => {
        if (!toNetwork) {
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

    const contracts = useMemo(() => {
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
        getBridge();
        if (contracts.INBOX && handleTransaction) {
            handleTransaction(contracts.INBOX.depositEth, ['0', { value: ethers.utils.parseEther(amount.toFixed()) }]);
        } else {
            console.error('Failed to bridge token: inbox contract or transaction handler undefined');
        }
    };

    // takes the token address and an amount to deposit
    // wrote these two to be not be hard fixed to USDC
    const bridgeToken = (tokenAddress: string, amount: BigNumber) => {
        if (contracts.INBOX && handleTransaction) {
            handleTransaction(contracts.INBOX.depositEth, ['0', { value: ethers.utils.parseEther(amount.toFixed()) }]);
        } else {
            console.error('Failed to bridge token: inbox contract or transaction handler undefined');
        }
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

    useEffect(() => {
        console.log('provider changed', provider);
        const _provider = new ethers.providers.JsonRpcProvider('metamask', network);
        setBridgeProviders((oldValue) => ({ ...oldValue, [network]: _provider }));
    }, [network]);

    useEffect(() => {
        console.log('updated bridgeProviders', bridgeProviders);
    }, [bridgeProviders]);

    // const refreshBridgeableBalance = async (asset: BridgeableAsset): Promise<void> => {
    //     console.log('refreshing balance', asset);

    //     const newBridgeableBalances = Object.assign({}, bridgeableBalances);

    //     if (!provider || !signer) {
    //         return;
    //     }
    //     // ensure the top level (network) entry is initialised

    //     newBridgeableBalances[network] = newBridgeableBalances[network] || {};

    //     const signerAddress = await signer.getAddress();

    //     console.log('getting balance for address', signerAddress);

    //     try {
    //         if (asset.ticker === bridgeableTickers.ETH) {
    //             const balance = await provider.getBalance(signerAddress);
    //             newBridgeableBalances[network][asset.ticker] = {
    //                 balance: new BigNumber(ethers.utils.formatEther(balance)),
    //                 approved: true,
    //             };
    //         } else if (asset.address) {
    //             const tokenContract = new ethers.Contract(asset.address, ERC20__factory.abi, provider) as ERC20;
    //             const [balance, decimals] = await Promise.all([
    //                 tokenContract.balanceOf(signerAddress),
    //                 tokenContract.decimals(),
    //             ]);
    //             console.log('TOKEN BALANCE', balance.toString());
    //             newBridgeableBalances[network][asset.ticker] = {
    //                 balance: new BigNumber(ethers.utils.formatUnits(balance, decimals)),
    //                 approved: true,
    //             };
    //         }

    //         console.log('GOT NEW BRIDGEABLE BALANCES', newBridgeableBalances);

    //         setBridgeableBalances(newBridgeableBalances);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    return {
        bridgeToken,
        bridgeEth,
        approve,
        refreshBridgeableBalance,
        fromNetwork,
        toNetwork,
        bridgeableTokenList,
        bridgeableAssetList,
        bridgeableBalances,
        contracts,
    };
};
