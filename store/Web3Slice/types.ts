import { ethers } from 'ethers';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { API as OnboardApi, Wallet } from '@tracer-protocol/onboard/dist/src/interfaces';

export interface IWeb3Slice {
    onboard: OnboardApi;
    isReady: boolean;
    account: string | undefined;
    network: KnownNetwork | undefined;
    provider: ethers.providers.JsonRpcProvider | undefined;
    wallet: Wallet | undefined;

    checkIsReady: () => Promise<boolean>;
    resetOnboard: () => Promise<void>;
    handleConnect: () => Promise<void>;

    // unsupportedNetworkPopupRef: React.MutableRefObject<string>;
}
