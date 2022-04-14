import { KnownNetwork } from '@tracer-protocol/pools-js';
import { tokenSymbolToLogoTicker } from '~/components/General';
import { networkConfig } from '~/constants/networks';
import { Web3Aware } from './BaseClasses';

const tokenImagesRootUrl = 'https://raw.githubusercontent.com/dospore/tracer-balancer-token-list/master/assets';

export class Web3Service extends Web3Aware {
    /**
     * Adds a token asset to the users wallet watch
     * @param provider ethereum provider
     * @param token token to add
     * @returns true if success and false otherwise
     */
    async watchAsset(token: { address: string; symbol: string; decimals: number }): Promise<boolean> {
        if (!this.provider) {
            return false;
        }

        return this.provider
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
    }

    async switchNetworks(network: KnownNetwork): Promise<boolean> {
        const config = networkConfig[network];
        try {
            await this.provider?.send('wallet_switchEthereumChain', [
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
                    await this.provider?.send('wallet_addEthereumChain', [
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
    }
}
export const web3Service = new Web3Service();
