import React, { useEffect, useState } from 'react';
import { Children } from 'libs/types/General';
import { useWeb3 } from './Web3Context/Web3Context';
import { ethers } from 'ethers';
import { PoolFactory } from '@tracer-protocol/perpetual-pools-contracts/types';
import { PoolType } from '@libs/types/General';
import { ARBITRUM_RINKEBY } from '@libs/constants';

// this is a temp hack to fix fetching pools > 2000 blocks from currentBlock
const ARBITRUM_POOLS = [
    {
        // 1x
        name: 'BTC/USDC',
        address: '0xC42778b0248d4630b7a792dDDEa2Af5094639e9B',
    },
    {
        // 3x
        name: 'BTC/USDC',
        address: '0xFBa3aa7c015efdB16F74355Dad5Ba671aAF5741c',
    },
    {
        // 1x
        name: 'ETH/USDC',
        address: '0x92cf8251ff07Ceee503dBF34352d799cC197746a',
    },
    {
        // 3x
        name: 'ETH/USDC',
        address: '0xf69FCE9ad0d3Fc50adbcD12F4165B6709AEc6368',
    },
];
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
                if (network === parseInt(ARBITRUM_RINKEBY)) {
                    // hacky temp solution to rpc limit issues
                    setPools(ARBITRUM_POOLS);
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
