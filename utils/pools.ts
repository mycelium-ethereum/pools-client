import { ethers, BigNumber as EthersBigNumber } from 'ethers';
import BigNumber from 'bignumber.js';
import { PoolCommitter__factory, ERC20__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
import { BalanceTypeEnum, KnownNetwork } from '@tracer-protocol/pools-js';
import { AggregateBalances, TradeStats } from '~/types/pools';
import { BNFromString } from './helpers';
import { fetchTradeStats as _fetchTradeStats } from './tracerAPI';

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

    // const balances = await contract.getAggregateBalance('0x110af92Ba116fD7868216AA794a7E4dA3b9D7D11');
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
