import { AvailableNetwork } from '@context/Web3Context/Web3Context.Config';
import { StaticPoolInfo, StaticTokenInfo } from 'libs/types/General';
import BigNumber from 'bignumber.js';
import { ARBITRUM, ARBITRUM_RINKEBY } from '.';
import { tokenMap } from './tokenList';

export const ONE_HOUR = new BigNumber(3600); // seconds
const FIVE_MINUTES = new BigNumber(300); // seconds
const THIRTY_SECONDS = new BigNumber(30); // seconds

const USDC_TOKEN_DECIMALS = 6;
const TEST_TOKEN_DECIMALS = 18;

export const poolList: Record<AvailableNetwork, StaticPoolInfo[]> = {
    [ARBITRUM]: [
        {
            name: '1-BTC/USD',
            address: '0x146808f54DB24Be2902CA9f595AD8f27f56B2E76',
            leverage: 1,
            updateInterval: ONE_HOUR,
            frontRunningInterval: FIVE_MINUTES,
            keeper: '0x759E817F0C40B11C775d1071d466B5ff5c6ce28e',
            committer: {
                address: '0x539Bf88D729B65F8eC25896cFc7a5f44bbf1816b',
            },
            longToken: {
                name: '1L-BTC/USD',
                address: '0x1616bF7bbd60E57f961E83A602B6b9Abb6E6CAFc',
                symbol: '1L-BTC/USD',
                decimals: USDC_TOKEN_DECIMALS,
            },
            shortToken: {
                name: '1S-BTC/USD',
                address: '0x052814194f459aF30EdB6a506eABFc85a4D99501',
                symbol: '1S-BTC/USD',
                decimals: USDC_TOKEN_DECIMALS,
            },
            quoteToken: tokenMap[ARBITRUM].USDC,
        },
        {
            name: '3-BTC/USD',
            address: '0x70988060e1FD9bbD795CA097A09eA1539896Ff5D',
            leverage: 3,
            updateInterval: ONE_HOUR,
            frontRunningInterval: FIVE_MINUTES,
            keeper: '0x759E817F0C40B11C775d1071d466B5ff5c6ce28e',
            committer: {
                address: '0xFDE5D7B7596AF6aC5df7C56d76E14518A9F578dF',
            },
            longToken: {
                name: '3L-BTC/USD',
                address: '0x05A131B3Cd23Be0b4F7B274B3d237E73650e543d',
                symbol: '3L-BTC/USD',
                decimals: USDC_TOKEN_DECIMALS,
            },
            shortToken: {
                name: '3S-BTC/USD',
                address: '0x85700dC0bfD128DD0e7B9eD38496A60baC698fc8',
                symbol: '3S-BTC/USD',
                decimals: USDC_TOKEN_DECIMALS,
            },
            quoteToken: tokenMap[ARBITRUM].USDC,
        },
        {
            name: '1-ETH/USD',
            address: '0x3A52aD74006D927e3471746D4EAC73c9366974Ee',
            leverage: 1,
            updateInterval: ONE_HOUR,
            frontRunningInterval: FIVE_MINUTES,
            keeper: '0x759E817F0C40B11C775d1071d466B5ff5c6ce28e',
            committer: {
                address: '0x047Cd47925C2390ce26dDeB302b8b165d246d450',
            },
            longToken: {
                name: '1L-ETH/USD',
                address: '0x38c0a5443c7427e65A9Bf15AE746a28BB9a052cc',
                symbol: '1L-ETH/USD',
                decimals: USDC_TOKEN_DECIMALS,
            },
            shortToken: {
                name: '1S-ETH/USD',
                address: '0xf581571DBcCeD3A59AaaCbf90448E7B3E1704dcD',
                symbol: '1S-ETH/USD',
                decimals: USDC_TOKEN_DECIMALS,
            },
            quoteToken: tokenMap[ARBITRUM].USDC,
        },
        {
            name: '3-ETH/USD',
            address: '0x54114e9e1eEf979070091186D7102805819e916B',
            leverage: 3,
            updateInterval: ONE_HOUR,
            frontRunningInterval: FIVE_MINUTES,
            keeper: '0x759E817F0C40B11C775d1071d466B5ff5c6ce28e',
            committer: {
                address: '0x72c4e7Aa6c743DA4e690Fa7FA66904BC3f2C9C04',
            },
            longToken: {
                name: '3L-ETH/USD',
                address: '0xaA846004Dc01b532B63FEaa0b7A0cB0990f19ED9',
                symbol: '3L-ETH/USD',
                decimals: USDC_TOKEN_DECIMALS,
            },
            shortToken: {
                name: '3S-ETH/USD',
                address: '0x7d7E4f49a29dDA8b1eCDcf8a8bc85EdcB234E997',
                symbol: '3S-ETH/USD',
                decimals: USDC_TOKEN_DECIMALS,
            },
            quoteToken: tokenMap[ARBITRUM].USDC,
        },
        {
            name: '3-TOKE/USD',
            address: '0xc11B9Dc0F566B5084FC48Be1F821a8298fc900bC',
            leverage: 3,
            updateInterval: ONE_HOUR,
            frontRunningInterval: FIVE_MINUTES,
            keeper: '0x759E817F0C40B11C775d1071d466B5ff5c6ce28e',
            committer: {
                address: '0xb913D14B3a3bB1D06B2dB1Fd141f2432bB25F5F2',
            },
            longToken: {
                name: '3L-TOKE/USD',
                address: '0xCB78B42e374AB268B01336cE31C7ba329C1d4beC',
                symbol: '3L-TOKE/USD',
                decimals: USDC_TOKEN_DECIMALS,
            },
            shortToken: {
                name: '3S-TOKE/USD',
                address: '0x16cd57B7Cf7c0954878C254b2318676007DF2af3',
                symbol: '3S-TOKE/USD',
                decimals: USDC_TOKEN_DECIMALS,
            },
            quoteToken: tokenMap[ARBITRUM].USDC,
        },
        {
            name: '3-LINK/USD',
            address: '0x7b6FfAd58ce09f2a71c01e61F94b1592Bd641876',
            leverage: 3,
            updateInterval: ONE_HOUR,
            frontRunningInterval: FIVE_MINUTES,
            keeper: '0x759E817F0C40B11C775d1071d466B5ff5c6ce28e',
            committer: {
                address: '0x8186948382f67c7160Fc7b872688AdC293aDF789',
            },
            longToken: {
                name: '3L-LINK/USD',
                address: '0x9d6CCCb49Abd383C51079904e341cAb1d02d92c6',
                symbol: '3L-LINK/USD',
                decimals: USDC_TOKEN_DECIMALS,
            },
            shortToken: {
                name: '3S-LINK/USD',
                address: '0x6d3bED2465d8c5e3Ef7F8DDC2CD3f8b38E90EaA5',
                symbol: '3S-LINK/USD',
                decimals: USDC_TOKEN_DECIMALS,
            },
            quoteToken: tokenMap[ARBITRUM].USDC,
        },
        {
            name: '1-EUR/USD',
            address: '0x2C740EEe739098Ab8E90f5Af78ac1d07835d225B',
            leverage: 1,
            updateInterval: ONE_HOUR,
            frontRunningInterval: FIVE_MINUTES,
            keeper: '0x759E817F0C40B11C775d1071d466B5ff5c6ce28e',
            committer: {
                address: '0xb894D3775862FFdE084eD31f9e42388e592E3137',
            },
            longToken: {
                name: '1L-EUR/USD',
                address: '0x6F680d315545309307F42840b234412090C0bBe8',
                symbol: '1L-EUR/USD',
                decimals: USDC_TOKEN_DECIMALS,
            },
            shortToken: {
                name: '1S-EUR/USD',
                address: '0x7C5C24C5F3DbF4A99DDa5127D44e55b9a797eC4d',
                symbol: '1S-EUR/USD',
                decimals: USDC_TOKEN_DECIMALS,
            },
            quoteToken: tokenMap[ARBITRUM].USDC,
        },
        {
            name: '3-EUR/USD',
            address: '0xA45B53547EC002403531D453c118AC41c03B3346',
            leverage: 3,
            updateInterval: ONE_HOUR,
            frontRunningInterval: FIVE_MINUTES,
            keeper: '0x759E817F0C40B11C775d1071d466B5ff5c6ce28e',
            committer: {
                address: '0x149BDeAC3E90522D8043452910Ef41f7cb75E3f3',
            },
            longToken: {
                name: '3L-EUR/USD',
                address: '0x316C96E328071DC6403587c243130712A9D03fF3',
                symbol: '3L-EUR/USD',
                decimals: USDC_TOKEN_DECIMALS,
            },
            shortToken: {
                name: '3S-EUR/USD',
                address: '0xA8C483D29bFaD4Ea159C1a002f4769C33F808A1e',
                symbol: '3S-EUR/USD',
                decimals: USDC_TOKEN_DECIMALS,
            },
            quoteToken: tokenMap[ARBITRUM].USDC,
        },
        {
            name: '3-AAVE/USD',
            address: '0x23a5744ebc353944a4d5baac177c16b199afa4ed',
            leverage: 3,
            updateInterval: ONE_HOUR,
            frontRunningInterval: FIVE_MINUTES,
            keeper: '0x759E817F0C40B11C775d1071d466B5ff5c6ce28e',
            committer: {
                address: '0x993321599Fc9D0c5a496044308f16C70575DABBa',
            },
            longToken: {
                name: '3L-AAVE/USD',
                address: '0xd15239e444Ac687874fee8A415f8F59fd01E3E51', // TODO change to real
                symbol: '3L-AAVE/USD',
                decimals: tokenMap[ARBITRUM].FRAX.decimals,
            },
            shortToken: {
                name: '3S-AAVE/USD',
                address: '0x4eBA8B7B13C565041D74b92dCA6C9E4B8885B3cC', // TODO change to real
                symbol: '3S-AAVE/USD',
                decimals: tokenMap[ARBITRUM].FRAX.decimals,
            },
            quoteToken: tokenMap[ARBITRUM].FRAX,
        },
    ],
    [ARBITRUM_RINKEBY]: [
        {
            // 1x
            name: '1-BTC/USD',
            address: '0x62Ef3d4CA538C8f53182f5A73d71104Fc42Af5DC',
            leverage: 1,
            updateInterval: FIVE_MINUTES,
            frontRunningInterval: THIRTY_SECONDS,
            keeper: '0x4D14D788dAa9B3698F8da11e7095F1E674E8FF23',
            committer: {
                address: '0x50ffc9B16409c53245DC35889A7b3E0db2b2608d',
            },
            longToken: {
                name: '1L-BTC/USD',
                address: '0x6993Ef999453c069a47c9DE1d2d815F54eb43920',
                symbol: '1L-BTC/USD',
                decimals: tokenMap[ARBITRUM_RINKEBY].USDC.decimals,
            },
            shortToken: {
                name: '1S-BTC/USD',
                address: '0x7830d0458D7E43fcAab008C22FF8cCf85a61a820',
                symbol: '1S-BTC/USD',
                decimals: tokenMap[ARBITRUM_RINKEBY].USDC.decimals,
            },
            quoteToken: tokenMap[ARBITRUM_RINKEBY].USDC,
        },
        {
            // 3x
            name: '3-BTC/USD',
            address: '0x229bDEF4152aE45A6af5Dd3fa962f2B937e02F67',
            leverage: 3,
            updateInterval: FIVE_MINUTES,
            frontRunningInterval: THIRTY_SECONDS,
            keeper: '0x4D14D788dAa9B3698F8da11e7095F1E674E8FF23',
            committer: {
                address: '0x5049487054435EE4CdF19991AB0341CFcB8CD33C',
            },
            longToken: {
                name: '3L-BTC/USD',
                address: '0x7Bf89A31758B5044999Ef7b557A05d5b71aDb976',
                symbol: '3L-BTC/USD',
                decimals: tokenMap[ARBITRUM_RINKEBY].USDC.decimals,
            },
            shortToken: {
                name: '3S-BTC/USD',
                address: '0x4093a7e0082E43BE8CaA0f74D9FA99c79c626feD',
                symbol: '3S-BTC/USD',
                decimals: tokenMap[ARBITRUM_RINKEBY].USDC.decimals,
            },
            quoteToken: tokenMap[ARBITRUM_RINKEBY].USDC,
        },
        {
            // 1x
            name: '1-ETH/USD',
            address: '0x986128171f14640Bde21f99537a04473456D9a05',
            leverage: 1,
            updateInterval: FIVE_MINUTES,
            frontRunningInterval: THIRTY_SECONDS,
            keeper: '0x4D14D788dAa9B3698F8da11e7095F1E674E8FF23',
            committer: {
                address: '0xe6979038eC3237039DC6BBa2C1B24933599089a3',
            },
            longToken: {
                name: '1L-ETH/USD',
                address: '0x6a5240fE1e4AE5BAd1ED1e4E546a1e3f264fFCE2',
                symbol: '1L-ETH/USD',
                decimals: tokenMap[ARBITRUM_RINKEBY].USDC.decimals,
            },
            shortToken: {
                name: '1S-ETH/USD',
                address: '0x9B00465EE7b74827Ef3cFff8E81ABdEd8c5Df411',
                symbol: '1S-ETH/USD',
                decimals: tokenMap[ARBITRUM_RINKEBY].USDC.decimals,
            },
            quoteToken: tokenMap[ARBITRUM_RINKEBY].USDC,
        },
        {
            // 3x
            name: '3-ETH/USD',
            address: '0xD9279c1962B0fce74A193BeE04d2Dfd1c7d953c6',
            leverage: 3,
            updateInterval: FIVE_MINUTES,
            frontRunningInterval: THIRTY_SECONDS,
            keeper: '0x4D14D788dAa9B3698F8da11e7095F1E674E8FF23',
            committer: {
                address: '0x672793dbB8866Ac6B19998aA64266bb9F6DfC393',
            },
            longToken: {
                name: '3L-ETH/USD',
                address: '0x1Af4C1296B524337e4B297eB8C546f469f2Dea80',
                symbol: '3L-ETH/USD',
                decimals: TEST_TOKEN_DECIMALS,
            },
            shortToken: {
                name: '3S-ETH/USD',
                address: '0x781a645a6cD0cbF85574e8aa3E770E4B265E5673',
                symbol: '3S-ETH/USD',
                decimals: TEST_TOKEN_DECIMALS,
            },
            quoteToken: tokenMap[ARBITRUM_RINKEBY].USDC,
        },
        {
            // 3x
            name: '3-ETH/USD-SMA',
            address: '0xad803ED3dC06886d96Cc397B33C683E18bF9CF46',
            leverage: 3,
            updateInterval: FIVE_MINUTES,
            frontRunningInterval: THIRTY_SECONDS,
            keeper: '0x4D14D788dAa9B3698F8da11e7095F1E674E8FF23',
            committer: {
                address: '0xd610648503E614E3FaCbF9e3a17902176c43de28',
            },
            longToken: {
                name: '3L-ETH/USD',
                address: '0x3cC0520263B526Bb7C207027B4ACEe25D3F221fB',
                symbol: '3L-ETH/USD',
                decimals: TEST_TOKEN_DECIMALS,
            },
            shortToken: {
                name: '3S-ETH/USD',
                address: '0x6afeA0aC6594f61AE58B30274afeCf7c618924A1',
                symbol: '3S-ETH/USD',
                decimals: TEST_TOKEN_DECIMALS,
            },
            quoteToken: tokenMap[ARBITRUM_RINKEBY].USDC,
        },
    ],
    '0': [],
    '1': [],
    '4': [],
    '1337': [],
};

// construct pool map so it is easier to access specific pools
export const poolMap = Object.assign(
    {},
    ...Object.keys(poolList).map((key) => ({
        [key]: Object.assign(
            {},
            ...poolList[key as AvailableNetwork].map((poolInfo) => ({
                [poolInfo.address]: {
                    ...poolInfo,
                },
            })),
        ),
    })),
);

// construct token list from the assets listed within the poolsList
export const poolTokenList: Record<AvailableNetwork, Record<string, StaticTokenInfo>> = Object.assign(
    {},
    ...Object.keys(poolList).map((key) => ({
        [key]: Object.assign(
            {},
            ...poolList[key as AvailableNetwork].map((poolInfo) => ({
                [poolInfo.shortToken.address]: {
                    ...poolInfo.shortToken,
                },
                [poolInfo.longToken.address]: {
                    ...poolInfo.longToken,
                },
            })),
        ),
    })),
);
