import { BigNumber, ethers } from 'ethers';
import { LeveragedPool } from '@libs/types/contracts';

export type PoolState = {
    contract: LeveragedPool | undefined;
    nextRebalance: number;
    token: string;
    marketChange: number;
    rebalanceMultiplier: BigNumber;
    leverage: BigNumber;
    lastPrice: BigNumber;
    oraclePrice: BigNumber;
    tokenBalances: {
        shortToken: BigNumber,
        longToken: BigNumber,
        quoteToken: BigNumber
    },
    poolBalances: {
        longBalance: BigNumber,
        shortBalance: BigNumber,
    },
    approvedTokens: {
        shortToken: boolean,
        longToken: boolean,
        quoteToken: boolean 
    }
};

export const initialPoolState: PoolState = {
    contract: undefined,
    nextRebalance: 0,
    token: '4DOWN-BTC/USDC',
    marketChange: 31.25,
    rebalanceMultiplier: BigNumber.from(0),
    leverage: BigNumber.from(0),
    lastPrice: BigNumber.from(0),
    oraclePrice: BigNumber.from(0),
    tokenBalances: {
        shortToken: ethers.BigNumber.from(0),
        longToken: ethers.BigNumber.from(0),
        quoteToken: ethers.BigNumber.from(0),
    },
    poolBalances: {
        shortBalance: ethers.BigNumber.from(0),
        longBalance: ethers.BigNumber.from(0),
    },
    approvedTokens: {
        shortToken: false,
        longToken: false,
        quoteToken: false,
    }
};

export type PoolAction = 
    | { type: 'setToken'; token: string }
    | { type: 'setNextRebalance'; nextRebalance: number }
    | { type: 'setLastPrice'; lastPrice: BigNumber }
    | { type: 'setMarketChange'; marketChange: number }
    | { type: 'setUpdateInterval'; updateInterval: number }
    | { type: 'setLeverage'; leverage: BigNumber}
    | { type: 'setRebalanceMultiplier'; rebalanceMultiplier: BigNumber}
    | { type: 'setPoolTokenBalances'; balances: {
        shortToken: BigNumber, longToken: BigNumber
    }}
    | { type: 'setPoolBalances'; balances: {
        shortBalance: BigNumber, longBalance: BigNumber
    }}
    | { type: 'setApprovedTokens'; approvals: {
        shortToken: boolean, longToken: boolean 
    }}
    | { type: 'setQuoteTokenBalance'; quoteTokenBalance: BigNumber }
    | { type: 'setOraclePrice'; oraclePrice: BigNumber }
    | { type: 'setApprovedQuoteToken'; value: boolean}
    | { type: 'setContract'; contract: any };

export const reducer = (state: PoolState, action: PoolAction) => {
    switch (action.type) {
        case 'setContract':
            return {
                ...state,
                contract: action.contract,
            };
        case 'setToken':
            return {
                ...state,
                token: action.token
            }
        case 'setNextRebalance':
            return {
                ...state,
                nextRebalance: action.nextRebalance
            }
        case 'setLastPrice':
            return {
                ...state,
                lastPrice: action.lastPrice
            }
        case 'setRebalanceMultiplier':
            return {
                ...state,
                rebalanceMultiplier: action.rebalanceMultiplier
            }
        case 'setUpdateInterval':
            return {
                ...state,
                updateInterval: action.updateInterval
            }
        case 'setMarketChange':
            return {
                ...state,
                marketChange: action.marketChange
            }
        case 'setLeverage':
            return {
                ...state,
                leverage: action.leverage
            }
        case 'setOraclePrice':
            return {
                ...state,
                oraclePrice: action.oraclePrice
            }
        case 'setQuoteTokenBalance':
            return {
                ...state,
                tokenBalances: {
                    ...state.tokenBalances,
                    quoteToken: action.quoteTokenBalance
                }
            }
        case 'setPoolTokenBalances': {
            return {
                ...state,
                tokenBalances: {
                    ...state.tokenBalances,
                    shortToken: action.balances.shortToken,
                    longToken: action.balances.longToken,
                }
            }
        }
        case 'setPoolBalances': {
            return {
                ...state,
                poolBalances: {
                    ...state.poolBalances,
                    shortBalance: action.balances.shortBalance,
                    longBalance: action.balances.longBalance,
                }
            }
        }
        case 'setApprovedTokens': {
            return {
                ...state,
                approvedTokens: {
                    ...state.approvedTokens,
                    shortToken: action.approvals.shortToken,
                    longToken: action.approvals.longToken,
                }
            }
        }
        case 'setApprovedQuoteToken': {
            return {
                ...state,
                approvedTokens: {
                    ...state.approvedTokens,
                    quoteToken: action.value,
                }
            }
        }
        default:
            throw new Error('Unexpected action');
    }
};
