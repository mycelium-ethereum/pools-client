import { StoreNetwork, StoreAccount } from './types';
import { useStore } from '.';

export const onNetworkChange = (network: StoreNetwork, oldNetwork: StoreNetwork): void => {
    console.debug(`Store network changed from ${oldNetwork} to ${network}`);
    if (network) {
        useStore.getState().poolsSlice.fetchPoolLists(network);
    }
};

export const onAccountChange = (account: StoreAccount, oldAccount: StoreAccount): void => {
    console.debug(`Store account changed from ${oldAccount} to ${account}`);
    useStore.getState().ensSlice.checkENSName(account);
};
