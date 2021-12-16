import { useArbitrumBridge } from '@context/ArbitrumBridgeContext';
import React, { useCallback } from 'react';
import type { BigNumber } from 'bignumber.js';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { MultiBridge } from './MultiBridge';
import { switchNetworks } from '@libs/utils/rpcMethods';
import { Network } from '@context/Web3Context/Web3Context.Config';
import { BridgeableAsset } from '@libs/types/General';
import { bridgeableTickers } from '@libs/utils/bridge';

// ArbitrumBridge
export const ArbitrumBridge: React.FC = (() => {
    const { provider, account } = useWeb3();
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

    const onSwitchNetwork = useCallback(
        (networkId: Network['id'], callback?: () => void) => {
            switchNetworks(provider, networkId).finally(() => callback?.());
        },
        [provider],
    );

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
