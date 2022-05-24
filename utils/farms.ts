import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import Pool, { StaticPoolInfo } from '@tracer-protocol/pools-js/entities/pool';

export const fetchTokenPrice: (
    poolInfo: StaticPoolInfo,
    tokenAddress: string,
    provider: ethers.providers.JsonRpcProvider | undefined,
) => Promise<BigNumber> = async (poolInfo_, tokenAddress, provider) => {
    if (!provider || !poolInfo_) {
        return new BigNumber(1);
    }

    try {
        const poolInfo = await Pool.Create({
            ...poolInfo_,
            provider,
        });

        const isLong: boolean = tokenAddress.toLowerCase() === poolInfo.longToken.address.toLowerCase();
        return isLong ? poolInfo.getNextLongTokenPrice() : poolInfo.getNextShortTokenPrice();
    } catch (err) {
        console.error('Failed to fetch farm token prices');
        return new BigNumber(1);
    }
};
