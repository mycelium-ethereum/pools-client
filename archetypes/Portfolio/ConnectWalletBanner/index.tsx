import React from 'react';
import * as Styles from './styles';

type CWBProps = {
    handleConnect: () => void;
};

export const ConnectWalletBanner: React.FC<CWBProps> = ({ handleConnect }) => (
    <Styles.Container style={{ width: '100%' }}>
        <Styles.Background />
        <Styles.Wrapper>
            <Styles.Title>Connect to Arbitrum to burn your Pools Tokens</Styles.Title>
            <Styles.Button onClick={handleConnect}>Connect Wallet</Styles.Button>
        </Styles.Wrapper>
    </Styles.Container>
);
