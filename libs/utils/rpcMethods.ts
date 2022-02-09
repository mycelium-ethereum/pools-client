import { tokenSymbolToLogoTicker } from '@components/General';
import { Network, networkConfig } from '@context/Web3Context/Web3Context.Config';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { calcBptTokenSpotPrice, KnownNetwork } from '@tracer-protocol/pools-js';

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

export const getBalancerPrices: (balancerInfo?: Network['balancerInfo']) => Promise<Record<string, BigNumber>> = async (
    balancerInfo,
) => {
    if (!balancerInfo) {
        return {};
    }

    const data = {
        query: `{
                leveragedPools: pools(where: {
                    address_in: ${JSON.stringify(balancerInfo.leveragedPools)}
                }) {
                    id
                    address
                    swapFee
                    tokens {
                        address
                        balance
                        decimals
                        weight
                        symbol
                    }
                },
                nonLeveragedPools: pools(where: {
                    address_in: ${JSON.stringify(balancerInfo.pools)}
                }) {
                    id
                    address
                    swapFee
                    tokens {
                        address
                        balance
                        decimals
                        weight
                        symbol
                    }
                },
                wPool: pools(where: {
                    address: "${balancerInfo.wPool}"
                }) {
                    id
                    address
                    swapFee
                    tokens {
                        address
                        balance
                        decimals
                        weight
                        symbol
                    }
                }

            }`,
    };

    const res = await fetch(balancerInfo.graphUri, {
        method: 'POST',
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .catch((err) => {
            console.error('Failed to fetch tokens from balancer graph', err);
            return {};
        });
    const tokenPrices: Record<string, BigNumber> = {};
    const getTokenPrices: (
        pools: {
            id: string;
            address: string;
            swapFee: string;
            tokens: {
                address: string;
                balance: string;
                decimals: string;
                weight: string; // decimal
                symbol: string;
            }[];
        }[],
        baseAssets: ('USDC' | 'WETH' | 'WBTC')[],
    ) => void = (pools, baseAssets) => {
        for (const pool of pools) {
            const baseAsset = pool.tokens.filter((token: any) => baseAssets.includes(token.symbol))[0];
            const poolTokens = pool.tokens.filter((token: any) => !baseAssets.includes(token.symbol));
            let baseBalance = new BigNumber(baseAsset.balance);
            if (baseAsset.symbol !== 'USDC') {
                baseBalance = baseBalance.times(tokenPrices[baseAsset.symbol]);
            }
            for (const token of poolTokens) {
                tokenPrices[token.symbol] = calcBptTokenSpotPrice(
                    {
                        balance: baseBalance,
                        weight: new BigNumber(baseAsset.weight),
                    },
                    {
                        balance: new BigNumber(token.balance),
                        weight: new BigNumber(token.weight),
                    },
                    new BigNumber(pool.swapFee),
                );
            }
        }
    };
    getTokenPrices(res.data.wPool, ['USDC']);
    getTokenPrices(res.data.nonLeveragedPools, ['USDC']);
    getTokenPrices(res.data.leveragedPools, ['WETH', 'WBTC']);
    return tokenPrices;
};
