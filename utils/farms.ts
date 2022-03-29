import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import Pool, { StaticPoolInfo } from '@tracer-protocol/pools-js/entities/pool';

export const fetchTokenPrice: (
    poolInfo: StaticPoolInfo,
    tokenAddresses: [string] | [string, string],
    provider: ethers.providers.JsonRpcProvider | undefined,
) => Promise<BigNumber[]> = async (poolInfo_, tokenAddresses, provider) => {
    if (!provider || !poolInfo_) {
        return [new BigNumber(1)];
    }

    const poolInfo = await Pool.Create({
        ...poolInfo_,
        provider,
    });

    return tokenAddresses.map((tokenAddress) => {
        const isLong: boolean = tokenAddress.toLowerCase() === poolInfo.longToken.address.toLowerCase();
        return isLong ? poolInfo.getNextLongTokenPrice() : poolInfo.getNextShortTokenPrice();
    });
};
