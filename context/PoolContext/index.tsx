import React, { useContext, useReducer, useState } from 'react';
import { Children, Pool } from '@libs/types/General';
import { FactoryContext } from '..';
import { useEffect } from 'react';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { reducer, initialPoolState } from './poolDispatch'
import { fetchTokenBalances, initPool } from './helpers';
import { useMemo } from 'react';
import { ethers } from 'ethers';
import { DEFAULT_POOLSTATE } from '@libs/constants/pool';
import BigNumber from 'bignumber.js';

interface ContextProps {
    pools: Record<string, Pool>
}

interface ActionContextProps {
    mint: (pool: string, amount: number) => void;
    burn: (pool: string, amount: number) => void;
}

interface SelectedPoolContextProps {
    pool: Pool
}

export const PoolsContext = React.createContext<Partial<ContextProps>>({});
export const PoolsActionsContext = React.createContext<Partial<ActionContextProps>>({});
export const SelectedPoolContext = React.createContext<Partial<SelectedPoolContextProps>>({});

/**
 * Wrapper store for the swap page state
 */
export const PoolStore: React.FC<Children> = ({ children }: Children) => {
    const { pools } = useContext(FactoryContext);
    const { provider, account } = useWeb3();
    // const { handleTransaction } = useContext(TransactionContext);
    const [poolsState, poolsDispatch] = useReducer(reducer, initialPoolState);

    /** If pools changes then re-init them */
    useEffect(() => {
        // if pools from factory change
        if (pools && provider) {
            Promise.all(pools.map((pool) => (
                initPool(pool, provider)
            ))).then((res) => {
                res.forEach((pool) => {
                    poolsDispatch({ type: 'setPool', pool: pool, key: pool.address })
                })
                if (res.length) { // if pools exist
                    poolsDispatch({ type: 'setPoolsInitialised', value: true })
                }
            }).catch((err) => {
                console.error("Failed to initialise pools", err)
                poolsDispatch({ type: 'setPoolsInitialised', value: false })
            })
        }
    }, [provider, pools]);

    // if the account or provider changes update the account balances for each pool
    useEffect(() => {
        if (account && provider && poolsState.poolsInitialised) {
            Object.values(poolsState.pools).map((pool) => {
                const tokens = [
                    pool.shortToken.address, 
                    pool.longToken.address,
                    pool.quoteToken.address
                ]
                fetchTokenBalances(
                    tokens,
                    provider,
                    account
                ).then((balances) => {
                    poolsDispatch({
                        type: 'setTokenBalances',
                        pool: pool.address,
                        shortToken: new BigNumber(ethers.utils.formatEther(balances[0])),
                        longToken: new BigNumber(ethers.utils.formatEther(balances[1])),
                        quoteToken: new BigNumber(ethers.utils.formatEther(balances[2])),
                    })
                })
            })
        }
    }, [account, poolsState.poolsInitialised])

    /**
     * Subscribes to a given pool address
     */
    // const subscribeToPool = (pool: string) => {
    //     if (poolsState?.pools[pool]) {
    //         const pools = poolsState?.pools;
    //         const poolContract = new ethers.Contract(
    //             pool,
    //             LeveragedPool__factory.abi,
    //             provider,
    //         ) as LeveragedPool;
    //         const shortToken = new ethers.Contract(
    //             pools[pool].shortToken.address,
    //             TestToken__factory.abi,
    //             provider,
    //         ) as PoolTokenContract;
    //         const longToken = new ethers.Contract(
    //             pools[pool].longToken.address,
    //             TestToken__factory.abi,
    //             provider,
    //         ) as PoolTokenContract;
    //         const quoteToken = new ethers.Contract(
    //             pools[pool].quoteToken.address,
    //             TestToken__factory.abi,
    //             provider,
    //         ) as TestToken;

    //         shortToken.on('Transfer', () => {
    //             console.log("Detected short token transfer")
    //         });

    //         longToken.on('Transfer', () => {
    //             console.log("Detected long token transfer")
    //         });

    //         quoteToken.on('Transfer', () => {
    //             console.log("Detected quote token transfer")
    //         });
    //         poolContract.on('PriceChange', (startPrice, endPrice, transferAmount) => {
    //             console.log("Pool price change", startPrice, endPrice, transferAmount)
    //             // const oldPrice = new BigNumber(ethers.utils.formatEther(startPrice));
    //             // const newPrice = new BigNumber(ethers.utils.formatEther(endPrice));
    //             // console.debug(
    //             //     `Pool price changed, old: $${oldPrice.toNumber()}, new: $${newPrice.toNumber()}, transferred: ${transferAmount}`,
    //             // );
    //         });
    //     }
    // }


    return (
        <PoolsContext.Provider
            value={{
                pools: poolsState.pools
            }}
        >
            <PoolsActionsContext.Provider
                value={{
                    // mint,
                    // burn
                }}
            >
                {children}
            </PoolsActionsContext.Provider>
        </PoolsContext.Provider>
    );
};


export const usePools = () => {
  const context = useContext(PoolsContext)
  if (context === undefined) {
    throw new Error(`usePools must be called within PoolsContext`)
  }
  return context
}

export const usePoolActions = () => {
  const context = useContext(PoolsActionsContext)
  if (context === undefined) {
    throw new Error(`usePoolActions must be called within PoolsActionsContext`)
  }
  return context
}

export const usePool = (pool: string | undefined) => {
    const { pools } = usePools();
    const [pool_, setPool] = useState<Pool>(DEFAULT_POOLSTATE);
    // const poolCommitter = usePoolCommitter(pool_.committer);
    console.log(pool_, "pool")
    useMemo(() => {
        if (pool) {
            setPool(pools?.[pool] ?? DEFAULT_POOLSTATE)
        }
    }, [pool, pools])

    return pool_;
}