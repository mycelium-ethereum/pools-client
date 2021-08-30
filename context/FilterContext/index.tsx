import React, { useContext, useEffect, useReducer } from 'react';
import { CurrencyType, MarketType, PoolType, SideType } from '@libs/types/General';
import { FactoryContext } from '../FactoryContext';
import { deconstructNames } from '@libs/utils';

interface ContextProps {
    filterState: FilterState;
    filterDispatch: React.Dispatch<FilterAction>;
}


const sideMap: Record<string, string> = {
    Long: 'UP',
    Short: 'DOWN',
};

// types
const PRICE_CHANGE = 0;
const TVL = 1;
export const SORT_MAP = {
    [PRICE_CHANGE]: '24h Change',
    [TVL]: 'TVL',
}

type SortType = typeof PRICE_CHANGE | typeof TVL;

export type FilterState = {
    search: string;
    
    leverage: string;
    leverageOptions: string[];

    settlementCurrency: CurrencyType | 'All';
    settlementOptions: (CurrencyType | 'All')[];

    side: SideType | 'All';
    sideOptions: (string | 'All')[];

    market: MarketType | 'All';
    markets: (MarketType | 'All')[];

    sortBy: SortType;
    sortOptions: SortType[];

    filteredPools: PoolType[];
};

export type FilterAction =
    | { type: 'setSearch'; value: string }
    | { type: 'setLeverage'; value: string | 'All' }
    | { type: 'setLeverageOptions'; value: (string | 'All')[] }
    | { type: 'setSettlementCurrency'; value: CurrencyType | 'All' }
    | { type: 'setSettlementOptions'; value: (CurrencyType | 'All')[] }
    | { type: 'setSide'; value: SideType | 'All' }
    | { type: 'setSortBy'; value: SortType }
    | { type: 'filterPools'; pools: PoolType[] };

export const defaultState: FilterState = {
    search: '',
    // side
    side: 'All',
    sideOptions: ['All', 'Long', 'Short'],
    // leverage
    leverage: 'All',
    leverageOptions: ['All', '1', '2', '32'],
    // settlement currency
    settlementCurrency: 'All',
    settlementOptions: ['All', 'DAI'],

    // selected market
    market: 'ETH/USDC',
    markets: ['ETH/USDC'],

    // table sort options
    sortBy: PRICE_CHANGE,
    sortOptions: [PRICE_CHANGE, TVL],

    filteredPools: [],
};

export const FilterContext = React.createContext<Partial<ContextProps>>({});

/**
 * Wrapper store for the swap page state
 */
export const FilterStore: React.FC = ({ children }) => {
    const { pools } = useContext(FactoryContext);

    const initialState: FilterState = defaultState;

    const reducer: (state: FilterState, action: FilterAction) => FilterState = (state, action) => {
        switch (action.type) {
            case 'setSearch':
                return { ...state, search: action.value };
            case 'setSide':
                return { ...state, side: action.value };
            case 'setLeverage':
                return { ...state, leverage: action.value };
            case 'setSettlementCurrency':
                return { ...state, settlementCurrency: action.value };
            case 'setSettlementOptions':
                return {
                    ...state,
                    settlementOptions: action.value,
                };
            case 'setLeverageOptions':
                return {
                    ...state,
                    leverageOptions: action.value,
                };
            case 'filterPools':
                let filteredPools_: PoolType[] = action.pools;
                if (state.leverage !== 'All') {
                    filteredPools_ = filteredPools_.filter((value) => value.name.includes(state.leverage));
                }
                if (state.settlementCurrency !== 'All') {
                    filteredPools_ = filteredPools_.filter((value) => value.name.includes(state.settlementCurrency));
                }
                if (state.side !== 'All') {
                    filteredPools_ = filteredPools_.filter((value) =>
                        value.name.includes(sideMap[state.side as string]),
                    );
                }
                if (state.search !== '') {
                    const text = state.search.toLowerCase();
                    let regEx_ = '';
                    // construct regex to test all substrings of search string
                    for (let i = 0; i < text.length; i++) {
                        if (i === text.length - 1) {
                            regEx_ += text.slice();
                        } else {
                            regEx_ += text.slice(0, i + 1) + '|';
                        }
                    }
                    regEx_ += '';
                    const regEx = new RegExp(regEx_);
                    filteredPools_ = filteredPools_.filter((value) => regEx.test(value.name.toLowerCase()));
                    // sort filtered pools in order of matching expression
                    // Strings that match more characters display first
                    const regExSplit = regEx_.split('|').reverse();
                    filteredPools_ = filteredPools_.sort(
                        (a, b) =>
                            getSortRank(a.name.toLowerCase(), regExSplit) -
                            getSortRank(b.name.toLowerCase(), regExSplit),
                    );
                }
                return {
                    ...state,
                    filteredPools: filteredPools_,
                };
            default:
                throw new Error('Unexpected action');
        }
    };

    const [filterState, filterDispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (pools && pools?.length) {
            const { leverageOptions, settlementOptions } = deconstructNames(pools);
            filterDispatch({ type: 'setSettlementOptions', value: settlementOptions });
            filterDispatch({ type: 'setLeverageOptions', value: leverageOptions });
            filterDispatch({ type: 'filterPools', pools: pools });
        }
    }, [pools]);

    useEffect(() => {
        if (pools) {
            filterDispatch({ type: 'filterPools', pools: pools });
        }
    }, [filterState?.leverage, filterState?.side, filterState?.settlementCurrency, filterState?.search]);

    return (
        <FilterContext.Provider
            value={{
                filterState,
                filterDispatch,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};

export const noDispatch: () => void = () => console.error('Filter dispatch not defined');

const getSortRank: (word: string, expressions: string[]) => number = (word, expressions) => {
    for (let i = 0; i < expressions.length; i++) {
        if (word.indexOf(expressions[i]) !== -1) {
            return i;
        }
    }
    return expressions.length;
};


