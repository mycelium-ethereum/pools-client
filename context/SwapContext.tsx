import React, { useContext, useReducer } from 'react';
import { Children, TokenType, MarketType, LeverageType, CurrencyType, SideType, PoolType } from '@libs/types/General';
import { MINT, LONG, SHORT } from '@libs/constants'
import { FactoryContext } from '.';
import { useEffect } from 'react';

interface ContextProps {
    swapState: SwapState;
    swapDispatch: React.Dispatch<SwapAction>;
}

type SwapState = {
    amount: number;
    tokenType: TokenType;
    selectedPool: string | undefined; // address of selected pool
    side: SideType;
    leverage: LeverageType;
    currency: CurrencyType;
    options: {
        leverageOptions: LeverageType[],
        sides: SideType[],
        poolOptions: PoolType[]
    }
};

export type SwapAction =
    | { type: 'setAmount'; value: number }
    | { type: 'setTokenType'; value: TokenType }
    | { type: 'setMarket'; value: MarketType }
    | { type: 'setLeverage'; value: LeverageType }
    | { type: 'setCurrency'; value: CurrencyType }
    | { type: 'setSelectedPool'; value: string}
    | { type: 'setPoolOptions'; options: PoolType[] }
    | { type: 'setSide'; value: SideType };

export const swapDefaults : SwapState = {
    amount: NaN,
    tokenType: MINT,
    selectedPool: undefined,
    side: LONG,
    leverage: NaN,
    currency: 'DAI',
    options: {
        leverageOptions: [2, 3, 4], // leverage options available to the pool
        sides: [LONG, SHORT], // will always be long and short
        poolOptions: [] // available pools
    }
};

export const SwapContext = React.createContext<Partial<ContextProps>>({});

/**
 * Wrapper store for the swap page state
 */
export const SwapStore: React.FC<Children> = ({ children }: Children) => {
    const { pools } = useContext(FactoryContext);
    const initialState: SwapState = swapDefaults;

    const reducer = (state: SwapState, action: SwapAction) => {
        switch (action.type) {
            case 'setAmount':
                return { ...state, amount: action.value };
            case 'setTokenType':
                return { ...state, tokenType: action.value };
            case 'setSide':
                return { ...state, side: action.value };
            case 'setLeverage':
                return { ...state, leverage: action.value };
            case 'setCurrency':
                return { ...state, currency: action.value };
            case 'setSelectedPool':
                return { ...state, selectedPool: action.value };
            case 'setPoolOptions':
                return {
                    ...state,
                    options: {
                        ...state.options,
                        poolOptions: action.options
                    }
                };
            default:
                throw new Error('Unexpected action');
        }
    };

    const [swapState, swapDispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (pools?.length) {
            swapDispatch({
                type: 'setPoolOptions', options: pools
            })
        }
    }, [pools])

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


export const useSwapContext: () => Partial<ContextProps> = () => {
  const context = useContext(SwapContext)
  if (context === undefined) {
    throw new Error(`useSwapContext must be called within SwapContext`)
  }
  return context
}
