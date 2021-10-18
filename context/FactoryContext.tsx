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
            address: '0x6783d7253032102b4eaa943868c377db070A14c2',
        },
        {
            // 3x
            name: '3-BTC/USDC',
            address: '0xDEbC492E5Cefa6755156545961726B4A9988374b',
        },
        {
            // 1x
            name: '1-ETH/USDC',
            address: '0x50a93f3fB6b6Df75438913B6e208E101A718A90C',
        },
        {
            // 3x
            name: '3-ETH/USDC',
            address: '0x45D0c0DF22CCd052CdBF7E89928430D0D1747192',
        },
    ],
    [ARBITRUM]: [
        {
            // 1x
            name: '1-BTC/USDC',
            address: '0x146808f54DB24Be2902CA9f595AD8f27f56B2E76',
        },
        {
            // 3x
            name: '3-BTC/USDC',
            address: '0x70988060e1FD9bbD795CA097A09eA1539896Ff5D',
        },
        {
            // 1x
            name: '1-ETH/USDC',
            address: '0x3A52aD74006D927e3471746D4EAC73c9366974Ee',
        },
        {
            // 3x
            name: '3-ETH/USDC',
            address: '0x54114e9e1eEf979070091186D7102805819e916B',
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
