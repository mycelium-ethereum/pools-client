import { useMemo, useState } from 'react';
import { getBalancerPrices } from '@libs/utils/rpcMethods';
import BigNumber from 'bignumber.js';
import { AvailableNetwork, networkConfig } from '@context/Web3Context/Web3Context.Config';

export default ((network) => {
    const [tokenPrices, setTokenPrices] = useState<Record<string, BigNumber>>({});

    useMemo(() => {
        let mounted = true;
        getBalancerPrices(networkConfig[network ?? '0']?.balancerInfo).then((tokenPrices) => {
            if (mounted) {
                setTokenPrices(tokenPrices);
            }
        });
        return () => {
            mounted = false;
        };
    }, [network]);

    return tokenPrices;
}) as (network: AvailableNetwork | undefined) => Record<string, BigNumber>;
