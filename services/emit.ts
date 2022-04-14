import { ethers } from 'ethers';
import { TypedEmitter } from 'tiny-typed-emitter';
import { KnownNetwork } from '@tracer-protocol/pools-js';

interface Web3Events {
    PROVIDER_CHANGED: (provider: ethers.providers.JsonRpcProvider | undefined) => void;
    NETWORK_CHANGED: (network: KnownNetwork | undefined) => void;
}

export type Web3Emitter = TypedEmitter<Web3Events>;
export const web3Emitter = new TypedEmitter<Web3Events>();
