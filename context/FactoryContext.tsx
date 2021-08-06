import React, { useEffect, useState } from 'react';
import { Children } from 'libs/types';
import { useWeb3 } from './Web3Context/Web3Context';
import { ethers } from 'ethers';
import { PoolFactory } from '@libs/types/contracts';
import { PoolType } from '@libs/types/General';

interface ContextProps {
    pools: PoolType[]
}


export const FactoryContext = React.createContext<Partial<ContextProps>>({});

/**
 * Wrapper store for the FactoryContext.
 */
export const FactoryStore: React.FC<Children> = ({ children }: Children) => {
    const { provider, config, account } = useWeb3();
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
                const createdMarkets = contract.filters.DeployPool();
                const allEvents = await contract?.queryFilter(createdMarkets);
                const pools = allEvents.map((event) => ({
                    name: event.args.poolCode,
                    address: event.args.pool
                }))
                setPools(pools)
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
