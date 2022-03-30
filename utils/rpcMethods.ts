import { tokenSymbolToLogoTicker } from '@components/General';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';
import { ethers } from 'ethers';
import { KnownNetwork } from '@tracer-protocol/pools-js';

const tokenImagesRootUrl = 'http://ipfs.io/ipfs/QmaKrQSyTSdcmikLHdtKHp6tn3pT3Gcnu2BWziN97Fscrd';
/**
 * Adds a token asset to the users wallet watch
 * @param provider ethereum provider
 * @param token token to add
 * @returns true if success and false otherwise
 */
export const watchAsset: (
    provider: ethers.providers.JsonRpcProvider | null,
    token: {
        address: string;
        symbol: string;
        decimals: number;
    },
) => Promise<boolean> = async (provider, token) => {
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
                symbol: token.symbol,
                decimals: token.decimals,
                image: `${tokenImagesRootUrl}/${tokenSymbolToLogoTicker(token.symbol)}.svg`,
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

export enum ArbiscanEnum {
    txn = 0,
    token = 1,
}

// Not really an RPC but thought it kind of belongs here
export const openArbiscan: (type: ArbiscanEnum, taraget: string, network: KnownNetwork | undefined) => boolean = (
    type,
    target,
    network,
) => {
    const base = !!network ? networkConfig[network]?.previewUrl : 'https://arbiscan.io';
    switch (type) {
        case ArbiscanEnum.txn:
            window.open(`${base}/tx/${target}`, '', 'noreferrer=true,noopener=true');
            break;
        case ArbiscanEnum.token:
            window.open(`${base}/token/${target}`, '', 'noreferrer=true,noopener=true');
            break;
        default: //nothing
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
