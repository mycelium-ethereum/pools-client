import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { KnownNetwork, calcSkew, calcTokenPrice } from '@tracer-protocol/pools-js';
import { V2_SUPPORTED_NETWORKS } from '~/utils/tracerAPI';
import { last2UpkeepsQuery, subgraphUrlByNetwork } from '~/utils/tracerAPI/subgraph';
import { useAllPoolLists } from '../useAllPoolLists';

export type Upkeep = {
    pool: string;
    timestamp: number;
    newPrice: number;
    oldPrice: number;
    tvl: number;
    longTokenBalance: number;
    longTokenSupply: number;
    shortTokenBalance: number;
    shortTokenSupply: number;
    longTokenPrice: number;
    shortTokenPrice: number;
    skew: number;
};

type RawUpkeep = {
    id: string;
    longTokenSupply: string;
    shortTokenSupply: string;
    longBalance: string;
    shortBalance: string;
    startPrice: string;
    endPrice: string;
    network: string;
    timestamp: string;
    pool: {
        settlementTokenDecimals: string;
    };
};

// const useUpkeeps
export const useUpkeeps: (network: KnownNetwork | undefined) => Record<string, Upkeep[]> = (network) => {
    const [upkeeps, setUpkeeps] = useState<Record<string, Upkeep[]>>({});
    const poolLists = useAllPoolLists();

    useEffect(() => {
        let mounted = true;
        const fetchUpkeeps = async () => {
            const graphUrl = subgraphUrlByNetwork[network as V2_SUPPORTED_NETWORKS];

            if (!graphUrl) {
                return;
            }

            const upkeepMapping: Record<string, Upkeep[]> = {};

            const promises = poolLists.map(async (pool) => {
                try {
                    const last2Upkeeps = await fetch(graphUrl, {
                        method: 'POST',
                        body: JSON.stringify({
                            query: last2UpkeepsQuery({ poolAddress: pool.address }),
                        }),
                    }).then((res) => res.json());

                    for (const upkeep of last2Upkeeps.data.upkeeps) {
                        const decimals = Number(upkeep.pool?.settlementTokenDecimals ?? 18);
                        if (upkeepMapping[pool.address]) {
                            upkeepMapping[pool.address].push(parseUpkeep(upkeep, decimals));
                        } else {
                            upkeepMapping[pool.address] = [parseUpkeep(upkeep, decimals)];
                        }
                    }
                } catch (error: any) {
                    console.error(`Error getting last 2 upkeeps for pool ${pool}: ${error.message}`);
                }
            });

            await Promise.all(promises);

            if (mounted) {
                setUpkeeps(upkeepMapping);
            }
        };

        if (network) {
            fetchUpkeeps();
        }

        return () => {
            mounted = false;
        };
    }, [network, poolLists]);

    return upkeeps;
};

const parseUpkeep: (upkeep: RawUpkeep, decimals: number) => Upkeep = (upkeep, decimals) => {
    const longTokenBalance = new BigNumber(ethers.utils.formatUnits(upkeep.longBalance, decimals));

    const shortTokenBalance = new BigNumber(ethers.utils.formatUnits(upkeep.shortBalance, decimals));

    const shortTokenSupply = new BigNumber(ethers.utils.formatUnits(upkeep.shortTokenSupply, decimals));

    const longTokenSupply = new BigNumber(ethers.utils.formatUnits(upkeep.longTokenSupply, decimals));

    const longTokenPrice = calcTokenPrice(longTokenBalance, longTokenSupply);
    const shortTokenPrice = calcTokenPrice(shortTokenBalance, shortTokenSupply);

    return {
        pool: upkeep.id,
        timestamp: parseInt(upkeep.timestamp),
        oldPrice: new BigNumber(ethers.utils.formatEther(upkeep.startPrice)).toNumber(),
        newPrice: new BigNumber(ethers.utils.formatEther(upkeep.endPrice)).toNumber(),
        tvl: longTokenBalance.plus(shortTokenBalance).toNumber(),
        longTokenBalance: longTokenBalance.toNumber(),
        longTokenSupply: longTokenSupply.toNumber(),
        shortTokenBalance: shortTokenBalance.toNumber(),
        shortTokenSupply: shortTokenSupply.toNumber(),
        longTokenPrice: longTokenPrice.toNumber(),
        shortTokenPrice: shortTokenPrice.toNumber(),
        skew: calcSkew(shortTokenBalance, longTokenBalance).toNumber(),
    };
};
