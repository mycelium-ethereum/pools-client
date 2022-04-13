import { useEffect } from 'react';
import { selectCheckENSName } from '~/store/ENSSlice';
import { useStore } from '~/store/main';
import { selectAccount } from '~/store/Web3Slice';

export const useUpdateENS = (): void => {
    const account = useStore(selectAccount);
    const checkEnsName = useStore(selectCheckENSName);

    useEffect(() => {
        checkEnsName(account);
    }, [account]);
};

export default useUpdateENS;
