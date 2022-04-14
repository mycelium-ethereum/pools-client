import { ethers, BigNumber as EthersBigNumber } from 'ethers';
import BigNumber from 'bignumber.js';
import { PoolCommitter__factory, ERC20__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
<<<<<<< HEAD
import { BalanceTypeEnum } from '@tracer-protocol/pools-js';
import { tracerAPIService } from '~/services/TracerAPIService';
import { AggregateBalances, AverageEntryPrices } from '~/types/pools';
=======
import { BalanceTypeEnum, KnownNetwork } from '@tracer-protocol/pools-js';
import { AggregateBalances, AverageEntryPrices } from '~/types/pools';
import { fetchAverageEntryPrices as _fetchAverageEntryPrices } from './tracerAPI';
>>>>>>> 8969e78d0bbc9bc11c128c40b9b5e4fa2d48e03a

export const fetchTokenBalances: (
    tokens: string[],
    provider: ethers.providers.JsonRpcProvider,
    account: string,
    pool: string,
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

export const fetchAverageEntryPrices: (
<<<<<<< HEAD
    pool: string,
    account: string,
    settlementTokenDecimals: number,
) => Promise<AverageEntryPrices> = async (pool, account, settlementTokenDecimals) => {
    const { longPriceWallet, shortPriceWallet, longPriceAggregate, shortPriceAggregate } =
        await tracerAPIService.fetchAverageEntryPrices(pool, account);
=======
    network: KnownNetwork,
    pool: string,
    account: string,
    settlementTokenDecimals: number,
) => Promise<AverageEntryPrices> = async (network, pool, account, settlementTokenDecimals) => {
    const { longPriceWallet, shortPriceWallet, longPriceAggregate, shortPriceAggregate } =
        await _fetchAverageEntryPrices({
            network,
            pool,
            account,
        });
>>>>>>> 8969e78d0bbc9bc11c128c40b9b5e4fa2d48e03a

    return {
        longPriceWallet: new BigNumber(ethers.utils.formatUnits(longPriceWallet, settlementTokenDecimals)),
        shortPriceWallet: new BigNumber(ethers.utils.formatUnits(shortPriceWallet, settlementTokenDecimals)),
        longPriceAggregate: new BigNumber(ethers.utils.formatUnits(longPriceAggregate, settlementTokenDecimals)),
        shortPriceAggregate: new BigNumber(ethers.utils.formatUnits(shortPriceAggregate, settlementTokenDecimals)),
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
