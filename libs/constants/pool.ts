import { PoolInfo } from '@context/PoolContext/poolDispatch';
import Pool from '@tracer-protocol/pools-js/entities/pool';
import { BigNumber } from 'bignumber.js';

export const DEFAULT_POOLSTATE: PoolInfo = {
    poolInstance: Pool.CreateDefault(),
    userBalances: {
        shortToken: {
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
        },
        longToken: {
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
        },
        quoteToken: {
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
        },
    },
};
