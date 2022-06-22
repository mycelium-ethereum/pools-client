import { ethers, BigNumber as EthersBigNumber } from 'ethers';
import BigNumber from 'bignumber.js';
import { PoolCommitter__factory, ERC20__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
import { BalanceTypeEnum, KnownNetwork, Pool } from '@tracer-protocol/pools-js';
import { AggregateBalances, TradeStats } from '~/types/pools';
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

export const generatePoolTypeSummary: (pool: Pool) => string = (pool) => {
    const EIGHT_HOUR_DESC = '8hr SMA - 8hr Front Running Interval';
    const EIGHT_HOUR_FR_INTERVAL = new BigNumber(60 * 60 * 8); // 8 hours
    const EIGHT_HOUR_UPD_INTERVAL = new BigNumber(60 * 60); // 1 hour

    const TWELVE_HOUR_DESC = 'Spot - 12hr Rebalance - 5min Front Running Interval';
    const TWELVE_HOUR_FR_INTERVAL = new BigNumber(60 * 60 * 8); // 12 hours
    const TWELVE_HOUR_UPD_INTERVAL = new BigNumber(60 * 5); // 5 minutes

    const isEightHour =
        pool.frontRunningInterval.eq(EIGHT_HOUR_FR_INTERVAL) && pool.updateInterval.eq(EIGHT_HOUR_UPD_INTERVAL);

    const isTwelveHour =
        pool.frontRunningInterval.eq(TWELVE_HOUR_FR_INTERVAL) && pool.updateInterval.eq(TWELVE_HOUR_UPD_INTERVAL);

    if (isEightHour) {
        return EIGHT_HOUR_DESC;
    }
    if (isTwelveHour) {
        return TWELVE_HOUR_DESC;
    }
    return '';
}