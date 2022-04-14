import { KnownNetwork } from '@tracer-protocol/pools-js';
import { networkConfig } from '~/constants/networks';
import { BlockExplorerAddressType } from '~/types/blockExplorers';

export const constructExplorerLink = (
    type: BlockExplorerAddressType,
    target: string,
    network: KnownNetwork | undefined,
): string => {
    const base = !!network ? networkConfig[network]?.previewUrl : 'https://arbiscan.io'; // defaults to arbiscan
    switch (type) {
        case BlockExplorerAddressType.txn:
            return `${base}/tx/${target}`;
        case BlockExplorerAddressType.token:
            return `${base}/token/${target}`;
        case BlockExplorerAddressType.address:
            return `${base}/address/${target}`;
        default:
            return base;
    }
};
