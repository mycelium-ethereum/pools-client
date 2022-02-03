import { AvailableNetwork } from '@context/Web3Context/Web3Context.Config';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { poolList, ONE_HOUR } from '@libs/constants/poolLists';
import { StaticPoolInfo } from '@libs/types/General';
import { ARBITRUM } from '@libs/constants';
import { calcSkew, calcTokenPrice } from '@tracer-protocol/tracer-pools-utils';
import { calcEffectiveLongGain, calcEffectiveShortGain, poolMap } from '@tracer-protocol/pools-js';
import { DEFAULT_POOLSTATE } from '@libs/constants/pool';

export type Upkeep = {
    pool: string;
    timestamp: number;
    newPrice: number;
    oldPrice: number;
    tvl: number;
    longTokenBalance: number;
    longTokenSupply: number;
    longTokenEffectiveGain: number;
    shortTokenBalance: number;
    shortTokenSupply: number;
    shortTokenEffectiveGain: number;
    longTokenPrice: number;
    shortTokenPrice: number;
    skew: number;
};

type RawUpkeep = {
    pool_address: string;
    long_token_supply: string;
    short_token_supply: string;
    long_balance: string;
    short_balance: string;
    old_price: string;
    new_price: string;
    network: string;
    block_timestamp: string;
};

const POOLS_API = process.env.NEXT_PUBLIC_POOLS_API;

// const useUpkeeps
export const useUpkeeps: (network: AvailableNetwork | undefined) => Record<string, Upkeep[]> = (network) => {
    const [upkeeps, setUpkeeps] = useState<Record<string, Upkeep[]>>({});

    useEffect(() => {
        let mounted = true;
        const poolInfo: StaticPoolInfo = poolList[(network ?? ARBITRUM) as AvailableNetwork][0];
        const fetchUpkeeps = async () => {
            const now = Math.floor(Date.now() / 1000);
            const from = now - (poolInfo?.updateInterval || ONE_HOUR).times(2).toNumber();

            const rawUpkeeps = await fetch(`${POOLS_API}/upkeeps?network=${network}&from=${from}`)
                .then(async (res) => {
                    const response = await res.json();
                    if (res.ok) {
                        return response;
                    } else {
                        return {
                            message: response?.message ?? 'Unknown error',
                            data: null,
                        };
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch upkeeps', error);
                    return {
                        message: error,
                        data: null,
                    };
                });

            if (rawUpkeeps.message) {
                console.info('Fetched upkeeps', rawUpkeeps.message);
            }
            if (rawUpkeeps.data) {
                if (mounted) {
                    const upkeepMapping: Record<string, Upkeep[]> = {};

                    for (const upkeep of rawUpkeeps.data) {
                        const pool: StaticPoolInfo =
                            // @ts-expect-error
                            poolMap[network ?? ARBITRUM]?.[upkeep.pool_address] ?? DEFAULT_POOLSTATE;
                        if (upkeepMapping[upkeep.pool_address]) {
                            upkeepMapping[upkeep.pool_address].push(
                                parseUpkeep(upkeep, pool.quoteToken.decimals, pool.leverage),
                            );
                        } else {
                            upkeepMapping[upkeep.pool_address] = [
                                parseUpkeep(upkeep, pool.quoteToken.decimals, pool.leverage),
                            ];
                        }
                    }

                    for (const pool of Object.keys(upkeepMapping)) {
                        // array is sorted by newest to oldest such that we can trim the last 2 upkeeps
                        upkeepMapping[pool] = upkeepMapping[pool].sort((a, b) => b.timestamp - a.timestamp);
                    }
                    setUpkeeps(upkeepMapping);
                }
            }
        };

        if (network) {
            fetchUpkeeps();
        }

        return () => {
            mounted = false;
        };
    }, [network]);

    return upkeeps;
};

const parseUpkeep: (upkeep: RawUpkeep, decimals: number, leverage: number) => Upkeep = (upkeep, decimals, leverage) => {
    const longTokenBalance = new BigNumber(ethers.utils.formatUnits(upkeep.long_balance, decimals));

    const shortTokenBalance = new BigNumber(ethers.utils.formatUnits(upkeep.short_balance, decimals));

    const shortTokenSupply = new BigNumber(ethers.utils.formatUnits(upkeep.short_token_supply, decimals));

    const longTokenSupply = new BigNumber(ethers.utils.formatUnits(upkeep.long_token_supply, decimals));

    const longTokenPrice = calcTokenPrice(longTokenBalance, longTokenSupply);
    const shortTokenPrice = calcTokenPrice(shortTokenBalance, shortTokenSupply);
    const leverageBN = new BigNumber(leverage);

    // TODO need to check if decimals effect oldPrice and newPrice or if they come from the oracle in WAD
    return {
        pool: upkeep.pool_address,
        timestamp: parseInt(upkeep.block_timestamp),
        oldPrice: new BigNumber(ethers.utils.formatEther(upkeep.old_price)).toNumber(),
        newPrice: new BigNumber(ethers.utils.formatEther(upkeep.new_price)).toNumber(),
        tvl: longTokenBalance.plus(shortTokenBalance).toNumber(),
        longTokenBalance: longTokenBalance.toNumber(),
        longTokenSupply: longTokenSupply.toNumber(),
        shortTokenBalance: shortTokenBalance.toNumber(),
        shortTokenSupply: shortTokenSupply.toNumber(),
        longTokenEffectiveGain: calcEffectiveLongGain(shortTokenBalance, longTokenBalance, leverageBN).toNumber(),
        shortTokenEffectiveGain: calcEffectiveShortGain(shortTokenBalance, longTokenBalance, leverageBN).toNumber(),
        longTokenPrice: longTokenPrice.toNumber(),
        shortTokenPrice: shortTokenPrice.toNumber(),
        skew: calcSkew(shortTokenBalance, longTokenBalance).toNumber(),
    };
};
