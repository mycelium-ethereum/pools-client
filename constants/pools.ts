import { BigNumber } from 'bignumber.js';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { NETWORKS } from '@tracer-protocol/pools-js';
import Pool from '@tracer-protocol/pools-js/entities/pool';
import { PoolInfo, PoolStatus } from '~/types/pools';

const TRACER_API = process.env.NEXT_PUBLIC_TRACER_API;

export const DEFAULT_POOLSTATE: PoolInfo = {
    poolInstance: Pool.CreateDefault(),
    poolStatus: PoolStatus.Live,
    userBalances: {
        shortToken: {
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
        },
        longToken: {
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
        },
        settlementToken: {
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
        },
        aggregateBalances: {
            longTokens: new BigNumber(0),
            shortTokens: new BigNumber(0),
            settlementTokens: new BigNumber(0),
        },
        tradeStats: {
            avgLongEntryPriceWallet: new BigNumber(0),
            avgShortEntryPriceWallet: new BigNumber(0),
            avgLongEntryPriceAggregate: new BigNumber(0),
            avgShortEntryPriceAggregate: new BigNumber(0),
            avgLongExitPriceWallet: new BigNumber(0),
            avgShortExitPriceWallet: new BigNumber(0),
            avgLongExitPriceAggregate: new BigNumber(0),
            avgShortExitPriceAggregate: new BigNumber(0),
            totalLongTokensMinted: new BigNumber(0),
            totalLongMintSpend: new BigNumber(0),
            totalShortTokensMinted: new BigNumber(0),
            totalShortMintSpend: new BigNumber(0),
            totalLongTokensBurned: new BigNumber(0),
            totalLongBurnReceived: new BigNumber(0),
            totalShortTokensBurned: new BigNumber(0),
            totalShortBurnReceived: new BigNumber(0),
            totalLongBurns: 0,
            totalLongMints: 0,
            totalShortBurns: 0,
            totalShortMints: 0,
        },
    },
    upkeepInfo: {
        isWaitingForUpkeep: false,
        expectedExecution: Math.floor(Date.now() / 1000),
    },
    poolCommitStats: {
        oneDayVolume: new BigNumber(0),
    },
    balancerPrices: {
        longToken: new BigNumber(0),
        shortToken: new BigNumber(0),
    },
    nextPoolState: {
        currentSkew: new BigNumber(0),
        currentLongBalance: new BigNumber(0),
        currentLongSupply: new BigNumber(0),
        currentShortBalance: new BigNumber(0),
        currentShortSupply: new BigNumber(0),
        currentLongTokenPrice: new BigNumber(1),
        currentShortTokenPrice: new BigNumber(1),
        currentPendingLongTokenBurn: new BigNumber(0),
        currentPendingShortTokenBurn: new BigNumber(0),
        expectedSkew: new BigNumber(0),
        expectedLongBalance: new BigNumber(0),
        expectedLongSupply: new BigNumber(0),
        expectedShortBalance: new BigNumber(0),
        expectedShortSupply: new BigNumber(0),
        expectedLongTokenPrice: new BigNumber(1),
        expectedShortTokenPrice: new BigNumber(1),
        expectedPendingLongTokenBurn: new BigNumber(0),
        expectedPendingShortTokenBurn: new BigNumber(0),
        lastOraclePrice: new BigNumber(0),
        expectedOraclePrice: new BigNumber(0),
        expectedFrontRunningSkew: new BigNumber(0),
        expectedFrontRunningLongBalance: new BigNumber(0),
        expectedFrontRunningLongSupply: new BigNumber(0),
        expectedFrontRunningShortBalance: new BigNumber(0),
        expectedFrontRunningShortSupply: new BigNumber(0),
        totalNetFrontRunningPendingLong: new BigNumber(0),
        totalNetFrontRunningPendingShort: new BigNumber(0),
        expectedFrontRunningLongTokenPrice: new BigNumber(0),
        expectedFrontRunningShortTokenPrice: new BigNumber(0),
        expectedFrontRunningPendingLongTokenBurn: new BigNumber(0),
        expectedFrontRunningPendingShortTokenBurn: new BigNumber(0),
        expectedFrontRunningOraclePrice: new BigNumber(0),
    },
    oracleDetails: {
        type: 'SMA',
        updateInterval: 0,
        numPeriods: 0,
        isLoading: true,
    },
};

export interface PoolListMap {
    Tracer: {
        verified: string;
        unverified: string;
        factoryDeployed?: string;
    };
    External: string[];
}

type TokenListMapByNetwork = Partial<Record<KnownNetwork, PoolListMap>>;

/**
 * Mapping of the TokenLists used on each network
 */
export const POOL_LIST_MAP: TokenListMapByNetwork = {
    [NETWORKS.ARBITRUM]: {
        Tracer: {
            verified: `${TRACER_API}/poolsv2/poolList?network=42161&list=verified`,
            unverified: `${TRACER_API}/poolsv2/poolList?network=42161&list=unverified`,
        },
        External: [],
    },
    [NETWORKS.ARBITRUM_RINKEBY]: {
        Tracer: {
            verified: `${TRACER_API}/poolsv2/poolList?network=421611&list=verified`,
            unverified: `${TRACER_API}/poolsv2/poolList?network=421611&list=unverified`,
        },
        External: [],
    },
};

export const TCR_DECIMALS = 18;
export const USDC_DECIMALS = 6;

export const KnownShortenedPoolTokenSymbols: Record<string, string> = {
    '3L-ETH/USD+USDC': '3L-ETH+USDC',
    '3S-ETH/USD+USDC': '3S-ETH+USDC',
    '3L-BTC/USD+USDC': '3L-BTC+USDC',
    '3S-BTC/USD+USDC': '3S-BTC+USDC',
    '3L-XAU/USD+USDC': '3L-XAU+USDC',
    '3S-XAU/USD+USDC': '3S-XAU+USDC',
    '3L-WTI/USD+USDC': '3L-WTI+USDC',
    '3S-WTI/USD+USDC': '3S-WTI+USDC',
    '3L-ETH/USD+gOHM': '3L-ETH+gOHM',
    '3S-ETH/USD+gOHM': '3S-ETH+gOHM',
    '3L-(AVAX+BNB+SOL)/USD+USDC': '3L-ethkilla',
    '3S-(AVAX+BNB+SOL)/USD+USDC': '3S-ethkilla',
    '15L-ETHMCAP/BTCMCAP+USDC': '15L-FLIPPEN',
    '15S-ETHMCAP/BTCMCAP+USDC': '15S-FLIPPEN',
    '5L-PUNK/ETH+wETH': '5L-PUNK/ETH',
    '5S-PUNK/ETH+wETH': '5S-PUNK/ETH',
    '3S-BTC/USD+USDC-12h': '3S-BTC-12h',
    '3L-BTC/USD+USDC-12h': '3L-BTC-12h',
    '1L-TRUFLATION/USD+USDC': '1L-TRUFLATION',
    '1S-TRUFLATION/USD+USDC': '1S-TRUFLATION',
};
