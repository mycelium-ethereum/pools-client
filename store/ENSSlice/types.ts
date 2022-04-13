import { ethers } from 'ethers';

export interface IENSSlice {
    mainnetProvider: ethers.providers.JsonRpcProvider; // always used for ENS
    ensName: string | undefined;
    checkENSName: (account: string | undefined) => void;
}
