import { useEffect, useState } from 'react';
import { getBalancerPrices } from '@libs/utils/rpcMethods';
import BigNumber from 'bignumber.js';
import { AvailableNetwork, networkConfig } from '@context/Web3Context/Web3Context.Config';

export default ((network) => {
    const [tokenPrices, setTokenPrices] = useState<Record<string, BigNumber>>({});

    useEffect(() => {
        let mounted = true;
        if (network) {
            getBalancerPrices(networkConfig[network]?.balancerInfo).then((tokenPrices) => {
                if (mounted) {
                    setTokenPrices(tokenPrices);
                }
            });
        }
        return () => {
            mounted = false;
        };
    }, []);

    return tokenPrices;
}) as (network: AvailableNetwork | undefined) => Record<string, BigNumber>;
