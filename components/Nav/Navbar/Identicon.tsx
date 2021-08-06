import React from 'react';
// @ts-ignore
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

const Identicon: React.FC<{ account: string }> = ({ account }: { account: string }) => {
    return account ? <Jazzicon diameter={20} seed={jsNumberForAddress(account)} /> : null;
};

export default Identicon;
