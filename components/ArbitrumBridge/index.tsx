import { useArbitrumBridge } from '@context/ArbitrumBridgeContext';
import React, { useCallback } from 'react';
import type { BigNumber } from 'bignumber.js';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { MultiBridge } from './MultiBridge';
// import { SwapOutlined } from '@ant-design/icons';
import { switchNetworks } from '@libs/utils/rpcMethods';
import { Network } from '@context/Web3Context/Web3Context.Config';
import { BridgeableAsset } from '@libs/types/General';
import { bridgeableTickers } from '@libs/utils/bridge';

// mainnet
// const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

// rinkeby
const USDC_ADDRESS = '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b';

// ArbitrumBridge
export const ArbitrumBridge: React.FC = (() => {
    const { provider } = useWeb3();
    const {
        bridgeToken,
        bridgeEth,
        approve,
        refreshBridgeableBalance,
        fromNetwork,
        toNetwork,
        bridgeableAssetList,
        bridgeableBalances,
        hideBridgeModal,
        bridgeModalIsOpen,
    } = useArbitrumBridge();

    console.log('BRIDGE MODAL IS OPEN', bridgeModalIsOpen);

    const onBridgeAsset = async (asset: BridgeableAsset, amount: BigNumber) => {
        if (asset.ticker === bridgeableTickers.ETH) {
            return bridgeEth(amount);
        }
        // this type cast is safe because
        // ETH is the only asset with a null address
        return bridgeToken(asset.address as string, amount);
    };

    const onApproveUSDC = () => {
        console.log(`Approving USDC...`);
        approve(USDC_ADDRESS);
        return new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 1000));
    };

    const onSwitchNetwork = useCallback(
        (networkId: Network['id']) => {
            switchNetworks(provider, networkId);
        },
        [provider],
    );

    return (
        <MultiBridge
            show={bridgeModalIsOpen}
            onClose={hideBridgeModal}
            fromNetwork={fromNetwork}
            toNetwork={toNetwork}
            bridgeableAssetList={bridgeableAssetList}
            bridgeableBalances={bridgeableBalances}
            refreshBridgeableBalance={refreshBridgeableBalance}
            onSwitchNetwork={onSwitchNetwork}
            onBridgeAsset={onBridgeAsset}
            onApproveToken={onApproveUSDC}
        />
    );
}) as React.FC;
