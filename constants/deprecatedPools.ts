import { NETWORKS } from '@tracer-protocol/pools-js';
import { DeprecatedPoolsForNetwork } from '~/types/deprecatedPools';

export const deprecatedPools: DeprecatedPoolsForNetwork = {
    [NETWORKS.ARBITRUM_RINKEBY]: {
        '0x4022284C8aE79fe2aaeA2164aB1942e66D255bC8': true,
        '0x9726f3bDB63F5C8c98d698de2BB77e6Ee876b09B': true,
    },
    [NETWORKS.ARBITRUM]: {
        '0x3C16b9efE5E4Fc0ec3963F17c64a3dcBF7269207': true, // 3ETH pool with out of sync SMA
        '0x6D3Fb4AA7ddCa8CBc88F7BA94B36ba83fF6bA234': true, // 3BTC pool with out of sync SMA
    },
};
