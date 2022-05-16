import { ethers } from 'ethers';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { tokenSymbolToLogoTicker } from '~/components/General';
import { networkConfig } from '~/constants/networks';
import { getShortenedSymbol } from './poolNames';

const tokenImagesRootUrl = 'https://raw.githubusercontent.com/dospore/tracer-balancer-token-list/master/assets';
/**
 * Adds a token asset to the users wallet watch
 * @param provider ethereum provider
 * @param token token to add
 * @returns true if success and false otherwise
 */
export const watchAsset: (
    provider: ethers.providers.JsonRpcProvider | null | undefined,
    token: {
        address: string;
        symbol: string;
        decimals: number;
    },
) => Promise<boolean> = async (provider, token) => {
    if (!provider) {
        return new Promise(() => false);
    }

    const shortenedTokenSymbol = getShortenedSymbol(token.symbol);

    return provider
        ?.send('wallet_watchAsset', {
            // @ts-ignore
            type: 'ERC20',
            options: {
                type: 'ERC20',
                address: token.address,
                symbol: shortenedTokenSymbol,
                decimals: token.decimals,
                image: `${tokenImagesRootUrl}/${tokenSymbolToLogoTicker(shortenedTokenSymbol)}.svg`,
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
    networkID: KnownNetwork,
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
                        blockExplorerUrls: [config.previewUrl],
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

export function isAddress(value: string): boolean {
    try {
        return !!ethers.utils.getAddress(value);
    } catch {
        return false;
    }
}
