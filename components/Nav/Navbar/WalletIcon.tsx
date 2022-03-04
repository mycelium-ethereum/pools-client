import React from 'react';
import styled from 'styled-components';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import Identicon from './Identicon';

const WalletIconImage = styled.img`
    display: inline;
    height: 20px;
    margin: auto 0;
    font-size: 1.125rem; /* 18px */
    line-height: 1.75rem; /* 28px */
`;

const WalletIcon: React.FC = () => {
    const { wallet, account } = useWeb3();

    if (wallet?.icons?.iconSrc) {
        return <WalletIconImage src={wallet?.icons.iconSrc} alt={wallet?.name ?? ''} />;
    } else {
        return <Identicon account={account ?? ''} />;
    }
};

export default WalletIcon;
