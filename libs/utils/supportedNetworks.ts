import { ARBITRUM, ARBITRUM_RINKEBY } from '@libs/constants';

export const isSupportedNetwork = (networkId?: number): boolean => {
    const networkIdString = networkId?.toString();

    return networkIdString === ARBITRUM || networkIdString === ARBITRUM_RINKEBY;
};
