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
                const {
                    committer: {
                        pendingLong: { burn: pendingLongBurn },
                        pendingShort: { burn: pendingShortBurn },
                    },
                } = pool;
                tokens.push(
                    {
                        ...pool.shortToken,
                        tokenPrice: calcTokenPrice(
                            pool.nextShortBalance,
                            pool.shortToken.supply.plus(pendingShortBurn),
                        ),
                        pool: pool.address,
                    },
                    {
                        ...pool.longToken,
                        tokenPrice: calcTokenPrice(pool.nextLongBalance, pool.longToken.supply.plus(pendingLongBurn)),
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
