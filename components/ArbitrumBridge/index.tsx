import useBridge from '@libs/hooks/useBridge';
import React, { useState } from 'react';
import { ArbitrumBridgeModal } from './Modal';


// mainnet
// const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' 

// rinkeby
const USDC_ADDRESS = '0x7d66cde53cc0a169cae32712fc48934e610aef14' 

// ArbitrumBridge
export default (() => {
    const [isOpen, setOpen] = useState(false);
    const { bridgeToken, bridgeEth, approve } = useBridge();

    // TODO: Replace these with actual values & bridging functions
    const ETHBalance = 3.14159;
    const USDCBalance = 4000;

    const onBridgeETH = (amount: number) => {
        console.log(`Bridging ${amount} ETH...`);
        bridgeEth(amount);
        return new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 1000));
    };

    const onBridgeUSDC = (amount: number) => {
        console.log(`Bridging ${amount} USDC...`);
        bridgeToken(USDC_ADDRESS, amount)
        return new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 1000));
    };

    const onApproveUSDC = () => {
        console.log(`Approving USDC...`);
        approve(USDC_ADDRESS)
        return new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 1000));
    };

    return (
        <>
            <button className="text-white underline" onClick={() => setOpen(true)}>
                Bridge
            </button>
            <ArbitrumBridgeModal
                isOpen={isOpen}
                onClose={() => setOpen(false)}
                ETHBalance={ETHBalance}
                USDCBalance={USDCBalance}
                onBridgeETH={onBridgeETH}
                onBridgeUSDC={onBridgeUSDC}
                onApproveUSDC={onApproveUSDC}
            />
        </>
    );
}) as React.FC;
