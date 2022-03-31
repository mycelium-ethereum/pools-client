import { useEffect } from 'react';
import { useStore } from '~/store/main';
import { selectIsDark } from '~/store/ThemeSlice';
import { selectOnboard, selectSetDefaultProvider } from '~/store/Web3Slice';

// custom hook to handle any updates to the web3Store
export const useUpdateWeb3Store: () => void = () => {
    const isDark = useStore(selectIsDark);
    const onboard = useStore(selectOnboard);
    const setDefaultProvider = useStore(selectSetDefaultProvider);

    // connect wallet on start if saved wallet
    useEffect(() => {
        const savedWallet = window.localStorage.getItem('onboard.selectedWallet');
        if (savedWallet) {
            (async () => {
                await onboard.walletSelect(savedWallet);
                await onboard.walletCheck();
            })();
        }
    }, []);

    // set default provider if we need to
    useEffect(() => {
        setDefaultProvider();
    }, []);

    // change theme
    useEffect(() => {
        if (onboard) {
            onboard?.config({ darkMode: isDark });
        }
    }, [isDark]);
};
