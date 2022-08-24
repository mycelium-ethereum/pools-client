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
            // active (paid in MYC)
            {
                address: '0x574375868F76F49a9EeEb6A5720b984298C216BE', // 3-BTC/USD+USDC Balancer LP
                pool: '0x3aca4F1B1791D00eBBAE01d65E9739c9C886F33C',
                abi: StakingRewards__factory.abi,
                isBPTFarm: true,
                balancerPoolId: '0x045c5480131eef51aa1a74f34e62e7de23136f2400010000000000000000009a',
                link: 'https://arbitrum.balancer.fi/#/pool/0x045c5480131eef51aa1a74f34e62e7de23136f2400010000000000000000009a',
            },
            {
                address: '0x5fD3fa0204aE9fd974F19430D8eA6bbbC7deb3d6', // 3L-BTC/USD+USDC
                pool: '0x3aca4F1B1791D00eBBAE01d65E9739c9C886F33C',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x10260CF26c68dF40017D5E488dc633F1642f2A38', // 3S-BTC/USD+USDC
                pool: '0x3aca4F1B1791D00eBBAE01d65E9739c9C886F33C',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x2F09D08167AD714D48dE65fA8C75Fe19388f87c9', // 3-ETH/USD+USDC Balancer LP
                pool: '0x8F4af5A3b58EA60e66690f30335Ed8586E46AcEb',
                abi: StakingRewards__factory.abi,
                isBPTFarm: true,
                balancerPoolId: '0x59b7867f6b127070378feeb328e2ffe6aab6752500010000000000000000009b',
                link: 'https://arbitrum.balancer.fi/#/pool/0x59b7867f6b127070378feeb328e2ffe6aab6752500010000000000000000009b',
            },
            {
                address: '0xa9234dE71cB19B3217457fC2A3DF14BcA4837fa8', // 3L-ETH/USD+USDC
                pool: '0x8F4af5A3b58EA60e66690f30335Ed8586E46AcEb',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0xe01b6Ba1e64ACE0298F2E55152c7153b015b3D1c', // 3S-ETH/USD+USDC
                pool: '0x8F4af5A3b58EA60e66690f30335Ed8586E46AcEb',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x9c2e161d00ABF3e7fdFd50197B778C681117c45D', // 3-BTC/USD+USDC-12h Balancer LP
                pool: '0x2bfb8aeE6EB2dcCd694f8eCB4C31FdeBfC22b55a',
                abi: StakingRewards__factory.abi,
                isBPTFarm: true,
                balancerPoolId: '0xc999678122cbf8a30cb72c53d4bdd72abd96af880001000000000000000000b4',
                link: 'https://arbitrum.balancer.fi/#/pool/0xc999678122cbf8a30cb72c53d4bdd72abd96af880001000000000000000000b4',
                name: '3-BTC/USD+USDC-12h',
            },
            {
                address: '0xb22E2234d1fD6F9Cd5800039710668Eb602300d4', // 3L-BTC/USD+USDC-12h
                pool: '0x2bfb8aeE6EB2dcCd694f8eCB4C31FdeBfC22b55a',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x681E1B823292743F0A3dC1cE1e572c16225a1c23', // 3S-BTC/USD+USDC-12h
                pool: '0x2bfb8aeE6EB2dcCd694f8eCB4C31FdeBfC22b55a',
                abi: StakingRewards__factory.abi,
            },
            // ended (paid in TCR)
            {
                address: '0x93116d661DaCaA8Ff65Cb5420Ef61425322AEA7f', // 3-BTC/USD+USDC Balancer LP
                pool: '0x3aca4F1B1791D00eBBAE01d65E9739c9C886F33C',
                abi: StakingRewards__factory.abi,
                isBPTFarm: true,
                rewardsEnded: true,
                balancerPoolId: '0x045c5480131eef51aa1a74f34e62e7de23136f2400010000000000000000009a',
                link: 'https://arbitrum.balancer.fi/#/pool/0x045c5480131eef51aa1a74f34e62e7de23136f2400010000000000000000009a',
            },
            {
                address: '0x04Ff29F8F379B2AA7d79BA66Ce76649334D83e48', // 3L-BTC/USD+USDC
                pool: '0x3aca4F1B1791D00eBBAE01d65E9739c9C886F33C',
                rewardsEnded: true,
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x16c457fC0F5d5981574ED2BaeD81c625BD91b633', // 3S-BTC/USD+USDC
                pool: '0x3aca4F1B1791D00eBBAE01d65E9739c9C886F33C',
                rewardsEnded: true,
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x906c81a761d60AcaCAe85165d67031E9F7E3CEa9', // 3-ETH/USD+USDC Balancer LP
                pool: '0x8F4af5A3b58EA60e66690f30335Ed8586E46AcEb',
                abi: StakingRewards__factory.abi,
                isBPTFarm: true,
                rewardsEnded: true,
                balancerPoolId: '0x59b7867f6b127070378feeb328e2ffe6aab6752500010000000000000000009b',
                link: 'https://arbitrum.balancer.fi/#/pool/0x59b7867f6b127070378feeb328e2ffe6aab6752500010000000000000000009b',
            },
            {
                address: '0x111278bf2CC2Fd862183CF34896c60DbbEA0706F', // 3L-ETH/USD+USDC
                pool: '0x8F4af5A3b58EA60e66690f30335Ed8586E46AcEb',
                rewardsEnded: true,
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x489dA242a948d1978673FEF8836740c11732eC0B', // 3S-ETH/USD+USDC
                pool: '0x8F4af5A3b58EA60e66690f30335Ed8586E46AcEb',
                abi: StakingRewards__factory.abi,
                rewardsEnded: true,
            },
            {
                address: '0x6d52d4C087DD8a167eCA0008fb4c69D99169DcE8', // 3-BTC/USD+USDC-12h Balancer LP
                pool: '0x2bfb8aeE6EB2dcCd694f8eCB4C31FdeBfC22b55a',
                abi: StakingRewards__factory.abi,
                isBPTFarm: true,
                rewardsEnded: true,
                balancerPoolId: '0xc999678122cbf8a30cb72c53d4bdd72abd96af880001000000000000000000b4',
                link: 'https://arbitrum.balancer.fi/#/pool/0xc999678122cbf8a30cb72c53d4bdd72abd96af880001000000000000000000b4',
                name: '3-BTC/USD+USDC-12h',
            },
            {
                address: '0x3004CC46432522B0AeA30d16aF769B1727aA0c26', // 3L-BTC/USD+USDC-12h
                pool: '0x2bfb8aeE6EB2dcCd694f8eCB4C31FdeBfC22b55a',
                abi: StakingRewards__factory.abi,
                rewardsEnded: true,
            },
            {
                address: '0x0896Fd59b574f536751c82B8Dd9fd9466af009aC', // 3S-BTC/USD+USDC-12h
                pool: '0x2bfb8aeE6EB2dcCd694f8eCB4C31FdeBfC22b55a',
                abi: StakingRewards__factory.abi,
                rewardsEnded: true,
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
