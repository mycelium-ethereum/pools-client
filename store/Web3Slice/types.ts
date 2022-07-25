import { ethers } from 'ethers';
import { providers } from '@0xsequence/multicall';
import { API as OnboardApi, Wallet } from '@tracer-protocol/onboard/dist/src/interfaces';
import { KnownNetwork } from '@tracer-protocol/pools-js';

export interface IWeb3Slice {
    onboard: OnboardApi;
    isReady: boolean;
    account: string | undefined;
    network: KnownNetwork | undefined;
    provider: ethers.providers.JsonRpcProvider | undefined;
    wallet: Wallet | undefined;
    multicallProvider: providers.MulticallProvider | undefined;

    defaultProvider: ethers.providers.WebSocketProvider | undefined;
    setDefaultProvider: () => Promise<void>;

    checkIsReady: () => Promise<boolean>;
    resetOnboard: () => Promise<void>;
    handleConnect: () => Promise<void>;
}
