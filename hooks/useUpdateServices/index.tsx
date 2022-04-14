import { useEffect } from 'react';
import shallow from 'zustand/shallow';
import { baseService } from 'services';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';

// custom hook to handle any updates to the web3Store
export const useUpdateServices: () => void = () => {
    const { provider, network } = useStore(selectWeb3Info, shallow);

    useEffect(() => {
        baseService.providerUpdate(provider);
    }, [provider]);

    useEffect(() => {
        baseService.networkUpdate(network);
    }, [network]);
};
