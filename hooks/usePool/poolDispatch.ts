import { BigNumber } from 'bignumber.js';
import { LeveragedPool } from '../../../pool-swaps-contracts/typechain/LeveragedPool'

export type PoolState = {
    contract: LeveragedPool | undefined;
    nextRebalance: number;
    marketChange: number;
    rebalanceMultiplier: BigNumber;
    leverage: BigNumber;
    lastPrice: BigNumber;
    oraclePrice: BigNumber;
    poolBalances: {
        longBalance: BigNumber;
        shortBalance: BigNumber;
    };
};

export const initialPoolState: PoolState = {
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
};

export type PoolAction =
    | { type: 'setNextRebalance'; nextRebalance: number }
    | { type: 'setLastPrice'; lastPrice: BigNumber }
    | { type: 'setMarketChange'; marketChange: number }
    | { type: 'setUpdateInterval'; updateInterval: number }
    | { type: 'setLeverage'; leverage: BigNumber }
    | { type: 'setRebalanceMultiplier'; rebalanceMultiplier: BigNumber }
    | { type: 'setOraclePrice'; oraclePrice: BigNumber }
    | {
          type: 'setPoolBalances';
          balances: {
              shortBalance: BigNumber;
              longBalance: BigNumber;
          };
      }
    | { type: 'setContract'; contract: any };

export const reducer: (state: PoolState, action: PoolAction) => PoolState = (state, action) => {
    switch (action.type) {
        case 'setContract':
            return {
                ...state,
                contract: action.contract,
            };
        case 'setNextRebalance':
            return {
                ...state,
                nextRebalance: action.nextRebalance,
            };
        case 'setLastPrice':
            return {
                ...state,
                lastPrice: action.lastPrice,
            };
        case 'setRebalanceMultiplier':
            return {
                ...state,
                rebalanceMultiplier: action.rebalanceMultiplier,
            };
        case 'setUpdateInterval':
            return {
                ...state,
                updateInterval: action.updateInterval,
            };
        case 'setMarketChange':
            return {
                ...state,
                marketChange: action.marketChange,
            };
        case 'setLeverage':
            return {
                ...state,
                leverage: action.leverage,
            };
        case 'setOraclePrice':
            return {
                ...state,
                oraclePrice: action.oraclePrice,
            };
        case 'setPoolBalances': {
            return {
                ...state,
                poolBalances: {
                    ...state.poolBalances,
                    shortBalance: action.balances.shortBalance,
                    longBalance: action.balances.longBalance,
                },
            };
        }
        default:
            throw new Error('Unexpected action');
    }
};
