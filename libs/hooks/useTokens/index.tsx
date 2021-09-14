import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { usePools } from '@context/PoolContext';
import { TokenBreakdown } from '@libs/types/General';
import { calcTokenPrice } from '@libs/utils/calcs';

// const useTokens
export default (() => {
    const { pools } = usePools();
    const [tokens, setTokens] = useState<TokenBreakdown[]>([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        if (pools && Object.keys(pools).length) {
            const tokens: TokenBreakdown[] = [];
            Object.values(pools).forEach((pool) => {
                tokens.push(
                    {
                        ...pool.shortToken,
                        tokenPrice: calcTokenPrice(pool.nextShortBalance, pool.shortToken.supply),
                        pool: pool.address,
                    },
                    {
                        ...pool.longToken,
                        tokenPrice: calcTokenPrice(pool.nextLongBalance, pool.longToken.supply),
                        pool: pool.address,
                    },
                );
            });
            setTokens(tokens);
        }
    }, [pools]);
    return {
        tokens,
        filter,
        setFilter,
    };
}) as () => {
    tokens: TokenBreakdown[];
    filter: string;
    setFilter: Dispatch<SetStateAction<string>>;
};
