import { useMemo, useState } from 'react';
import { getBalancerPrices } from '@libs/utils/rpcMethods';
import BigNumber from 'bignumber.js';
import { DEFAULT_NETWORK, networkConfig } from '@context/Web3Context/Web3Context.Config';
import { KnownNetwork } from '@tracer-protocol/pools-js';

export default ((network = DEFAULT_NETWORK) => {
    const [tokenPrices, setTokenPrices] = useState<Record<string, BigNumber>>({});

    useMemo(() => {
        let mounted = true;
        getBalancerPrices(networkConfig[network]?.balancerInfo).then((tokenPrices) => {
            if (mounted) {
                setTokenPrices(tokenPrices);
            }
        });
        return () => {
            mounted = false;
        };
    }, [network]);

    return tokenPrices;
}) as (network: KnownNetwork | undefined) => Record<string, BigNumber>;
