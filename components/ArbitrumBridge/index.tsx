import React, { useState } from 'react';
import { ArbitrumBridgeModal } from './Modal';
import styled from 'styled-components';
import { Button } from '@components/General';

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
            <StyledButton onClick={() => setOpen(true)}>Arbitrum Bridge</StyledButton>
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

const StyledButton = styled(Button)`
    margin: 1rem auto;
    color: #3da8f5;
    border: 1px solid #3da8f5;

    &:hover {
        color: #fff;
        background: #3da8f5;
    }
`;
