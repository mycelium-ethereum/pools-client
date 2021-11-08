import { initPool, fetchCommits } from '@context/PoolContext/helpers';
import { calcNextValueTransfer, calcTokenPrice } from '@tracer-protocol/tracer-pools-utils';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { StaticPoolInfo } from '@libs/types/General';
import { DEFAULT_POOLSTATE } from '@libs/constants/pool';

export const fetchTokenPrice: (
    poolInfo: StaticPoolInfo,
    tokenAddresses: [string] | [string, string],
    provider: ethers.providers.JsonRpcProvider | undefined,
) => Promise<BigNumber[]> = async (poolInfo_, tokenAddresses, provider) => {
    if (!provider || !poolInfo_) {
        return [new BigNumber(1)];
    }

    const poolInfo = await initPool(poolInfo_, provider);

    const { shortValueTransfer, longValueTransfer } = calcNextValueTransfer(
        poolInfo.lastPrice,
        poolInfo.oraclePrice,
        new BigNumber(poolInfo.leverage),
        poolInfo.longBalance,
        poolInfo.shortBalance,
    );

    const nextLongBalance = poolInfo.longBalance.plus(longValueTransfer);
    const nextShortBalance = poolInfo.shortBalance.plus(shortValueTransfer);
    const committerInfo = await fetchCommits(
        {
            committer: poolInfo.committer.address,
            address: poolInfo.address,
            lastUpdate: poolInfo.lastUpdate.toNumber(),
            quoteTokenDecimals: poolInfo.quoteToken.decimals,
        },
        provider,
    ).catch((err) => {
        console.error('Failed to fetchCommits', err);
        const { pendingLong, pendingShort, allUnexecutedCommits } = DEFAULT_POOLSTATE.committer;
        return {
            pendingLong,
            pendingShort,
            allUnexecutedCommits,
        };
    });

    return tokenAddresses.map((tokenAddress) => {
        const isLong: boolean = tokenAddress.toLowerCase() === poolInfo.longToken.address.toLowerCase();
        const token = isLong ? poolInfo.longToken : poolInfo.shortToken;
        const notional: BigNumber = isLong ? nextLongBalance : nextShortBalance;
        const pendingBurns: BigNumber = isLong ? committerInfo.pendingLong.burn : committerInfo.pendingShort.burn;

        return calcTokenPrice(notional, token.supply.plus(pendingBurns));
    });
};
