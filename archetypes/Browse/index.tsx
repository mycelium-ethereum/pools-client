import React, { useEffect, useReducer } from 'react';
import FilterBar from './FilterSelects/Bar';
import FilterModal from './FilterSelects/Modal';
import PoolsTable from './PoolsTable';
import InvestNav from '@components/Nav/InvestNav';
import {
    browseReducer,
    BrowseState,
    BrowseTableRowData,
    LeverageFilterEnum,
    SideFilterEnum,
    SortByEnum,
} from './state';
import { FilterFilled, SearchOutlined } from '@ant-design/icons';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import useBrowsePools from '@libs/hooks/useBrowsePools';
import { SideEnum, CommitActionEnum } from '@libs/constants';
import { useRouter } from 'next/router';

export const Browse: React.FC = () => {
    const { account } = useWeb3();

    const router = useRouter();

    const [state, dispatch] = useReducer(browseReducer, {
        search: '',
        leverage: LeverageFilterEnum.All,
        side: SideFilterEnum.All,
        sortBy: account ? SortByEnum.MyHoldings : SortByEnum.Name,
        filterModalOpen: false,
    } as BrowseState);

    useEffect(() => {
        if (account && state.sortBy === SortByEnum.Name) {
            dispatch({ type: 'setSortBy', sortBy: SortByEnum.MyHoldings });
        }
    }, [account]);

    // parse the pools rows
    const tokens = useBrowsePools();

    // TODO make these dynamic with a list of leverages given by pools
    const leverageFilter = (pool: BrowseTableRowData): boolean => {
        switch (state.leverage) {
            case LeverageFilterEnum.All:
                return true;
            case LeverageFilterEnum.One:
                return pool.leverage === 1;
            case LeverageFilterEnum.Three:
                return pool.leverage === 3;
            default:
                return false;
        }
    };

    const sideFilter = (pool: BrowseTableRowData): boolean => {
        switch (state.side) {
            case SideFilterEnum.All:
                return true;
            case SideFilterEnum.Long:
                return pool.side === 'long';
            case SideFilterEnum.Short:
                return pool.side === 'short';
            default:
                return false;
        }
    };

    const searchFilter = (token: BrowseTableRowData): boolean => {
        const searchString = state.search.toLowerCase();
        return Boolean(token.symbol.toLowerCase().match(searchString));
    };

    const sorter = (tokenA: BrowseTableRowData, tokenB: BrowseTableRowData): number => {
        switch (state.sortBy) {
            case SortByEnum.Name:
                return tokenA.symbol.localeCompare(tokenB.symbol);
            case SortByEnum.Price:
                return tokenB.lastPrice - tokenA.lastPrice;
            case SortByEnum.EffectiveGain:
                return tokenB.effectiveGain - tokenA.effectiveGain;
            case SortByEnum.TotalValueLocked:
                return tokenB.totalValueLocked - tokenA.totalValueLocked;
            case SortByEnum.MyHoldings:
                return tokenB.myHoldings - tokenA.myHoldings;
            default:
                return 0;
        }
    };

    const filteredTokens = tokens.filter(sideFilter).filter(leverageFilter).filter(searchFilter);
    const sortedFilteredTokens = filteredTokens.sort(sorter);

    const handleBuyToken = (pool: string, side: SideEnum) => {
        console.debug(`Buying/minting ${side === SideEnum.long ? 'long' : 'short'} token from pool ${pool}`);
        router.push({
            pathname: '/',
            query: {
                pool: pool,
                type: CommitActionEnum.mint,
                side: side,
            },
        });
    };

    const handleSellToken = (pool: string, side: SideEnum) => {
        console.debug(`Selling/burning ${side === SideEnum.long ? 'long' : 'short'} token from pool ${pool}`);
        router.push({
            pathname: '/',
            query: {
                pool: pool,
                type: CommitActionEnum.burn,
                side: side,
            },
        });
    };

    const SearchButton = (
        <SearchOutlined
            className="m-2 cursor-pointer md:hidden"
            onClick={() => dispatch({ type: 'setModalOpen', open: true })}
        />
    );
    const FilterButton = (
        <FilterFilled
            className="m-2 cursor-pointer md:hidden"
            onClick={() => dispatch({ type: 'setModalOpen', open: true })}
        />
    );

    return (
        <>
            <InvestNav left={SearchButton} right={FilterButton} />
            <div className="container mt-0 md:mt-20">
                <div className="p-0 md:pt-16 md:pb-12 md:px-16 mb-4 shadow-xl rounded-3xl bg-theme-background">
                    <section className="hidden md:block">
                        <h1 className="font-bold text-3xl mb-2 text-theme-text hidden md:block">Pool Tokens</h1>
                        <p className="mb-1 text-gray-500">Browse the available Tracer Pool Tokens.</p>
                        <FilterBar state={state} dispatch={dispatch} />
                    </section>
                    <PoolsTable rows={sortedFilteredTokens} onClickBuy={handleBuyToken} onClickSell={handleSellToken} />
                </div>
            </div>
            <FilterModal state={state} dispatch={dispatch} />
        </>
    );
};
