import React from 'react';
import * as Styles from './styles';

type CWBProps = {
    handleConnect: () => void;
};

export const ConnectWalletBanner: React.FC<CWBProps> = ({ handleConnect }) => (
    <Styles.Container>
        <Styles.Background />
        <Styles.Wrapper>
            <Styles.Title>Connect to Arbitrum to get started with Perpetual Pools</Styles.Title>
            <Styles.Button onClick={handleConnect}>Connect Wallet</Styles.Button>
        </Styles.Wrapper>
    </Styles.Container>
);
