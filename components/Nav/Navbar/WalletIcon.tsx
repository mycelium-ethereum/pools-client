import React from 'react';
import styled from 'styled-components';
import shallow from 'zustand/shallow';
import { useStore } from '~/store/main';
import { fontSize } from '~/store/ThemeSlice/themes';
import { selectWalletInfo } from '~/store/Web3Slice';
import Identicon from './Identicon';

const WalletIconImage = styled.img`
    display: inline;
    height: 20px;
    margin: auto 0;
    font-size: ${fontSize.lg};
    line-height: 1.75rem; /* 28px */
`;

const WalletIcon: React.FC = () => {
    const { wallet, account } = useStore(selectWalletInfo, shallow);

    if (wallet?.icons?.iconSrc) {
        return <WalletIconImage src={wallet?.icons.iconSrc} alt={wallet?.name ?? ''} />;
    } else {
        return <Identicon account={account ?? ''} />;
    }
};

export default WalletIcon;
