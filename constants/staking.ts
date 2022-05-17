import { KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';
import { FarmConfig } from '~/types/staking';
import { StakingRewards__factory } from '~/types/staking/typechain/factories/StakingRewards__factory';

export const TokenToFarmAddressMap: (tokenAddress: string | null) => string = (tokenAddress) => {
    switch (tokenAddress) {
        // 3 LONG BTC/USD
        case '0xEb05e160D3C1990719aa25d74294783fE4e3D3Ef':
            return '0xE211c6a34a6b04Df2D5fBCf3E66Fd57b9eD76e0d';
        // 3 SHORT BTC/USD
        case '0x02f9742f7CA51891d440084208c8e969D55b94A2':
            return '0x50041Fe576cEC7502eA97cE33627856299011Eb1';
        // 3 LONG ETH/USD
        case '0x989132f596Ff5F79fe3e52bbDdadACde6438bF06':
            return '0xbF3E2DbBF663b09EDCe8b774334fc408559846d0';
        // 3 SHORT ETH/USD
        case '0xe0258E0b32cD3840ef29789bcDA9C2BF996e2A40':
            return '0xf7824Fce8C155e74E87e9575c7084D0380B55BaF';
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
                address: '0xE211c6a34a6b04Df2D5fBCf3E66Fd57b9eD76e0d', // 3-BTC/USD-long-farm
                pool: '0xcf79A7Cff04C0c062E2AD8de406321737ec86Ed9',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x50041Fe576cEC7502eA97cE33627856299011Eb1', // 3-BTC/USDC-short-farm
                pool: '0xcf79A7Cff04C0c062E2AD8de406321737ec86Ed9',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0xbF3E2DbBF663b09EDCe8b774334fc408559846d0', // 3-ETH/USDC-long-farm
                pool: '0x299bEc969417567cE31127aD7d670f0d9760684D',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0xf7824Fce8C155e74E87e9575c7084D0380B55BaF', // 3-ETH/USDC-short-farm
                pool: '0x299bEc969417567cE31127aD7d670f0d9760684D',
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
