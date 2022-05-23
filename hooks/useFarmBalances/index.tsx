import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useFarms } from '~/context/FarmContext';

// gets farm totalStaked amount in settlementTokens
export const useFarmBalances = (): Record<string, BigNumber> => {
    const { farms } = useFarms();

    return useMemo(
        () =>
            Object.values(farms).reduce((o, farm) => {
                const totalPoolStaked = o[farm.poolDetails.address] ?? new BigNumber(0);
                return {
                    ...o,
                    [farm.poolDetails.address]: totalPoolStaked
                        .plus(farm.myStaked)
                        .times(farm.poolDetails.poolTokenPrice),
                };
            }, {} as Record<string, BigNumber>),
        [farms],
    );
};

export default useFarmBalances;
