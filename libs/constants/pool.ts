import { PoolState } from "@hooks/usePool/poolDispatch";
import BigNumber from "bignumber.js";

export const DEFAULT_POOLSTATE: PoolState = {
    contract: undefined,
    nextRebalance: 0,
    marketChange: 31.25,
    rebalanceMultiplier: new BigNumber(0),
    leverage: new BigNumber(5),
    lastPrice: new BigNumber(0),
    oraclePrice: new BigNumber(0),
    poolBalances: {
        shortBalance: new BigNumber(0),
        longBalance: new BigNumber(0),
    },
}