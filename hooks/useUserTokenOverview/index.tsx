import { useState, useEffect } from 'react';
import { BigNumber } from 'bignumber.js';
import { calcEffectiveLongGain, calcEffectiveShortGain, calcNotionalValue } from '@tracer-protocol/pools-js';
import { TokenRowProps } from '~/archetypes/Portfolio//state';
import { usePools } from '~/hooks/usePools';

export const useUserTokenOverview = (): {
    tokens: TokenRowProps[];
    loading: boolean;
} => {
    const { pools } = usePools();
    const [loading, setLoading] = useState<boolean>(true);
    const [tokens, setTokens] = useState<TokenRowProps[]>([]);
    // const [tokensOverview, setTokensOverview] = useState<TokensOverview>({
    // tokens: [],
    // claimedCount: 0,
    // });

    useEffect(() => {
        if (pools) {
            const poolValues = Object.values(pools);
            const tokens: TokenRowProps[] = [];

            poolValues.forEach((pool) => {
                const { poolInstance, userBalances } = pool;

                const { address, oraclePrice, longToken, shortToken, longBalance, shortBalance, leverage } =
                    poolInstance;
                const leverageBN = new BigNumber(leverage);

                const longTokenPrice = poolInstance.getLongTokenPrice();
                const longNotionalValue = calcNotionalValue(longTokenPrice, userBalances.longToken.balance);
                const shortTokenPrice = poolInstance.getShortTokenPrice();
                const shortNotionalValue = calcNotionalValue(shortTokenPrice, userBalances.shortToken.balance);

                if (!userBalances.shortToken.balance.eq(0)) {
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
                    });
                }
                if (!userBalances.longToken.balance.eq(0)) {
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
                    });
                }
            });

            setTokens(tokens);
            setLoading(false);
        }
    }, [pools]);
    return {
        tokens,
        loading,
    };
};

export default useUserTokenOverview;
