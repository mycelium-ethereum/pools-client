import {AvailableNetwork} from "@context/Web3Context/Web3Context.Config";
import BigNumber from "bignumber.js";
import {ethers} from "ethers";
import {useEffect, useState} from "react";
import { poolList } from '@libs/constants/poolLists';
import { StaticPoolInfo } from '@libs/types/General';
import { ARBITRUM } from '@libs/constants'

type Upkeep = {
    pool: string
    network: AvailableNetwork
    timestamp: number
    newPrice: BigNumber
    oldPrice: BigNumber
    tvl: BigNumber
    longTokenBalance: BigNumber
    longTokenSupply: BigNumber
    shortTokenBalance: BigNumber
    shortTokenSupply: BigNumber
}

type RawUpkeep = {
    pool_address: string
    long_token_supply: string
    short_token_supply: string
    long_balance: string
    short_balance: string
    old_price: string
    new_price: string
    network: string
    block_timestamp: string
};

const POOLS_API = 'http://dev.api.tracer.finance/pools/upkeeps';
// https://dev.api.tracer.finance/pools/upkeeps?network=chain_id&poolAddress=pool_address&committerAddress=committer_address

// const useUpkeeps
export const useUpkeeps: (network: AvailableNetwork | undefined) => Upkeep[] = ((network) => {
    const [upkeeps, setUpkeeps] = useState<Upkeep[]>([]);

    useEffect(() => {
        let mounted = false;
        const poolInfo: StaticPoolInfo = poolList[(network ?? ARBITRUM) as AvailableNetwork][0]
        const USDC_DECIMALS = poolInfo.quoteToken.decimals;
        const fetchUpkeeps = async () => {
            const now = Date.now() / 1000;
            // times to make sure to get past 2 upkeep
            const from = now - (poolInfo.updateInterval.times(2).toNumber());
            const rawUpkeeps = await fetch(`${POOLS_API}?network=${network}&from=${from}&to=${now}`).then((res) => {
                return res.json()
            }).catch((error) => {
                console.log("Failed to fetch upkeeps", error)
                return []
            })

            console.log("Raw upkeeps", rawUpkeeps)
            if (rawUpkeeps.message) {
                console.log("Fetched upkeeps", rawUpkeeps.message)
            } else if (rawUpkeeps.data) {
                setUpkeeps(rawUpkeeps.data.map((upkeep: RawUpkeep) => {
                    const longTokenBalance = new BigNumber(ethers.utils.parseUnits(upkeep.long_balance, USDC_DECIMALS).toString());
                    const shortTokenBalance = new BigNumber(ethers.utils.parseUnits(upkeep.short_balance, USDC_DECIMALS).toString());
                    return ({
                            pool: upkeep.pool_address,
                            oldPrice: ethers.utils.parseEther(upkeep.old_price),
                            newPrice: ethers.utils.parseEther(upkeep.new_price),
                            tvl: longTokenBalance.plus(shortTokenBalance),
                            longTokenBalance: longTokenBalance,
                            longTokenSupply: ethers.utils.parseUnits(upkeep.long_token_supply, USDC_DECIMALS),
                            shortTokenBalance: shortTokenBalance,
                            shortTokenSupply: ethers.utils.parseUnits(upkeep.short_token_supply, USDC_DECIMALS),
                        })
                    })
                )
            }
        }

        if (network) {
            fetchUpkeeps()
        }

        return () => { mounted = true }

    }, [network])

    console.log("Upkeeps my boy", upkeeps)

    return upkeeps;
})
