import { ethers } from 'ethers';

export interface IGasSlice {
    gasPrice: number;
    fetchingGasPrice: boolean;
    getGasPrice: (provider: ethers.providers.JsonRpcProvider) => void;
}
