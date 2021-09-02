import { PoolToken } from '@libs/types/General';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';
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

export const switchNetworks: (
    provider: ethers.providers.JsonRpcProvider | undefined,
    networkID: string,
) => Promise<boolean> = async (provider, networkID) => {
    const config = networkConfig[networkID];
    try {
        await provider?.send('wallet_switchEthereumChain', [
            {
                // @ts-ignore
                chainId: config.hex,
            },
        ]);
        return true;
    } catch (error) {
        // This error code indicates that the chain has not been added to MetaMask.
        console.error('failed to switch network', error);
        // @ts-ignore
        if (error?.code === 4902) {
            // unknown network
            try {
                await provider?.send('wallet_addEthereumChain', [
                    {
                        // @ts-ignore
                        chainId: config.hex,
                        chainName: config.name,
                        rpcUrls: [config.publicRPC],
                    },
                ]);
                return true;
            } catch (addError) {
                console.error('Failed to add ethereum chain', addError);
                return false;
            }
        }
    }
    return false;
};

// Not really an RPC but thought it kind of belongs here
export const openEtherscan: (txn: string) => boolean = (txn) => {
    window.open(`https://kovan.etherscan.io/tx/${txn}`, '', 'noreferrer=true,noopener=true');
    return false;
};
