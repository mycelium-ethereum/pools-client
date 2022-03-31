import { useState, useEffect } from 'react';
import ENS, { getEnsAddress } from '@ensdomains/ensjs';
// @ts-ignore
import { useStore } from '~/store/main';
import { selectProvider } from '~/store/Web3Slice';

// const useEnsName
export default ((account: string) => {
    const provider = useStore(selectProvider);
    const [ensName, setEnsName] = useState('');
    const [ens, setEns] = useState(undefined);

    useEffect(() => {
        if (provider) {
            const ens = new ENS({ provider, ensAddress: getEnsAddress('1') });
            setEns(ens);
        }
    }, [provider]);

    useEffect(() => {
        if (!!ens && !!account) {
            const getEns = async () => {
                try {
                    const name = await (ens as ENS).getName(account);
                    if (name.name) {
                        setEnsName(name.name);
                    }
                } catch (err) {
                    console.error('Failed to fetch ens name', err);
                    setEnsName('');
                }
            };
            getEns();
        }
    }, [ens, account]);

    return ensName;
}) as (account: string) => string;
