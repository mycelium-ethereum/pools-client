import { AvailableNetwork } from '@context/Web3Context/Web3Context.Config';
import { ARBITRUM, ARBITRUM_RINKEBY } from '@libs/constants';

export const isSupportedNetwork = (networkId?: AvailableNetwork): boolean => {
    const networkIdString = networkId?.toString();

    return networkIdString === ARBITRUM || networkIdString === ARBITRUM_RINKEBY;
};
