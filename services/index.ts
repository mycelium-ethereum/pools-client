import { ethers } from 'ethers';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { tracerAPIService } from './TracerAPIService';
import { web3Service } from './Web3Service';

export class BaseService {
    providerUpdate(provider: ethers.providers.JsonRpcProvider | undefined): void {
        tracerAPIService.setProvider(provider);
        web3Service.setProvider(provider);
    }
    networkUpdate(network: KnownNetwork | undefined): void {
        tracerAPIService.setNetwork(network);
        web3Service.setNetwork(network);
    }
}

export const baseService = new BaseService();
