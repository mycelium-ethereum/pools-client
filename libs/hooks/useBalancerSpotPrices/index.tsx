import { useEffect, useState } from 'react';
import { getBalancerPrices } from '@libs/utils/rpcMethods';
import BigNumber from 'bignumber.js';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';

export default ((network) => {
    const [tokenPrices, setTokenPrices] = useState<Record<string, BigNumber>>({});

    useEffect(() => {
        let mounted = true;
        getBalancerPrices(networkConfig[network]?.balancerInfo).then((tokenPrices) => {
            if (mounted) {
                setTokenPrices(tokenPrices);
            }
        });
        return () => {
            mounted = false;
        };
    }, []);

    return tokenPrices;
}) as (network: number) => Record<string, BigNumber>;
