import React, { useEffect, useState } from 'react';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import usePools from '~/hooks/usePools';
import { useStore } from '~/store/main';
import { selectImportPool, selectImportedPools } from '~/store/PoolsSlice';
import { selectNetwork } from '~/store/Web3Slice';
import { isAddress } from '~/utils/rpcMethods';
import { BrowseTableRowData } from '../state';

export default (({ sortedFilteredTokens }) => {
    const { poolsInitialized } = usePools();
    const [imported, setImported] = useState<boolean>(false);
    const importPool = useStore(selectImportPool);
    const getImported = useStore(selectImportedPools);
    const network = useStore(selectNetwork);

    const handleImport = (address: string) => {
        const isDuplicatePool = sortedFilteredTokens.some((v: BrowseTableRowData) => v.address === address);
        const isDuplicateImport = getImported.some((v) => v.address === address);

        if ((!isDuplicatePool || !isDuplicateImport) && isAddress(address)) {
            console.debug('Importing', address);
            importPool(network as KnownNetwork, address);
        } else if (isDuplicatePool || isDuplicateImport) {
            console.error('Duplicate pool or duplicate import:', address);
        } else {
            console.error('Invalid address:', address);
        }
    };

    useEffect(() => {
        if (poolsInitialized && sortedFilteredTokens.length > 1 && !imported) {
            setImported(true);
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const poolAddresses = urlParams.getAll('show');

            if (poolAddresses) {
                console.debug(
                    `Found ${poolAddresses.length} pool${poolAddresses.length > 1 ? 's' : ''} to import:`,
                    poolAddresses,
                );
                // Wait 2 seconds for the Pools to be initialized
                window.setTimeout(() => {
                    poolAddresses.forEach((address) => {
                        handleImport(address);
                    });
                }, 2000);
            }
        }
    }, [poolsInitialized, sortedFilteredTokens]);

    return null;
}) as React.FC<{
    sortedFilteredTokens: BrowseTableRowData[];
}>;
