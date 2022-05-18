import { KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';
import { FarmConfig } from '~/types/staking';
import { StakingRewards__factory } from '~/types/staking/typechain/factories/StakingRewards__factory';

export const TokenToFarmAddressMap: (tokenAddress: string | null) => string = (tokenAddress) => {
    switch (tokenAddress) {
        // 3 LONG BTC/USD
        case '0x2Dc6B0D6580f3E2d6107D41A6ada0d8c6c605F88':
            return '0xcD8c0662cf72512857e98646b5C8363782c137A7';
        // 3 SHORT BTC/USD
        case '0x00F70af6D1148E3127DB138ce633895e5eF6Bdb2':
            return '0x046B21659C445f43f2c621c874F79868dC6FA159';
        // 3 LONG ETH/USD
        case '0x44822C092C5ece611830DC0e1B86E80645749ae8':
            return '0xC21159bF0252A37b0c281DF2D9B723120cAa86c7';
        // 3 SHORT ETH/USD
        case '0x466598c279C2e2B7c7f2cd591Ac539720A205582':
            return '0x224949832f3dbf9a365D9bA3ec504727a103E96E';
        default:
            return '';
    }
};

export const farmConfig: Record<KnownNetwork, FarmConfig> = {
    [NETWORKS.ARBITRUM_RINKEBY]: {
        poolFarms: [
            {
                address: '0xa39fA0857D5967E6Ab3A247b179C474cFE5415A9',
                pool: '',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x6213c21518EF9d4875d9C41F7ad8d16B4f986cB2',
                pool: '',
                abi: StakingRewards__factory.abi,
            },
        ],
        sushiRouterAddress: '',
    },
    [NETWORKS.ARBITRUM]: {
        poolFarms: [
            {
                address: '0xcD8c0662cf72512857e98646b5C8363782c137A7', // 3-BTC/USD-long-farm
                pool: '0x6D3Fb4AA7ddCa8CBc88F7BA94B36ba83fF6bA234',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x046B21659C445f43f2c621c874F79868dC6FA159', // 3-BTC/USDC-short-farm
                pool: '0x6D3Fb4AA7ddCa8CBc88F7BA94B36ba83fF6bA234',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0xC21159bF0252A37b0c281DF2D9B723120cAa86c7', // 3-ETH/USDC-long-farm
                pool: '0x3C16b9efE5E4Fc0ec3963F17c64a3dcBF7269207',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x224949832f3dbf9a365D9bA3ec504727a103E96E', // 3-ETH/USDC-short-farm
                pool: '0x3C16b9efE5E4Fc0ec3963F17c64a3dcBF7269207',
                abi: StakingRewards__factory.abi,
            },
        ],
        sushiRouterAddress: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
        stakingRewardTokens: {
            fxs: {
                address: '0x9d2f299715d94d8a7e6f5eaa8e654e8c74a988a7',
                decimals: 18,
            },
        },
    },
    [NETWORKS.MAINNET]: {
        poolFarms: [],
        sushiRouterAddress: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
    },
    [NETWORKS.RINKEBY]: {
        poolFarms: [],
        sushiRouterAddress: '',
    },
    [NETWORKS.KOVAN]: {
        poolFarms: [],
        sushiRouterAddress: '',
    },
};
