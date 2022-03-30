import React from 'react';
import * as Styles from './styles';

type Props = {
    onClick: () => void;
};

export const ConnectWalletBanner: React.FC<Props> = ({ onClick }) => (
    <Styles.Container>
        <Styles.Background />
        <Styles.Wrapper>
            <Styles.Title>Connect to Arbitrum to get started with Perpetual Pools</Styles.Title>
            <Styles.Button onClick={onClick}>Connect Wallet</Styles.Button>
        </Styles.Wrapper>
    </Styles.Container>
);
