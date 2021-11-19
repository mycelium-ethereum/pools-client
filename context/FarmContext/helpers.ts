import { calcTokenPrice } from '@tracer-protocol/pools-js/utils';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
// import { StaticPoolInfo } from '@libs/types/General';
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

    const { shortValueTransfer, longValueTransfer } = poolInfo.getNextValueTransfer();

    const nextLongBalance = poolInfo.longBalance.plus(longValueTransfer);
    const nextShortBalance = poolInfo.shortBalance.plus(shortValueTransfer);

    return tokenAddresses.map((tokenAddress) => {
        const isLong: boolean = tokenAddress.toLowerCase() === poolInfo.longToken.address.toLowerCase();
        const token = isLong ? poolInfo.longToken : poolInfo.shortToken;
        const notional: BigNumber = isLong ? nextLongBalance : nextShortBalance;
        const pendingBurns: BigNumber = isLong
            ? poolInfo.committer.pendingLong.burn
            : poolInfo.committer.pendingShort.burn;

        return calcTokenPrice(notional, token.supply.plus(pendingBurns));
    });
};
