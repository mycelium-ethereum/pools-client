import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { LeveragedPool__factory, ERC20__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
import { StaticPoolInfo } from '@tracer-protocol/pools-js/entities/pool';

export const fetchPPTokenPrice: (
    poolInfo: StaticPoolInfo,
    tokenAddress: string,
    provider: ethers.providers.JsonRpcProvider | undefined,
) => Promise<BigNumber> = async (poolInfo, tokenAddress, provider) => {
    if (!provider || !poolInfo) {
        return new BigNumber(1);
    }

    try {
        const leveragedPool = LeveragedPool__factory.connect(poolInfo.address, provider);
        const token = ERC20__factory.connect(tokenAddress, provider);

        if (!poolInfo.longToken || !poolInfo.shortToken) {
            return new BigNumber(1);
        }

        const isLong: boolean = tokenAddress.toLowerCase() === poolInfo.longToken.address.toLowerCase();

        const [sideBalance, tokenSupply] = await Promise.all([
            isLong ? leveragedPool.longBalance() : leveragedPool.shortBalance(),
            token.totalSupply(),
        ]);

        // catch div by 0
        if (tokenSupply.eq(0)) {
            return new BigNumber(1);
        }

        return new BigNumber(sideBalance.toString()).div(tokenSupply.toString());
    } catch (err) {
        console.error('Failed to fetch PP token price');
        return new BigNumber(1);
    }
};
