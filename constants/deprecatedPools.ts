import { NETWORKS } from '@tracer-protocol/pools-js';
import { DeprecatedPoolsForNetwork } from '~/types/deprecatedPools';

export const deprecatedPools: DeprecatedPoolsForNetwork = {
    [NETWORKS.ARBITRUM_RINKEBY]: {
        '0x4022284C8aE79fe2aaeA2164aB1942e66D255bC8': true,
        '0x9726f3bDB63F5C8c98d698de2BB77e6Ee876b09B': true,
    },
    [NETWORKS.ARBITRUM]: {},
};
