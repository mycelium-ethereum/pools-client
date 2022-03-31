import React, { useCallback } from 'react';
import type { BigNumber } from 'bignumber.js';

import { bridgeableTickers } from '~/constants/bridge';
import { useArbitrumBridge } from '~/context/ArbitrumBridgeContext';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';
import { BridgeableAsset } from '~/types/bridge';
import { Network } from '~/types/networks';
import { switchNetworks } from '~/utils/rpcMethods';

import { MultiBridge } from './MultiBridge';

// ArbitrumBridge
export const ArbitrumBridge: React.FC = (() => {
    const { provider, account } = useStore(selectWeb3Info);
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
