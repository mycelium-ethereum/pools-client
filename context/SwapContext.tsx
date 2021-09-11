import React, { useContext, useReducer } from 'react';
import { Children, MarketType, LeverageType, CurrencyType, PoolType } from '@libs/types/General';
import { CommitActionEnum, SideEnum } from '@libs/constants';
import { FactoryContext } from './FactoryContext';
import { useEffect } from 'react';

interface ContextProps {
    swapState: SwapState;
    swapDispatch: React.Dispatch<SwapAction>;
}

type SwapState = {
    amount: number;
    invalidAmount: boolean;
    commitAction: CommitActionEnum;
    selectedPool: string | undefined; // address of selected pool
    side: SideEnum;
    leverage: LeverageType;
    currency: CurrencyType;
    options: {
        sides: SideEnum[];
        poolOptions: PoolType[];
    };
};

export type SwapAction =
    | { type: 'setAmount'; value: number }
    | { type: 'setCommitAction'; value: CommitActionEnum }
    | { type: 'setMarket'; value: MarketType }
    | { type: 'setLeverage'; value: LeverageType }
    | { type: 'setCurrency'; value: CurrencyType }
    | { type: 'setSelectedPool'; value: string }
    | { type: 'setPoolOptions'; options: PoolType[] }
    | { type: 'setInvalidAmount'; value: boolean }
    | { type: 'setSide'; value: SideEnum };

export const LEVERAGE_OPTIONS = [
    {
        leverage: 1,
        disabled: false,
    },
    {
        leverage: 2,
        disabled: true,
    },
    {
        leverage: 3,
        disabled: false,
    },
    {
        leverage: 5,
        disabled: true,
    },
    {
        leverage: 10,
        disabled: true,
    },
];

export const swapDefaults: SwapState = {
    amount: NaN,
    invalidAmount: false,
    commitAction: CommitActionEnum.mint,
    selectedPool: undefined,
    side: SideEnum.long,
    leverage: NaN,
    currency: 'DAI',
    options: {
        sides: [SideEnum.long, SideEnum.short], // will always be long and short
        poolOptions: [], // available pools
    },
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
            case 'setCommitAction':
                return { ...state, commitAction: action.value };
            case 'setSide':
                return { ...state, side: action.value };
            case 'setLeverage':
                return { ...state, leverage: action.value };
            case 'setCurrency':
                return { ...state, currency: action.value };
            case 'setSelectedPool':
                return { ...state, selectedPool: action.value };
            case 'setInvalidAmount':
                return { ...state, invalidAmount: action.value };
            case 'setPoolOptions':
                return {
                    ...state,
                    options: {
                        ...state.options,
                        poolOptions: action.options,
                    },
                };
            default:
                throw new Error('Unexpected action');
        }
    };

    const [swapState, swapDispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (pools?.length) {
            swapDispatch({
                type: 'setPoolOptions',
                options: pools,
            });
        }
    }, [pools]);

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
    const context = useContext(SwapContext);
    if (context === undefined) {
        throw new Error(`useSwapContext must be called within SwapContext`);
    }
    return context;
};
