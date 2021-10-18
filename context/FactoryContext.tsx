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
            address: '0x1C4eaD7a59c81a7650317ceCc0C25b87aDB4D7Ba',
        },
        {
            // 3x
            name: '3-BTC/USDC',
            address: '0x30B8d62dF49CB98023A2ACEe5e6A26687f4BFB45',
        },
        {
            // 1x
            name: '1-ETH/USDC',
            address: '0xeaf5862E99fdD2535225321dF43ba906684C3712',
        },
        {
            // 3x
            name: '3-ETH/USDC',
            address: '0xB436fD3f5Ca30B4A0FA9D1994c0741ECF1DDD40d',
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
