import React, { useContext, useReducer } from 'react';
import { Children, PoolType } from '@libs/types/General';
import { CommitActionEnum, SideEnum } from '@libs/constants';
import { FactoryContext } from './FactoryContext';
import { useEffect } from 'react';
import { useWeb3 } from './Web3Context/Web3Context';

interface ContextProps {
    swapState: SwapState;
    swapDispatch: React.Dispatch<SwapAction>;
}

// the key here is the leverage amount
// this allows access through Markets[selectedMarket][selectedLeverage]
type Market = Record<string, PoolType>

type SwapState = {
    amount: number;
    invalidAmount: boolean;
    commitAction: CommitActionEnum;

    // address of selected pool
    selectedPool: string | undefined;

    leverage: number;

    side: SideEnum;

    // selected market name
    market: string;
    markets: Record<string, Market>;

};

export type SwapAction =
    | { type: 'setAmount'; value: number }
    | { type: 'setCommitAction'; value: CommitActionEnum }
    | { type: 'setMarket'; value: string }
    | { type: 'setMarkets'; markets: Record<string, Market> }
    | { type: 'setLeverage'; value: number }
    | { type: 'setSelectedPool'; value: string }
    | { type: 'setInvalidAmount'; value: boolean }
    | { type: 'setSide'; value: SideEnum }
    | { type: 'reset' };

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
    market: '',
    markets: {},
};

export const SwapContext = React.createContext<Partial<ContextProps>>({});

/**
 * Wrapper store for the swap page state
 */
export const SwapStore: React.FC<Children> = ({ children }: Children) => {
    const { pools } = useContext(FactoryContext);
    const { network } = useWeb3();
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
                console.debug(`Setting leverage: ${action.value}`)
                let pool = state.markets?.[state.market]?.[action.value]?.address;
                console.debug(`Setting pool: ${pool?.slice()}`)
                return {
                    ...state, 
                    leverage: action.value,
                    selectedPool: pool
                };
            case 'setSelectedPool':
                return { ...state, selectedPool: action.value };
            case 'setInvalidAmount':
                return { ...state, invalidAmount: action.value };
            case 'setMarket':
                console.debug(`Setting market: ${action.value}`)
                const leverage = !Number.isNaN(state.leverage) ? state.leverage : 1;
                pool = state.markets?.[action.value]?.[leverage]?.address;
                console.debug(`Setting pool: ${pool?.slice()}`)
                return {
                    ...state,
                    market: action.value,
                    selectedPool: pool,
                    // set leverage if its not already
                    leverage: leverage
                }
            case 'setMarkets':
                return {
                    ...state,
                    markets: action.markets,
                };
            case 'reset':
                return {
                    ...swapDefaults,
                    commitAction: state.commitAction,
                };
            default:
                throw new Error('Unexpected action');
        }
    };

    const [swapState, swapDispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (pools?.length) {
            const markets: Record<string, Market> = {};
            pools.forEach((pool) => {
                const [leverage, marketName] = pool.name.split('-');
                // hopefully valid pool name
                if (marketName) {
                    if (!markets[marketName]) {
                        markets[marketName] = {};
                    }
                    markets[marketName][parseInt(leverage)] = pool;
                }

            })
            swapDispatch({
                type: 'setMarkets',
                markets
            });
        }
    }, [pools]);

    useEffect(() => {
        if (network) {
            swapDispatch({
                type: 'reset'
            })
        }
    }, [network])

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
