import { useEffect, useState } from 'react';
import { SideType } from '@libs/types/General';
import { usePools } from '@context/PoolContext';
import { SHORT, LONG } from '@libs/constants';

type TokenRow = {
    side: SideType;
    pool: string;
    symbol: string;
};
// const useTokens
export default (() => {
    const { pools } = usePools();
    const [tokens, setTokens] = useState<TokenRow[]>([]);

    useEffect(() => {
        if (pools && Object.values(pools).length) {
            const tokens: TokenRow[] = [];
            Object.values(pools).forEach((pool) => {
                tokens.push(
                    {
                        symbol: pool.shortToken.symbol,
                        side: SHORT,
                        pool: pool.address,
                    },
                    {
                        symbol: pool.longToken.symbol,
                        side: LONG,
                        pool: pool.address,
                    },
                );
            });

            setTokens(tokens);
        }
    }, [pools]);

    return tokens;
}) as () => TokenRow[];
