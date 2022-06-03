import { KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';
import { FarmConfig } from '~/types/staking';
import { StakingRewards__factory } from '~/types/staking/typechain/factories/StakingRewards__factory';

export const farmConfig: Record<KnownNetwork, FarmConfig> = {
    [NETWORKS.ARBITRUM_RINKEBY]: {
        poolFarms: [
            {
                address: '0x4cc6094D4fc54E06b04b90Ed2F680e3D2263FDE7', // 4L-BTC/USD+PPUSD
                pool: '0x2150D5fF4Fc13bf427183a97Dba7901Ce54471A8',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x714d243fEaFfF5599105B59cD58bcCACb5eECc21', // 4S-BTC/USD+PPUSD
                pool: '0x2150D5fF4Fc13bf427183a97Dba7901Ce54471A8',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x8df43395D8e01dDec63cfA584954C4201BfB103e', // 4L-ETH/USD+PPUSD
                pool: '0x7Ca9886f9972cBB6698251F65172BE912343aAe6',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x4E148b19d78F3EE4ffd443FCf3b8c7694F46d5C5', // 4S-ETH/USD+PPUSD
                pool: '0x7Ca9886f9972cBB6698251F65172BE912343aAe6',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x1d3ac3f2De105F831B4eBeA8987a5f58B26aBA40', // 3L-ETH/USD+PPUSD
                pool: '0x4022284C8aE79fe2aaeA2164aB1942e66D255bC8',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x63980B755bFE929a66605Ad527F5968A357EfC0F', // 3S-ETH/USD+PPUSD
                pool: '0x4022284C8aE79fe2aaeA2164aB1942e66D255bC8',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x950195d6aEc6f1d5AE493ce875FEF9535C31A298', // 3L-BTC/USD+PPUSD
                pool: '0x9726f3bDB63F5C8c98d698de2BB77e6Ee876b09B',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x13394f75C2701c55011FB25e008647D283DAAB6F', // 3S-BTC/USD+PPUSD
                pool: '0x9726f3bDB63F5C8c98d698de2BB77e6Ee876b09B',
                abi: StakingRewards__factory.abi,
            },
        ],
        sushiRouterAddress: '',
    },
    [NETWORKS.ARBITRUM]: {
        poolFarms: [
            // deprecated
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
            // active
            {
                address: '0x04Ff29F8F379B2AA7d79BA66Ce76649334D83e48', // 3L-BTC/USD+USDC
                pool: '0x3aca4F1B1791D00eBBAE01d65E9739c9C886F33C',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x16c457fC0F5d5981574ED2BaeD81c625BD91b633', // 3S-BTC/USD+USDC
                pool: '0x3aca4F1B1791D00eBBAE01d65E9739c9C886F33C',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x111278bf2CC2Fd862183CF34896c60DbbEA0706F', // 3L-ETH/USD+USDC
                pool: '0x8F4af5A3b58EA60e66690f30335Ed8586E46AcEb',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x489dA242a948d1978673FEF8836740c11732eC0B', // 3S-ETH/USD+USDC
                pool: '0x8F4af5A3b58EA60e66690f30335Ed8586E46AcEb',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x38B90a6268b1a20F7A7319D533bc9d31678Cd7d8', // 3L-WTI/USD+USDC
                pool: '0xa740b84Fd3547b9C445844c30A10Cde6dce3E08B',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x0dC23d133cAB52be60C905C24F21925dE6e67aA2', // 3S-WTI/USD+USDC
                pool: '0xa740b84Fd3547b9C445844c30A10Cde6dce3E08B',
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
