import shallow from 'zustand/shallow';
import { NETWORKS } from '@tracer-protocol/pools-js';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';

type DeprecatedPoolsForNetwork = Record<string, boolean>;

const deprecatedPoolsLookup: Record<string, DeprecatedPoolsForNetwork> = {
    [NETWORKS.ARBITRUM_RINKEBY]: {
        '0x4146D18b82C9a9Eb02B1ffdf1331f9563eab8cDf': true,
        '0x9FBc47E8be32991Aaf1c3E59d13eA9ca20897cef': true,
        '0xB5E515fcd57DA6BAc06b011057669C2e365A6959': true,
        '0xF7844d494d16eAC8F576D014DC92D407f64a6F60': true,
    },
    [NETWORKS.ARBITRUM]: {},
};

export const useDeprecatedPools: () => DeprecatedPoolsForNetwork = () => {
    const { network } = useStore(selectWeb3Info, shallow);

    if (!network) {
        return {};
    }

    return deprecatedPoolsLookup[network] || {};
};
