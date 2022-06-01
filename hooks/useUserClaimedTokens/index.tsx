import { useState, useEffect } from 'react';
import { BigNumber } from 'bignumber.js';
import { calcEffectiveLongGain, calcEffectiveShortGain, calcNotionalValue } from '@tracer-protocol/pools-js';
import { usePools } from '~/hooks/usePools';
import { ClaimedTokenRowProps } from '~/types/claimedTokens';
import { LoadingRows } from '~/types/hooks';
import useFarmBalances from '../useFarmBalances';

export const useUserClaimedTokens = (): LoadingRows<ClaimedTokenRowProps> => {
    const { pools, isLoadingPools } = usePools();
    const farmBalances = useFarmBalances();
    const [rows, setRows] = useState<ClaimedTokenRowProps[]>([]);

    useEffect(() => {
        if (pools) {
            const poolValues = Object.values(pools);
            const tokens: ClaimedTokenRowProps[] = [];

            poolValues.forEach((pool) => {
                const { poolInstance, userBalances, poolStatus } = pool;

                const { address, oraclePrice, longToken, shortToken, longBalance, shortBalance, leverage } =
                    poolInstance;
                const leverageBN = new BigNumber(leverage);

                const longTokenPrice = poolInstance.getLongTokenPrice();
                const longNotionalValue = calcNotionalValue(longTokenPrice, userBalances.longToken.balance);
                const shortTokenPrice = poolInstance.getShortTokenPrice();
                const shortNotionalValue = calcNotionalValue(shortTokenPrice, userBalances.shortToken.balance);

                const shortStaked: BigNumber = farmBalances[poolInstance.shortToken.address] ?? new BigNumber(0);
                const longStaked: BigNumber = farmBalances[poolInstance.longToken.address] ?? new BigNumber(0);

                if (!userBalances.shortToken.balance.eq(0) || !shortStaked.eq(0)) {
                    tokens.push({
                        name: shortToken.name,
                        poolAddress: address,
                        address: shortToken.address,
                        decimals: shortToken.decimals,
                        symbol: shortToken.symbol,
                        side: shortToken.side,
                        currentTokenPrice: poolInstance.getShortTokenPrice(),
                        balance: userBalances.shortToken.balance,
                        leveragedNotionalValue: shortNotionalValue.times(leverageBN),
                        oraclePrice: oraclePrice,
                        effectiveGain: calcEffectiveShortGain(shortBalance, longBalance, leverageBN).toNumber(),
                        entryPrice: userBalances.tradeStats.avgShortEntryPriceWallet,
                        settlementTokenSymbol: poolInstance.settlementToken.symbol,
                        stakedTokens: shortStaked,
                        poolStatus,
                    });
                }
                if (!userBalances.longToken.balance.eq(0) || !longStaked.eq(0)) {
                    tokens.push({
                        name: longToken.name,
                        poolAddress: address,
                        address: longToken.address,
                        decimals: longToken.decimals,
                        symbol: longToken.symbol,
                        side: longToken.side,
                        currentTokenPrice: poolInstance.getLongTokenPrice(),
                        balance: userBalances.longToken.balance,
                        leveragedNotionalValue: longNotionalValue.times(leverageBN),
                        oraclePrice: oraclePrice,
                        effectiveGain: calcEffectiveLongGain(longBalance, longBalance, leverageBN).toNumber(),
                        entryPrice: userBalances.tradeStats.avgLongEntryPriceWallet,
                        settlementTokenSymbol: poolInstance.settlementToken.symbol,
                        stakedTokens: longStaked,
                        poolStatus,
                    });
                }
            });

            setRows(tokens);
        }
    }, [pools, farmBalances]);

    return {
        rows,
        isLoading: isLoadingPools && rows.length === 0,
    };
};

export default useUserClaimedTokens;
