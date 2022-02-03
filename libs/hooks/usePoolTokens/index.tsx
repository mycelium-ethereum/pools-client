import { useEffect, useState } from 'react';
import { usePools } from '@context/PoolContext';
import { SideEnum } from '@libs/constants';

type TokenRow = {
    side: SideEnum;
    leverage: number;
    pool: string;
    symbol: string;
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
                const { poolInstance } = pool;

                const {
                    address,
                    leverage,
                    shortToken: { symbol: shortTokenSymbol, address: shortTokenAddress },
                    longToken: { symbol: longTokenSymbol, address: longTokenAddress },
                } = poolInstance;

                const shortToken = {
                    symbol: shortTokenSymbol,
                    side: SideEnum.short,
                    pool: address,
                    leverage: leverage,
                };

                const longToken = {
                    symbol: longTokenSymbol,
                    side: SideEnum.long,
                    pool: address,
                    leverage: leverage,
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
