import { useState, useEffect } from 'react';
import { useWeb3 } from '@context/Web3Context/Web3Context';
// @ts-ignore
import ENS, { getEnsAddress } from '@ensdomains/ensjs';

// const useEnsName
export default ((account: string) => {
    const [ensName, setEnsName] = useState('');
    const [ens, setEns] = useState(undefined);
    const { provider } = useWeb3();

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
