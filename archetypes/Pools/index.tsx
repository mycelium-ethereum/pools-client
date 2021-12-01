import React, { useEffect, useReducer } from 'react';
import FilterBar from './FilterSelects/Bar';
import FilterModal from './FilterSelects/Modal';
import PoolsTable from './PoolsTable';
import {
    browseReducer,
    BrowseState,
    BrowseTableRowData,
    LeverageFilterEnum,
    RebalanceEnum,
    SideFilterEnum,
    SortByEnum,
} from './state';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import useBrowsePools from '@libs/hooks/useBrowsePools';
import { SideEnum, CommitActionEnum } from '@libs/constants';
import { noDispatch, useSwapContext } from '@context/SwapContext';

export const Browse: React.FC = () => {
    const { account } = useWeb3();
    const { swapDispatch = noDispatch } = useSwapContext();

    const [state, dispatch] = useReducer(browseReducer, {
        search: '',
        leverage: LeverageFilterEnum.All,
        side: SideFilterEnum.All,
        rebalanceFocus: RebalanceEnum.next,
        sortBy: account ? SortByEnum.MyHoldings : SortByEnum.Name,
        filterModalOpen: false,
        mintBurnModalOpen: false,
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

    const sideFilter = (_pool: BrowseTableRowData): boolean => {
        switch (state.side) {
            case SideFilterEnum.All:
                return true;
            // case SideFilterEnum.Long:
            //     return pool.side === 'long';
            // case SideFilterEnum.Short:
            //     return pool.side === 'short';
            default:
                return false;
        }
    };

    const searchFilter = (pool: BrowseTableRowData): boolean => {
        const searchString = state.search.toLowerCase();
        return Boolean(pool.name.toLowerCase().match(searchString));
    };

    const sorter = (tokenA: BrowseTableRowData, tokenB: BrowseTableRowData): number => {
        switch (state.sortBy) {
            // case SortByEnum.Name:
            //     return tokenA.symbol.split('-')[1].localeCompare(tokenB.symbol.split('-')[1]);
            // case SortByEnum.Price:
            //     return tokenB.lastPrice - tokenA.lastPrice;
            // case SortByEnum.EffectiveGain:
            //     return (
            //         calcPercentageDifference(tokenB.effectiveGain, tokenB.leverage) -
            //         calcPercentageDifference(tokenA.effectiveGain, tokenA.leverage)
            //     );
            case SortByEnum.TotalValueLocked:
                return tokenB.tvl - tokenA.tvl;
            case SortByEnum.MyHoldings:
                return tokenB.myHoldings - tokenA.myHoldings;
            default:
                return 0;
        }
    };

    const filteredTokens = tokens.filter(sideFilter).filter(leverageFilter).filter(searchFilter);
    const sortedFilteredTokens = filteredTokens.sort(sorter);

    const handleMintBurn = (pool: string, side: SideEnum, commitAction: CommitActionEnum) => {
        console.debug(`
            ${commitAction === CommitActionEnum.mint ? 'Buying/minting ' : 'Burning/selling '}
            ${side === SideEnum.long ? 'long' : 'short'} token from pool ${pool}
        `);
        swapDispatch({ type: 'setSelectedPool', value: pool });
        swapDispatch({ type: 'setSide', value: side });
        swapDispatch({ type: 'setCommitAction', value: commitAction });
        dispatch({ type: 'setMintBurnModalOpen', open: true });
        // router.push({
        //     pathname: '/',
        //     query: {
        //         pool: pool,
        //         type: CommitActionEnum.mint,
        //         side: side,
        //     },
        // });
    };

    const handleModalClose = () => {
        dispatch({
            type: 'setMintBurnModalOpen',
            open: false,
        });
    };

    return (
        <>
            <div className="container mt-0 md:mt-20">
                <div className="p-0 md:pt-16 md:pb-12 md:px-16 mb-4 shadow-xl rounded-3xl bg-theme-background">
                    <section className="hidden md:block">
                        <h1 className="font-bold text-3xl mb-2 text-theme-text hidden md:block">Pool Tokens</h1>
                        <p className="mb-1 text-gray-500">Browse the available Tracer Pool Tokens.</p>
                        <FilterBar state={state} dispatch={dispatch} />
                    </section>
                    <PoolsTable
                        rows={sortedFilteredTokens}
                        onClickMintBurn={handleMintBurn}
                        onMintBurnClose={handleModalClose}
                        mintBurnOpen={state.mintBurnModalOpen}
                        showNextRebalance={state.rebalanceFocus === RebalanceEnum.next}
                    />
                </div>
            </div>
            <FilterModal state={state} dispatch={dispatch} />
        </>
    );
};
