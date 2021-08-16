import { SideType } from '@libs/types/General';
import { LeveragedPool } from '@libs/types/typechain'
import { BigNumber } from 'bignumber.js';
import { SHORT, LONG } from '@libs/constants';

export type Token = {
    tokenName: string,
    balance: BigNumber,
    approved: boolean,
}

export type PoolToken = {
    side: SideType
} & Token

export type TokenState = {
    contract: LeveragedPool | undefined;
    longToken: PoolToken;
    shortToken: PoolToken;
    quoteToken: Token
};

export const initialTokenState: TokenState = {
    contract: undefined,
    longToken: {
        tokenName: '',
        balance: new BigNumber(0),
        approved: false,
        side: LONG
    },
    shortToken: {
        tokenName: '',
        balance: new BigNumber(0),
        approved: false,
        side: SHORT
    },
    quoteToken: {
        tokenName: '',
        balance: new BigNumber(0),
        approved: false
    },
};

export type TokenAction =
    | { type: 'setNames'; longToken: string; shortToken: string }
    | { type: 'setContract'; contract: any }
    | {
          type: 'setPoolTokenBalances';
          balances: {
              shortToken: BigNumber;
              longToken: BigNumber;
          };
      }
    | {
          type: 'setApprovedTokens';
          approvals: {
              shortToken: boolean;
              longToken: boolean;
          };
      }
    | { type: 'setQuoteTokenBalance'; quoteTokenBalance: BigNumber }
    | { type: 'setApprovedQuoteToken'; value: boolean };

export const tokenReducer: (state: TokenState, action: TokenAction) => TokenState = (state, action) => {
    switch (action.type) {
        case 'setContract':
            return {
                ...state,
                contract: action.contract,
            };
        case 'setNames':
            return {
                ...state,
                shortToken: {
                    ...state.shortToken,
                    tokenName: action.shortToken
                },
                longToken: {
                    ...state.longToken,
                    tokenName: action.shortToken
                }
            };
        case 'setQuoteTokenBalance':
            return {
                ...state,
                quoteToken: {
                    ...state.quoteToken,
                    balance: action.quoteTokenBalance
                }
            };
        case 'setPoolTokenBalances': {
            return {
                ...state,
                shortToken: {
                    ...state.shortToken,
                    balance: action.balances.shortToken
                },
                longToken: {
                    ...state.longToken,
                    balance: action.balances.longToken
                }
            };
        }
        case 'setApprovedTokens': {
            return {
                ...state,
                shortToken: {
                    ...state.shortToken,
                    approved: action.approvals.shortToken
                },
                longToken: {
                    ...state.longToken,
                    approved: action.approvals.longToken
                }
            };
        }
        case 'setApprovedQuoteToken': {
            return {
                ...state,
                quoteToken: {
                    ...state.quoteToken,
                    approved: action.value
                }
            };
        }
        default:
            throw new Error('Unexpected action');
    }
};
