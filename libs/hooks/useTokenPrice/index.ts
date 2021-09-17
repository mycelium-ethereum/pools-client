import { usePool } from '@context/PoolContext';
import { BigNumber } from 'bignumber.js';
import { calcTokenPrice } from '@libs/utils/calcs';
import { useMemo } from 'react';
import usePoolTokenMap from '../usePoolTokenMap';

export default ((tokenAddress) => {
    const tokenMap = usePoolTokenMap();
    const poolAddress = useMemo(() => tokenMap[tokenAddress], [tokenMap, tokenAddress]);
    const pool = usePool(poolAddress);

    const isLong: boolean = useMemo(
        () => tokenAddress.toLowerCase() === pool.longToken.address.toLowerCase(),
        [tokenAddress, pool],
    );

    const token = useMemo(() => (isLong ? pool.longToken : pool.shortToken), [isLong, pool.longToken, pool.shortToken]);

    const notional = useMemo(
        () => (isLong ? pool.nextLongBalance : pool.nextShortBalance),
        [isLong, pool.nextLongBalance, pool.nextShortBalance],
    );

    const pendingBurns = useMemo(
        () => (isLong ? pool.committer.pendingLong.burn : pool.committer.pendingShort.burn),
        [isLong, pool.committer.pendingLong.burn, pool.committer.pendingShort.burn],
    );

    return {
        price: useMemo(
            () => calcTokenPrice(notional, token.supply.plus(pendingBurns)),
            [notional, token, pendingBurns],
        ),
        supply: useMemo(() => token.supply, [notional, token, pendingBurns]),
    };
}) as (token: string) => { price: BigNumber; supply: BigNumber };
