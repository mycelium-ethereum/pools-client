import { NETWORKS } from '@tracer-protocol/pools-js';
import { useStore } from '~/store/main';
import { selectNetwork } from '~/store/Web3Slice';

type DeprecatedPoolsForNetwork = Record<string, boolean>;

const deprecatedPoolsLookup: Record<string, DeprecatedPoolsForNetwork> = {
    [NETWORKS.ARBITRUM_RINKEBY]: {
        '0x4022284C8aE79fe2aaeA2164aB1942e66D255bC8': true,
        '0x9726f3bDB63F5C8c98d698de2BB77e6Ee876b09B': true,
    },
    [NETWORKS.ARBITRUM]: {},
};

export const useDeprecatedPools: () => DeprecatedPoolsForNetwork = () => {
    const network = useStore(selectNetwork);

    if (!network) {
        return {};
    }

    return deprecatedPoolsLookup[network] || {};
};
