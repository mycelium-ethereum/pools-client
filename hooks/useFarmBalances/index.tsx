import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useFarms } from '~/context/FarmContext';

// gets farm totalStaked amount in settlementTokens
export const useFarmBalances = (): Record<string, BigNumber> => {
    const { farms } = useFarms();

    return useMemo(
        () =>
            Object.values(farms).reduce((o, farm) => {
                const totalPoolStaked = o[farm.stakingToken.address] ?? new BigNumber(0);
                return {
                    ...o,
                    [farm.stakingToken.address]: totalPoolStaked.plus(farm.myStaked),
                };
            }, {} as Record<string, BigNumber>),
        [farms],
    );
};

export default useFarmBalances;
