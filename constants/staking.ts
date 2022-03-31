import { KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';
import { FarmConfig } from '~/types/staking';
import { StakingRewards__factory } from '~/types/staking/typechain/factories/StakingRewards__factory';

export const TokenToFarmAddressMap: (tokenAddress: string | null) => string = (tokenAddress) => {
    switch (tokenAddress) {
        // 1L-BTC/USD
        case '0x1616bF7bbd60E57f961E83A602B6b9Abb6E6CAFc':
            return '0xA2bACCD1AA980f80b37BC950CE3eE2d5816d7EC0';
        // 1S-BTC/USD
        case '0x052814194f459aF30EdB6a506eABFc85a4D99501':
            return '0xD04dDCAEca6bf283A430Cb9E847CEEd5Da419Fa0';
        // 3L-BTC/USD
        case '0x05A131B3Cd23Be0b4F7B274B3d237E73650e543d':
            return '0xEb05e160D3C1990719aa25d74294783fE4e3D3Ef';
        // 3S-BTC/USD
        case '0x85700dC0bfD128DD0e7B9eD38496A60baC698fc8':
            return '0xeA4FF5ED11F93AA0Ce7744B1D40093f52eA1cda8';
        // 1L-ETH/USD
        case '0x38c0a5443c7427e65A9Bf15AE746a28BB9a052cc':
            return '0xA18413dC5506A91138e0604C283E36B021b8849B';
        // 1S-ETH/USD
        case '0xf581571DBcCeD3A59AaaCbf90448E7B3E1704dcD':
            return '0x9769F208239C740cC40E9CB3427c34513213B83f';
        // 3L-ETH/USD
        case '0xaA846004Dc01b532B63FEaa0b7A0cB0990f19ED9':
            return '0x07cCcDC913bCbab246fC6E38E81b0C53AaB3De9b';
        // 3S-ETH/USD
        case '0x7d7E4f49a29dDA8b1eCDcf8a8bc85EdcB234E997':
            return '0xE1c9C69a26BD5c6E4b39E6870a4a2B01b4e033bC';
        default:
            return '';
    }
};

// the vault address is the same on all networks
const BALANCER_VAULT_ADDRESS = '0xBA12222222228d8Ba445958a75a0704d566BF2C8';

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
        bptFarms: [],
        balancerVaultAddress: BALANCER_VAULT_ADDRESS,
        sushiRouterAddress: '',
        knownUSDCPriceFeeds: {},
    },
    [NETWORKS.ARBITRUM]: {
        poolFarms: [
            {
                address: '0xA2bACCD1AA980f80b37BC950CE3eE2d5816d7EC0', // 1-BTC/USDC-long
                pool: '0x146808f54DB24Be2902CA9f595AD8f27f56B2E76',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0xD04dDCAEca6bf283A430Cb9E847CEEd5Da419Fa0', // 1-BTC/USDC-short
                pool: '0x146808f54DB24Be2902CA9f595AD8f27f56B2E76',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0xEb05e160D3C1990719aa25d74294783fE4e3D3Ef', // 3-BTC/USD-long
                pool: '0x70988060e1FD9bbD795CA097A09eA1539896Ff5D',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0xeA4FF5ED11F93AA0Ce7744B1D40093f52eA1cda8', // 3-BTC/USDC-short
                pool: '0x70988060e1FD9bbD795CA097A09eA1539896Ff5D',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0xA18413dC5506A91138e0604C283E36B021b8849B', // 1-ETH/USDC-long
                pool: '0x3A52aD74006D927e3471746D4EAC73c9366974Ee',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x9769F208239C740cC40E9CB3427c34513213B83f', // 1-ETH/USDC-short
                pool: '0x3A52aD74006D927e3471746D4EAC73c9366974Ee',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x07cCcDC913bCbab246fC6E38E81b0C53AaB3De9b', // 3-ETH/USDC-long
                pool: '0x54114e9e1eEf979070091186D7102805819e916B',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0xE1c9C69a26BD5c6E4b39E6870a4a2B01b4e033bC', // 3-ETH/USDC-short
                pool: '0x54114e9e1eEf979070091186D7102805819e916B',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x2c8373688d20b87e492F9860c7639997a0Cb968B', // 3-TOKE/USDC-long
                pool: '0xc11B9Dc0F566B5084FC48Be1F821a8298fc900bC',
                abi: StakingRewards__factory.abi,
                rewardsEnded: true,
            },
            {
                address: '0xaD27FD92C77331b4cD687556d581F72cA5342316', // 3-TOKE/USDC-short
                pool: '0xc11B9Dc0F566B5084FC48Be1F821a8298fc900bC',
                abi: StakingRewards__factory.abi,
                rewardsEnded: true,
            },
            {
                address: '0xC50712733C8acE3012Ab11F56BF232F8bFfAe7f2', // 3-LINK/USDC-long
                pool: '0x7b6FfAd58ce09f2a71c01e61F94b1592Bd641876',
                abi: StakingRewards__factory.abi,
                rewardsEnded: true,
            },
            {
                address: '0xA29fF864fE81ab9ff2c4737904eBB2f5e9Fa9D71', // 3-LINK/USDC-short
                pool: '0x7b6FfAd58ce09f2a71c01e61F94b1592Bd641876',
                abi: StakingRewards__factory.abi,
                rewardsEnded: true,
            },
            {
                address: '0xA9808Afc50e06877575d2Ff7ccc21bc55552Bcd1', // 3-AAVE/USD-long
                pool: '0x23a5744ebc353944a4d5baac177c16b199afa4ed',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x880e722a5996e7abaB4B8BbC77B9537205BDA1DE', // 3-AAVE/USD-short
                pool: '0x23a5744ebc353944a4d5baac177c16b199afa4ed',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x39723F758701E82D5Fbe8b3Bfd1a646d73f99793', // 1-EUR/USDC-long
                pool: '0x2C740EEe739098Ab8E90f5Af78ac1d07835d225B',
                abi: StakingRewards__factory.abi,
                rewardsEnded: true,
            },
            {
                address: '0x2E7584FCd6f909BFa7A21aEb1a4894674C16e4Cd', // 1-EUR/USDC-short
                pool: '0x2C740EEe739098Ab8E90f5Af78ac1d07835d225B',
                abi: StakingRewards__factory.abi,
                rewardsEnded: true,
            },
            {
                address: '0x44b42E7ef481F6d1ff8d0fd7BFF6b3C8bD25a581', // 3-EUR/USDC-long
                pool: '0xA45B53547EC002403531D453c118AC41c03B3346',
                abi: StakingRewards__factory.abi,
                rewardsEnded: true,
            },
            {
                address: '0x0450959a393c3D6E6E37b65A6e836F59C47E24D0', // 3-EUR/USDC-short
                pool: '0xA45B53547EC002403531D453c118AC41c03B3346',
                abi: StakingRewards__factory.abi,
                rewardsEnded: true,
            },
        ],
        bptFarms: [
            {
                // 50 wETH 33 3S-ETH 17 3L-ETH
                address: '0x06F0A46Ba44de4f5AA327237b0b3A1610f125d8f',
                balancerPoolId: '0x996616bde0cb4974e571f17d31c844da2bd177f8000100000000000000000018',
                pool: '0x54114e9e1eEf979070091186D7102805819e916B',
                abi: StakingRewards__factory.abi,
                link: 'https://arbitrum.balancer.fi/#/pool/0x996616bde0cb4974e571f17d31c844da2bd177f8000100000000000000000018',
            },
            {
                // 50 wBTC 33 3S-BTC 17 3L-BTC
                address: '0xdbEA4B2F086D0e7259Ff84d2A088896E8Adb79Cf',
                balancerPoolId: '0xcf3ae4b9235b1c203457e472a011c12c3a2fde93000100000000000000000019',
                pool: '0x70988060e1FD9bbD795CA097A09eA1539896Ff5D',
                abi: StakingRewards__factory.abi,
                link: 'https://arbitrum.balancer.fi/#/pool/0xcf3ae4b9235b1c203457e472a011c12c3a2fde93000100000000000000000019',
            },
            {
                // 33 1S-ETH 33 1L-ETH 33 USDC
                address: '0xBcA90fe2c8cc273Bb4ba1147FAdA3097f9316F9c',
                balancerPoolId: '0x6ee86e032173716a41818e6d6d320a752176d69700010000000000000000001c',
                pool: '0x3A52aD74006D927e3471746D4EAC73c9366974Ee',
                abi: StakingRewards__factory.abi,
                link: 'https://arbitrum.balancer.fi/#/pool/0x6ee86e032173716a41818e6d6d320a752176d69700010000000000000000001c',
            },
            {
                // 33 1S-BTC 33 1L-BTC 33 USDC
                address: '0xB8d52DE47a6C3a3A5679A72f2f7c05b30A9B5309',
                balancerPoolId: '0x17a35e3d578797e34131d10e66c11170848c6da100010000000000000000001d',
                pool: '0x146808f54DB24Be2902CA9f595AD8f27f56B2E76',
                abi: StakingRewards__factory.abi,
                link: 'https://arbitrum.balancer.fi/#/pool/0x17a35e3d578797e34131d10e66c11170848c6da100010000000000000000001d',
            },
        ],
        balancerVaultAddress: BALANCER_VAULT_ADDRESS,
        knownUSDCPriceFeeds: {
            // wBTC: BTC/USD
            '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f': '0x6ce185860a4963106506C203335A2910413708e9',
            // wETH: ETH/USD
            '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612',
        },
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
        bptFarms: [],
        balancerVaultAddress: BALANCER_VAULT_ADDRESS,
        sushiRouterAddress: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
        knownUSDCPriceFeeds: {},
    },
    [NETWORKS.RINKEBY]: {
        poolFarms: [],
        bptFarms: [],
        balancerVaultAddress: BALANCER_VAULT_ADDRESS,
        sushiRouterAddress: '',
        knownUSDCPriceFeeds: {},
    },
    [NETWORKS.KOVAN]: {
        poolFarms: [],
        bptFarms: [],
        balancerVaultAddress: BALANCER_VAULT_ADDRESS,
        sushiRouterAddress: '',
        knownUSDCPriceFeeds: {},
    },
};
