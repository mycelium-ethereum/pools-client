import { tokenSymbolToLogoTicker } from '@components/General';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { calcBptTokenSpotPrice } from '@tracer-protocol/tracer-pools-utils';

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
) => Promise<boolean> = (provider, token) => {
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

export enum ArbiscanEnum {
    txn = 0,
    token = 1,
}
// Not really an RPC but thought it kind of belongs here
export const openArbiscan: (type: ArbiscanEnum, taraget: string) => boolean = (type, target) => {
    switch (type) {
        case ArbiscanEnum.txn:
            window.open(`https://arbiscan.io/tx/${target}`, '', 'noreferrer=true,noopener=true');
            break;
        case ArbiscanEnum.token:
            window.open(`https://arbiscan.io/token/${target}`, '', 'noreferrer=true,noopener=true');
            break;
        default: //nothing
    }
    return false;
};


export const getBalancerPrices: () => Promise<Record<string, BigNumber>> = async () => {
    // 1-BTC/USD and 1-ETH/USD
    const pools = ["0x6ee86e032173716a41818e6d6d320a752176d697", "0x17a35e3d578797e34131d10e66c11170848c6da1"];
    // 3-BTC/USD and 3-ETH/USD
    const leveragedPools = ["0xcf3ae4b9235b1c203457e472a011c12c3a2fde93", "0x996616bde0cb4974e571f17d31c844da2bd177f8"];
    // wETH wBTC USDC pool
    const wPool = "0x64541216bafffeec8ea535bb71fbc927831d0595";

    var data = {
            query: `{
                leveragedPools: pools(where: { 
                    address_in: ${JSON.stringify(leveragedPools)}
                }) {
                    id
                    address
                    tokens {
                        address
                        balance
                        decimals
                        weight
                        symbol
                    }
                },
                nonLeveragedPools: pools(where: { 
                    address_in: ${JSON.stringify(pools)}
                }) {
                    id
                    address
                    tokens {
                        address
                        balance
                        decimals
                        weight
                        symbol
                    }
                },
                wPool: pools(where: {
                    address: "${wPool}"
                }) {
                    id
                    address
                    tokens {
                        address
                        balance
                        decimals
                        weight
                        symbol
                    }
                }

            }`
    };
    const url = "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-arbitrum-v2";
    return fetch(url, {
        "method" : "POST",
        body : JSON.stringify(data) 
    })
    .then(res => res.json())
    .then((res) => {
        const tokenPrices: Record<string, BigNumber> = {};
        const getTokenPrices: (pools: {
            id: string,
            address: string,
            tokens: {
                address: string,
                balance: string,
                decimals: string,
                weight: string, // decimal
                symbol: string,
            }[]
        }[], baseAssets: ('USDC' | 'WETH' | 'WBTC')[]) => void = (pools, baseAssets) => {
            for (const pool of pools) {
                const baseAsset = pool.tokens.filter((token: any) => baseAssets.includes(token.symbol))[0]
                const poolTokens = pool.tokens.filter((token: any) => !baseAssets.includes(token.symbol))
                let baseBalance = new BigNumber(baseAsset.balance);
                if (baseAsset.symbol !== 'USDC') {
                    baseBalance = baseBalance.times(tokenPrices[baseAsset.symbol])
                }
                for (let token of poolTokens) {
                    tokenPrices[token.symbol] = calcBptTokenSpotPrice({
                        balance: baseBalance,
                        weight: new BigNumber(baseAsset.weight)
                    }, {
                        balance: new BigNumber(token.balance),
                        weight: new BigNumber(token.weight)
                    })
                }
            }
        }
        getTokenPrices(res.data.wPool, ['USDC']);
        getTokenPrices(res.data.nonLeveragedPools, ['USDC']);
        getTokenPrices(res.data.leveragedPools, ['WETH', 'WBTC']);

        return tokenPrices;
    }).catch((err) => {
        console.error('Failed to fetch tokens from balancer graph', err)
        return {};
    })
}