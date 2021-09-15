import React, { useEffect, useState } from 'react';
import { Children } from 'libs/types/General';
import { useWeb3 } from './Web3Context/Web3Context';
import { ethers } from 'ethers';
import { PoolFactory } from '@tracer-protocol/perpetual-pools-contracts/types';
import { PoolType } from '@libs/types/General';
import { ARBITRUM, ARBITRUM_RINKEBY } from '@libs/constants';

// this is a temp hack to fix fetching pools > 2000 blocks from currentBlock
type ArbitrumNetwork = typeof ARBITRUM_RINKEBY | typeof ARBITRUM;

const POOLS: Record<ArbitrumNetwork, any> = {
    [ARBITRUM_RINKEBY]: [
        {
            // 1x
            name: '1-BTC/USDC',
            address: '0xE8186114E071A516C735a822F0B01875bd796671',
        },
        {
            // 3x
            name: '3-BTC/USDC',
            address: '0x1e4c6b7e3a24b6197a5236e632D2E74cDC42cEaE',
        },
        {
            // 1x
            name: '1-ETH/USDC',
            address: '0x7735325DB7744e1f4327cC3fFF41cFc8A190B7A2',
        },
        {
            // 3x
            name: '3-ETH/USDC',
            address: '0x377F606c10454a0c65dAb1B1b413baa038Aa5681',
        },
    ],
    [ARBITRUM]: [
        {
            // 1x
            name: '1-BTC/USDC',
            address: '0x6cbcB8D102063D2769cBB6230A3Ff39b1bF9e627',
        },
        {
            // 3x
            name: '3-BTC/USDC',
            address: '0x9676a18e5aAA8546786906296485c9383B1FB255',
        },
        {
            // 1x
            name: '1-ETH/USDC',
            address: '0x14eDb24B0cf9e05a8a6c528E05F6dfD4eD9dfdF3',
        },
        {
            // 3x
            name: '3-ETH/USDC',
            address: '0x74052648ED909D611dE5F5447B91B2634059782F',
        },
    ],
};
interface ContextProps {
    pools: PoolType[];
}

export const FactoryContext = React.createContext<Partial<ContextProps>>({});

/**
 * Wrapper store for the FactoryContext.
 */
export const FactoryStore: React.FC<Children> = ({ children }: Children) => {
    const { provider, config, account, network } = useWeb3();
    const [contract, setContract] = useState<PoolFactory | undefined>(undefined);
    const [pools, setPools] = useState<PoolType[]>([]);

    useEffect(() => {
        if (provider) {
            if (config?.contracts.poolFactory) {
                const { address, abi } = config?.contracts.poolFactory;
                if (address) {
                    let contract = new ethers.Contract(address, abi, provider);
                    if (account) {
                        contract = contract.connect(account);
                    }
                    setContract(contract as PoolFactory);
                }
            }
        }
    }, [provider, config]);

    useEffect(() => {
        const fetch = async () => {
            if (contract) {
                if (POOLS[network as unknown as ArbitrumNetwork]) {
                    // hacky temp solution to rpc limit issues
                    setPools(POOLS[network as unknown as ArbitrumNetwork]);
                } else {
                    const createdMarkets = contract.filters.DeployPool();
                    const allEvents = await contract?.queryFilter(createdMarkets);
                    const pools = allEvents.map((event) => ({
                        name: event.args.ticker,
                        address: event.args.pool,
                    }));
                    setPools(pools);
                }
            }
        };
        fetch();
    }, [contract]);

    return (
        <FactoryContext.Provider
            value={{
                pools,
            }}
        >
            {children}
        </FactoryContext.Provider>
    );
};
