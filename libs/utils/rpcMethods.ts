import { PoolToken } from '@libs/types/General';
import { ethers } from 'ethers';

/**
 * Adds a token asset to the users wallet watch
 * @param provider ethereum provider
 * @param token token to add
 * @returns true if success and false otherwise
 */
export const watchAsset: (provider: ethers.providers.JsonRpcProvider | null, token: PoolToken) => Promise<boolean> = (
    provider,
    token,
) => {
    if (!provider) {
        return new Promise(() => false);
    }
    return provider
        ?.send('wallet_watchAsset', {
            // @ts-ignore
            type: 'ERC20',
            options: {
                type: 'ERC20',
                address: token.address,
                symbol: token.name,
                decimals: 18,
            },
        })
        .then((success) => {
            if (success) {
                return true;
            } else {
                console.error('Failed to watch asset');
                return false;
            }
        })
        .catch((err) => {
            console.error('Failed to watch asset', err);
            return false;
        });
};

// Not really an RPC but thought it kind of belongs here
export const openEtherscan: (txn: string) => boolean = (txn) => {
    window.open(`https://kovan.etherscan.io/tx/${txn}`, '', 'noreferrer=true,noopener=true');
    return false;
};
