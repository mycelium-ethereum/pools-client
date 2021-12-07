import { AvailableNetwork } from '@context/Web3Context/Web3Context.Config';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { poolList } from '@libs/constants/poolLists';
import { StaticPoolInfo } from '@libs/types/General';
import { ARBITRUM } from '@libs/constants';

export type Upkeep = {
    pool: string;
    network: AvailableNetwork;
    timestamp: number;
    newPrice: BigNumber;
    oldPrice: BigNumber;
    tvl: BigNumber;
    antecedentTVL: BigNumber;
    longTokenBalance: BigNumber;
    longTokenSupply: BigNumber;
    shortTokenBalance: BigNumber;
    shortTokenSupply: BigNumber;
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

// some arbitrary buffer since the timestamps arent exact
const TIMESTAMP_BUFFER = 100;

const POOLS_API = 'http://dev.api.tracer.finance/pools/upkeeps';
// https://dev.api.tracer.finance/pools/upkeeps?network=chain_id&poolAddress=pool_address&committerAddress=committer_address

// const useUpkeeps
export const useUpkeeps: (network: AvailableNetwork | undefined) => Upkeep[] = (network) => {
    const [upkeeps, setUpkeeps] = useState<Upkeep[]>([]);

    useEffect(() => {
        let mounted = true;
        const poolInfo: StaticPoolInfo = poolList[(network ?? ARBITRUM) as AvailableNetwork][0];
        const USDC_DECIMALS = poolInfo.quoteToken.decimals;
        const fetchUpkeeps = async () => {
            // const now = Date.now() / 1000;
            // times to make sure to get past 2 upkeep
            // const from = now - (poolInfo.updateInterval.times(2).toNumber());
            // TODO remove this is for testing
            const from = 1638826512;
            const rawUpkeeps = await fetch(`${POOLS_API}?network=${network}&from=${from}`)
                .then((res) => {
                    return res.json();
                })
                .catch((error) => {
                    console.error('Failed to fetch upkeeps', error);
                    return [];
                });

            console.log('Raw upkeeps', rawUpkeeps);
            if (rawUpkeeps.message) {
                console.info('Fetched upkeeps', rawUpkeeps.message);
            } else if (rawUpkeeps.data) {
                if (mounted) {
                    const lastUpkeep = from + poolInfo.updateInterval.toNumber() - TIMESTAMP_BUFFER;

                    const oldestUpkeeps: Record<string, RawUpkeep> = {};
                    const pastUpkeeps: RawUpkeep[] = [];

                    for (const upkeep of rawUpkeeps.data) {
                        if (parseInt(upkeep.block_timestamp) < lastUpkeep) {
                            oldestUpkeeps[upkeep.pool_address] = upkeep;
                        } else {
                            pastUpkeeps.push(upkeep);
                        }
                    }

                    setUpkeeps(
                        pastUpkeeps.map((upkeep: RawUpkeep) => {
                            const antecedentUpkeep = oldestUpkeeps[upkeep.pool_address] ?? upkeep;
                            const longTokenBalance = new BigNumber(
                                ethers.utils.formatUnits(upkeep.long_balance, USDC_DECIMALS),
                            );
                            const shortTokenBalance = new BigNumber(
                                ethers.utils.formatUnits(upkeep.short_balance, USDC_DECIMALS),
                            );
                            const antecedentLongTokenBalance = new BigNumber(
                                ethers.utils.formatUnits(antecedentUpkeep.long_balance, USDC_DECIMALS),
                            );
                            const antecedentShortTokenBalance = new BigNumber(
                                ethers.utils.formatUnits(antecedentUpkeep.short_balance, USDC_DECIMALS),
                            );
                            // TODO need to check if decimals effect oldPrice and newPrice or if they come from the oracle in WAD
                            return {
                                pool: upkeep.pool_address,
                                oldPrice: new BigNumber(ethers.utils.formatEther(upkeep.old_price)),
                                newPrice: new BigNumber(ethers.utils.formatEther(upkeep.new_price)),
                                tvl: longTokenBalance.plus(shortTokenBalance),
                                antecedentTVL: antecedentLongTokenBalance.plus(antecedentShortTokenBalance),
                                longTokenBalance: longTokenBalance,
                                longTokenSupply: new BigNumber(
                                    ethers.utils.formatUnits(upkeep.long_token_supply, USDC_DECIMALS),
                                ),
                                shortTokenBalance: shortTokenBalance,
                                shortTokenSupply: new BigNumber(
                                    ethers.utils.formatUnits(upkeep.short_token_supply, USDC_DECIMALS),
                                ),
                            } as Upkeep;
                        }),
                    );
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
