import { initPool, fetchCommits } from '@context/PoolContext/helpers';
import { calcNextValueTransfer, calcTokenPrice } from '@libs/utils/calcs';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

export const fetchTokenPrice: (
    pool: string,
    tokenAddresses: [string] | [string, string],
    provider: ethers.providers.JsonRpcProvider | undefined,
) => Promise<BigNumber[]> = async (pool, tokenAddresses, provider) => {
    if (!provider) {
        return [new BigNumber(1)];
    }

    const poolInfo = await initPool(
        {
            name: '',
            address: pool,
        },
        provider,
    );

    const { shortValueTransfer, longValueTransfer } = calcNextValueTransfer(
        poolInfo.lastPrice,
        poolInfo.oraclePrice,
        new BigNumber(poolInfo.leverage),
        poolInfo.longBalance,
        poolInfo.shortBalance,
    );

    const nextLongBalance = poolInfo.longBalance.plus(longValueTransfer);
    const nextShortBalance = poolInfo.shortBalance.plus(shortValueTransfer);
    const committerInfo = await fetchCommits(poolInfo.committer.address, provider, poolInfo.quoteToken.decimals);

    return tokenAddresses.map((tokenAddress) => {
        const isLong =
            tokenAddress === poolInfo.longToken.address ? poolInfo.longToken.address : poolInfo.shortToken.address;
        const token = isLong ? poolInfo.longToken : poolInfo.shortToken;
        const notional: BigNumber = isLong ? nextLongBalance : nextShortBalance;
        const pendingBurns: BigNumber = isLong ? committerInfo.pendingLong.burn : committerInfo.pendingShort.burn;

        return calcTokenPrice(notional, token.supply.plus(pendingBurns));
    });
};
