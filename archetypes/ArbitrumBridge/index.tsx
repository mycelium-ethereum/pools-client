import React, { useCallback } from 'react';
import type { BigNumber } from 'bignumber.js';

import shallow from 'zustand/shallow';
import { bridgeableTickers } from '~/constants/bridge';
import { useArbitrumBridge } from '~/context/ArbitrumBridgeContext';
import { web3Service } from '~/services/Web3Service';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';
import { BridgeableAsset } from '~/types/bridge';
import { Network } from '~/types/networks';
import { MultiBridge } from './MultiBridge';

// ArbitrumBridge
export const ArbitrumBridge: React.FC = (() => {
    const { account, provider } = useStore(selectWeb3Info, shallow);
    const {
        bridgeToken,
        bridgeEth,
        approveToken,
        refreshBridgeableBalance,
        fromNetwork,
        toNetwork,
        bridgeableAssets,
        bridgeableBalances,
    } = useArbitrumBridge();

    const onBridgeAsset = (asset: BridgeableAsset, amount: BigNumber, callback: () => void) => {
        if (asset.symbol === bridgeableTickers.ETH) {
            return bridgeEth(amount, callback);
        }
        // this type cast is safe because
        // ETH is the only asset with a null address
        return bridgeToken(asset.address as string, amount, callback);
    };

    const onApproveToken = (tokenAddress: string, spender: string) => approveToken(tokenAddress, spender);

    const onSwitchNetwork = useCallback((networkId: Network['id'], callback?: () => void) => {
        web3Service.switchNetworks(networkId).finally(() => callback?.());
    }, []);

    return (
        <MultiBridge
            fromNetwork={fromNetwork}
            toNetwork={toNetwork}
            bridgeableAssets={bridgeableAssets}
            bridgeableBalances={bridgeableBalances}
            refreshBridgeableBalance={refreshBridgeableBalance}
            onSwitchNetwork={onSwitchNetwork}
            onBridgeAsset={onBridgeAsset}
            onApproveToken={onApproveToken}
            account={account}
            provider={provider}
        />
    );
}) as React.FC;
