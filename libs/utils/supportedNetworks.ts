import { KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';

export const isSupportedNetwork = (networkId?: KnownNetwork): boolean => {
    const networkIdString = networkId?.toString();

    return networkIdString === NETWORKS.ARBITRUM || networkIdString === NETWORKS.ARBITRUM_RINKEBY;
};

const supportedBridgeNetworks: string[] = [
    NETWORKS.ARBITRUM,
    NETWORKS.ARBITRUM_RINKEBY,
    NETWORKS.MAINNET,
    NETWORKS.RINKEBY,
];

export const isSupportedBridgeNetwork = (networkId?: KnownNetwork): boolean => {
    const networkIdString = networkId?.toString();

    return supportedBridgeNetworks.includes(networkIdString ?? '');
};
