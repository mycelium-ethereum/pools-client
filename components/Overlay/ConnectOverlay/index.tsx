import React, { FC } from 'react';
import styled from 'styled-components';
import Overlay from '@components/Overlay';
import { useWeb3 } from '@context/Web3Context/Web3Context';

const ConnectOverlay: FC = () => {
    const { handleConnect } = useWeb3();
    return (
        <StyledOverlay>
            No wallet connected.
            <ConnectButton onClick={() => handleConnect()}>Connect Wallet</ConnectButton>
        </StyledOverlay>
    );
};

const StyledOverlay = styled(Overlay)`
    font-size: var(--font-size-medium);
    background-color: var(--color-background-secondary);
`;

const ConnectButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: var(--font-size-small);
    border: 2px solid #fff;
    border-radius: 100px;
    width: 160px;
    height: 40px;
    transition: 0.2s;
    padding: 0 10px;
    margin-top: 10px;

    &:focus {
        outline: none;
    }

    &:hover {
        background: var(--color-primary);
    }
`;

export default ConnectOverlay;
