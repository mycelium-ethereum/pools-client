import { useEffect, useState } from 'react';
import { usePools } from '@context/PoolContext';
import { SideEnum } from '@libs/constants';
import BigNumber from 'bignumber.js';

export type TokenRow = {
    side: SideEnum;
    leverage: number;
    pool: {
        address: string;
        name: string;
        quoteTokenSymbol: string;
    };
    symbol: string;
    balance: BigNumber;
    escrowBalance: BigNumber;
};

type TokenMap = {
    [address: string]: TokenRow;
};

// const usePoolTokens
export default (() => {
    const { pools } = usePools();
    const [tokens, setTokens] = useState<TokenRow[]>([]);
    const [tokenMap, setTokenMap] = useState<TokenMap>({});

    useEffect(() => {
        if (pools && Object.values(pools).length) {
            const _tokens: TokenRow[] = [];
            const _tokenMap: TokenMap = {};
            Object.values(pools).forEach((pool) => {
                const { poolInstance, userBalances } = pool;

                const {
                    address,
                    name,
                    leverage,
                    shortToken: { symbol: shortTokenSymbol, address: shortTokenAddress },
                    longToken: { symbol: longTokenSymbol, address: longTokenAddress },
                    quoteToken: { symbol: quoteTokenSymbol },
                } = poolInstance;

                const shortToken: TokenRow = {
                    symbol: shortTokenSymbol,
                    side: SideEnum.short,
                    leverage: leverage,
                    balance: userBalances.shortToken.balance,
                    escrowBalance: userBalances.aggregateBalances.shortTokens,
                    pool: {
                        address,
                        quoteTokenSymbol,
                        name,
                    },
                };

                const longToken: TokenRow = {
                    symbol: longTokenSymbol,
                    side: SideEnum.long,
                    leverage: leverage,
                    balance: userBalances.longToken.balance,
                    escrowBalance: userBalances.aggregateBalances.shortTokens,
                    pool: {
                        address,
                        quoteTokenSymbol,
                        name,
                    },
                };
                _tokens.push(shortToken, longToken);
                _tokenMap[shortTokenAddress] = shortToken;
                _tokenMap[longTokenAddress] = longToken;
            });

            setTokens(_tokens);
            setTokenMap(_tokenMap);
        }
    }, [pools]);
    return { tokens, tokenMap };
}) as () => { tokens: TokenRow[]; tokenMap: TokenMap };
