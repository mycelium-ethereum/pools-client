import { KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';
import { FarmConfig } from '~/types/staking';
import { StakingRewards__factory } from '~/types/staking/typechain/factories/StakingRewards__factory';

export const farmConfig: Record<KnownNetwork, FarmConfig> = {
    [NETWORKS.ARBITRUM_RINKEBY]: {
        poolFarms: [
            {
                address: '0xefD71C53282F29E8B6c7D8064a1Cd1de2E1C375d', // 4L-BTC/USD+PPUSD
                pool: '0x4146D18b82C9a9Eb02B1ffdf1331f9563eab8cDf',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x1F2A35FA2f4189670D0B4192e896c391DB3e308a', // 4S-BTC/USD+PPUSD
                pool: '0x4146D18b82C9a9Eb02B1ffdf1331f9563eab8cDf',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x966c0F7800eECf70f7425EC25f8fbD604dc5461a', // 4L-ETH/USD+PPUSD
                pool: '0x9FBc47E8be32991Aaf1c3E59d13eA9ca20897cef',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x03509F6d41735D93Ba9ee4a94D8F3b8C81666742', // 4S-ETH/USD+PPUSD
                pool: '0x9FBc47E8be32991Aaf1c3E59d13eA9ca20897cef',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0xc2feb6495087baf98f1a1A3b122e688513030206', // 3L-ETH/USD+PPUSD
                pool: '0xB5E515fcd57DA6BAc06b011057669C2e365A6959',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0xdD4bAD744E095C35a8c34157D08C8719A6a4c651', // 3S-ETH/USD+PPUSD
                pool: '0xB5E515fcd57DA6BAc06b011057669C2e365A6959',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x759eD7CBfB35E601227E5408a103C8BD0331cEbc', // 3L-BTC/USD+PPUSD
                pool: '0xF7844d494d16eAC8F576D014DC92D407f64a6F60',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x5573402AC9F00EE49815fe9aFfDce3c4ac1cffd6', // 3S-BTC/USD+PPUSD
                pool: '0xF7844d494d16eAC8F576D014DC92D407f64a6F60',
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
