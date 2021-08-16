import React, { useReducer } from 'react';
import { Children, TokenType, MarketType, LeverageType, CurrencyType, SideType } from '@libs/types/General';
import { MINT, LONG } from '@libs/constants'

interface ContextProps {
    swapState: SwapState;
    swapDispatch: React.Dispatch<SwapAction>;
}

type SwapState = {
    amount: number;
    tokenType: TokenType;
    market: MarketType;
    side: SideType;
    leverage: LeverageType;
    currency: CurrencyType;
};

export type SwapAction =
    | { type: 'setAmount'; value: number }
    | { type: 'setTokenType'; value: TokenType }
    | { type: 'setMarket'; value: MarketType }
    | { type: 'setLeverage'; value: LeverageType }
    | { type: 'setCurrency'; value: CurrencyType }
    | { type: 'setLeverageOptions'; value: LeverageType[] }
    | { type: 'setSide'; value: SideType };

export const defaultState: SwapState = {
    amount: NaN,
    tokenType: MINT,
    market: undefined,
    side: LONG,
    leverage: NaN,
    currency: 'DAI',
};

export const SwapContext = React.createContext<Partial<ContextProps>>({});

/**
 * Wrapper store for the swap page state
 */
export const SwapStore: React.FC<Children> = ({ children }: Children) => {
    const initialState: SwapState = defaultState;

    const reducer = (state: SwapState, action: SwapAction) => {
        switch (action.type) {
            case 'setAmount':
                return { ...state, amount: action.value };
            case 'setTokenType':
                return { ...state, tokenType: action.value };
            case 'setSide':
                return { ...state, side: action.value };
            case 'setMarket':
                return { ...state, market: action.value };
            case 'setLeverage':
                return { ...state, leverage: action.value };
            case 'setCurrency':
                return { ...state, currency: action.value };
            default:
                throw new Error('Unexpected action');
        }
    };

    const [swapState, swapDispatch] = useReducer(reducer, initialState);

    return (
        <SwapContext.Provider
            value={{
                swapState,
                swapDispatch,
            }}
        >
            {children}
        </SwapContext.Provider>
    );
};

export const noDispatch: any = () => console.error('Swap dispatch undefined');
