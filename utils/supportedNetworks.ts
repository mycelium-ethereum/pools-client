import { KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';

export const isArbitrumNetwork = (networkId: string): boolean =>
    networkId === NETWORKS.ARBITRUM || networkId === NETWORKS.ARBITRUM_RINKEBY;

const supportedNetworks: string[] = [NETWORKS.ARBITRUM, NETWORKS.ARBITRUM_RINKEBY];

// for now this is exactly the same as the function above
export const isSupportedNetwork = (networkId: number | string | undefined): boolean => {
    const networkIdString = networkId?.toString();

    return supportedNetworks.includes(networkIdString ?? '');
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

const knownNetworks: string[] = [NETWORKS.ARBITRUM, NETWORKS.MAINNET, NETWORKS.ARBITRUM_RINKEBY, NETWORKS.RINKEBY];
export const isKnownNetwork = (networkId: string): boolean => knownNetworks.includes(networkId);
