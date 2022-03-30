import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { NETWORKS } from '@tracer-protocol/pools-js';
import useBalancerSpotPrices from '../useBalancerSpotPrices';

const ZERO = new BigNumber(0);

export default (() => {
    // doesnt really matter which network we use here as long as it has balanceConfig
    //  which ARBITRUM does
    const spotPrices = useBalancerSpotPrices(NETWORKS.ARBITRUM);
    return useMemo(() => spotPrices['WETH'] || ZERO, [spotPrices['WETH']]);
}) as () => BigNumber;
