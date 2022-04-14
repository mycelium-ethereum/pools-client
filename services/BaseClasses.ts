import { ethers } from 'ethers';
import { KnownNetwork } from '@tracer-protocol/pools-js';

export class Web3Aware {
    network: KnownNetwork | undefined;
    provider: ethers.providers.JsonRpcProvider | undefined;

    setNetwork(network: KnownNetwork | undefined): void {
        this.network = network;
    }
    setProvider(provider: ethers.providers.JsonRpcProvider | undefined): void {
        this.provider = provider;
    }
}
