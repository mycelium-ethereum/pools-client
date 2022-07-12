import { ethers, BigNumber as EthersBigNumber } from 'ethers';
import BigNumber from 'bignumber.js';
import { PoolCommitter__factory, ERC20__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
import { BalanceTypeEnum, KnownNetwork, Pool } from '@tracer-protocol/pools-js';
import { AggregateBalances, TradeStats, PoolInfo } from '~/types/pools';
import { NextPoolState } from '~/types/pools';
import { formatSeconds } from './converters';
import { BNFromString } from './helpers';
import { fetchTradeStats as _fetchTradeStats, fetchNextPoolState as _fetchNextPoolState } from './tracerAPI';

export const fetchTokenBalances: (
    tokens: string[],
    provider: ethers.providers.JsonRpcProvider,
    account: string,
) => Promise<EthersBigNumber[]> = (tokens, provider, account) => {
    return Promise.all(
        tokens.map((token) => {
            const tokenContract = ERC20__factory.connect(token, provider);
            return tokenContract.balanceOf(account, {
                blockTag: 'latest',
            });
        }),
    );
};

export const fetchAggregateBalance: (
    provider: ethers.providers.JsonRpcProvider,
    account: string,
    committer: string,
    settlementTokenDecimals: number,
) => Promise<AggregateBalances> = async (provider, account, committer, settlementTokenDecimals) => {
    const contract = PoolCommitter__factory.connect(committer, provider);
    const balances = await contract.getAggregateBalance(account);

    return {
        longTokens: new BigNumber(ethers.utils.formatUnits(balances.longTokens, settlementTokenDecimals)),
        shortTokens: new BigNumber(ethers.utils.formatUnits(balances.shortTokens, settlementTokenDecimals)),
        settlementTokens: new BigNumber(ethers.utils.formatUnits(balances.settlementTokens, settlementTokenDecimals)),
    };
};

export const fetchTradeStats: (
    network: KnownNetwork,
    pool: string,
    account: string,
    settlementTokenDecimals: number,
) => Promise<TradeStats> = async (network, pool, account, settlementTokenDecimals) => {
    const tradeStats = await _fetchTradeStats({
        network,
        pool,
        account,
    });

    return {
        avgLongEntryPriceWallet: BNFromString(tradeStats.avgLongEntryPriceWallet, settlementTokenDecimals),
        avgShortEntryPriceWallet: BNFromString(tradeStats.avgShortEntryPriceWallet, settlementTokenDecimals),
        avgLongEntryPriceAggregate: BNFromString(tradeStats.avgLongEntryPriceAggregate, settlementTokenDecimals),
        avgShortEntryPriceAggregate: BNFromString(tradeStats.avgShortEntryPriceAggregate, settlementTokenDecimals),
        avgLongExitPriceWallet: BNFromString(tradeStats.avgLongExitPriceWallet, settlementTokenDecimals),
        avgShortExitPriceWallet: BNFromString(tradeStats.avgShortExitPriceWallet, settlementTokenDecimals),
        avgLongExitPriceAggregate: BNFromString(tradeStats.avgLongExitPriceAggregate, settlementTokenDecimals),
        avgShortExitPriceAggregate: BNFromString(tradeStats.avgShortExitPriceAggregate, settlementTokenDecimals),
        totalLongTokensMinted: BNFromString(tradeStats.totalLongTokensMinted, settlementTokenDecimals),
        totalLongMintSpend: BNFromString(tradeStats.totalLongMintSpend, settlementTokenDecimals),
        totalShortTokensMinted: BNFromString(tradeStats.totalShortTokensMinted, settlementTokenDecimals),
        totalShortMintSpend: BNFromString(tradeStats.totalShortMintSpend, settlementTokenDecimals),
        totalLongTokensBurned: BNFromString(tradeStats.totalLongTokensBurned, settlementTokenDecimals),
        totalLongBurnReceived: BNFromString(tradeStats.totalLongBurnReceived, settlementTokenDecimals),
        totalShortTokensBurned: BNFromString(tradeStats.totalShortTokensBurned, settlementTokenDecimals),
        totalShortBurnReceived: BNFromString(tradeStats.totalShortBurnReceived, settlementTokenDecimals),
        totalLongBurns: tradeStats.totalLongBurns,
        totalLongMints: tradeStats.totalLongMints,
        totalShortBurns: tradeStats.totalShortBurns,
        totalShortMints: tradeStats.totalShortMints,
    };
};

export const fetchTokenApprovals: (
    tokens: string[],
    provider: ethers.providers.JsonRpcProvider,
    account: string,
    pool: string,
) => Promise<EthersBigNumber[]> = (tokens, provider, account, pool) => {
    return Promise.all(
        tokens.map((token) => {
            const tokenContract = ERC20__factory.connect(token, provider);
            return tokenContract.allowance(account, pool, {
                blockTag: 'latest',
            });
        }),
    );
};

export const fromAggregateBalances: (balanceType: BalanceTypeEnum) => boolean = (balanceType) =>
    balanceType === BalanceTypeEnum.escrow;

export const marketSymbolToAssetName: Record<string, string> = {
    'ETH/USD': 'Ethereum',
    'EUR/USD': 'Euro',
    'BTC/USD': 'Bitcoin',
    'TOKE/USD': 'Tokemak',
    'LINK/USD': 'Chainlink',
    'AAVE/USD': 'AAVE',
    'WTI/USD': 'Oil',
};

// export const tickerToName: (ticker: string) => string = (ticker) => {
// const [leverage, market] = ticker.split('-');
// return `${leverage}-${marketSymbolToAssetName[market]}`;
// };

// given a poolName, deconstruct it such that we are left with the
// market and leverage
export const formatPoolName = (
    poolName: string,
): {
    leverage: string;
    market: string;
    // collateral: string
} => {
    const leverageRegex = /([0-9]*)\-/g;
    const leverage = poolName.match(leverageRegex);
    const marketRegex = /([A-Z]*\/[A-Z]*)/g;
    const market = poolName.match(marketRegex);
    return {
        leverage: leverage ? leverage[0] : '',
        market: market ? market[0] : '',
    };
};

export const generateOracleTypeSummary: (pool: PoolInfo) => string = (pool) => {
    const { oracleDetails, poolInstance } = pool;
    const isSMA = pool.oracleDetails.type === 'SMA';
    const formattedOracleDetails = isSMA
        ? `${formatSeconds(oracleDetails.numPeriods * oracleDetails.updateInterval)} SMA`
        : 'Spot Price';
    const formattedUpdateInterval = `${formatSeconds(poolInstance?.oracle.updateInterval)} updates`;

    return isSMA ? `${formattedOracleDetails} - ${formattedUpdateInterval}` : `${formattedOracleDetails}`;
};

export const generatePoolTypeSummary: (pool: PoolInfo) => string = (pool) => {
    const { oracleDetails } = pool;
    const formattedOracleDetails =
        pool.oracleDetails.type === 'SMA'
            ? `${formatSeconds(oracleDetails.numPeriods * oracleDetails.updateInterval)} SMA`
            : 'Spot';

    const formattedRebalance = `${formatSeconds(pool.poolInstance.updateInterval.toNumber())} Rebalance`;
    const formattedFRI = `${formatSeconds(pool.poolInstance.frontRunningInterval.toNumber())} Frontrunning Interval`;

    return `${formattedOracleDetails} - ${formattedRebalance} - ${formattedFRI} `;
};

export const buildDefaultNextPoolState = (pool: Pool): NextPoolState => {
    const decimals = pool.settlementToken.decimals;
    const decimalFactor = new BigNumber(10).pow(decimals);

    return {
        // current
        currentSkew: pool.getSkew(),
        currentLongBalance: pool.longBalance.times(decimalFactor),
        currentLongSupply: pool.longToken.supply.times(decimalFactor),
        currentShortBalance: pool.shortBalance.times(decimalFactor),
        currentShortSupply: pool.shortToken.supply.times(decimalFactor),
        currentLongTokenPrice: pool.getLongTokenPrice(),
        currentShortTokenPrice: pool.getShortTokenPrice(),
        currentPendingLongTokenBurn: new BigNumber(0),
        currentPendingShortTokenBurn: new BigNumber(0),
        // next rebalance
        expectedSkew: pool.getSkew(),
        expectedLongBalance: pool.longBalance.times(decimalFactor),
        expectedLongSupply: pool.longToken.supply.times(decimalFactor),
        expectedShortBalance: pool.shortBalance.times(decimalFactor),
        expectedShortSupply: pool.shortToken.supply.times(decimalFactor),
        expectedPendingLongTokenBurn: new BigNumber(0),
        expectedPendingShortTokenBurn: new BigNumber(0),
        expectedLongTokenPrice: pool.getLongTokenPrice(),
        expectedShortTokenPrice: pool.getShortTokenPrice(),
        lastOraclePrice: pool.oraclePrice,
        expectedOraclePrice: pool.oraclePrice,
        // end of front running interval
        expectedFrontRunningSkew: pool.getSkew(),
        expectedFrontRunningLongBalance: pool.longBalance.times(decimalFactor),
        expectedFrontRunningLongSupply: pool.longToken.supply.times(decimalFactor),
        expectedFrontRunningShortBalance: pool.shortBalance.times(decimalFactor),
        expectedFrontRunningShortSupply: pool.shortToken.supply.times(decimalFactor),
        expectedFrontRunningPendingLongTokenBurn: new BigNumber(0),
        expectedFrontRunningPendingShortTokenBurn: new BigNumber(0),
        totalNetFrontRunningPendingLong: new BigNumber(0),
        totalNetFrontRunningPendingShort: new BigNumber(0),
        expectedFrontRunningLongTokenPrice: pool.getLongTokenPrice(),
        expectedFrontRunningShortTokenPrice: pool.getShortTokenPrice(),
        expectedFrontRunningOraclePrice: pool.oraclePrice,
    };
};
