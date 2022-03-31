import { useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { getBalancerPrices } from '~/utils/balancer';
import { DEFAULT_NETWORK } from '~/constants/networks';
import { balancerConfig } from '~/constants/balancer';

export default ((network = DEFAULT_NETWORK) => {
    const [tokenPrices, setTokenPrices] = useState<Record<string, BigNumber>>({});

    useMemo(() => {
        let mounted = true;
        getBalancerPrices(balancerConfig[network]).then((tokenPrices) => {
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
