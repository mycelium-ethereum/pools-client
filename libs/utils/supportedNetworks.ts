import { AvailableNetwork } from '@context/Web3Context/Web3Context.Config';
import { ARBITRUM, ARBITRUM_RINKEBY, MAINNET, RINKEBY } from '@libs/constants';

export const isSupportedNetwork = (networkId?: AvailableNetwork): boolean => {
    const networkIdString = networkId?.toString();

    return networkIdString === ARBITRUM || networkIdString === ARBITRUM_RINKEBY;
};

const supportedBridgeNetworks = [ARBITRUM, ARBITRUM_RINKEBY, MAINNET, RINKEBY];

export const isSupportedBridgeNetwork = (networkId?: AvailableNetwork): boolean => {
    const networkIdString = networkId?.toString();

    return supportedBridgeNetworks.includes(networkIdString ?? '');
};
