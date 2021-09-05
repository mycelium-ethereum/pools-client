import React, { useState } from 'react';
import { ArbitrumBridgeModal } from './Modal';

// ArbitrumBridge
export default (() => {
    const [isOpen, setOpen] = useState(false);

    // TODO: Replace these with actual values & bridging functions
    const ETHBalance = 3.14159;
    const USDCBalance = 4000;

    const onBridgeETH = (amount: number) => {
        console.log(`Bridging ${amount} ETH...`);
        return new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 1000));
    };

    const onBridgeUSDC = (amount: number) => {
        console.log(`Bridging ${amount} USDC...`);
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
            />
        </>
    );
}) as React.FC;
