import React, { useEffect, useReducer } from 'react';
import FilterBar from './FilterSelects/Bar';
import PoolsTable from './PoolsTable';
import {
    browseReducer,
    BrowseState,
    BrowseTableRowData,
    DeltaEnum,
    MarketFilterEnum,
    RebalanceEnum,
    SortByEnum,
} from './state';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import useBrowsePools from '@libs/hooks/useBrowsePools';
import { SideEnum, CommitActionEnum } from '@libs/constants';
import { noDispatch, useSwapContext } from '@context/SwapContext';
import MintBurnModal from './MintBurnModal';

export const Browse: React.FC = () => {
    const { account } = useWeb3();
    const { swapDispatch = noDispatch } = useSwapContext();

    const [state, dispatch] = useReducer(browseReducer, {
        search: '',
        marketFilter: MarketFilterEnum.All,
        rebalanceFocus: RebalanceEnum.next,
        sortBy: account ? SortByEnum.MyHoldings : SortByEnum.Name,
        filtersOpen: false,
        mintBurnModalOpen: false,
        deltaDenotion: DeltaEnum.Percentile,
    } as BrowseState);

    useEffect(() => {
        if (account && state.sortBy === SortByEnum.Name) {
            dispatch({ type: 'setSortBy', sortBy: SortByEnum.MyHoldings });
        }
    }, [account]);

    // parse the pools rows
    const tokens = useBrowsePools();

    const marketFilter = (pool: BrowseTableRowData): boolean => {
        switch (state.marketFilter) {
            case MarketFilterEnum.All:
                return true;
            case MarketFilterEnum.ETH:
                return pool.name.replace(/.\-/g, '').split('/')[0] === 'ETH';
            case MarketFilterEnum.BTC:
                return pool.name.replace(/.\-/g, '').split('/')[0] === 'BTC';
            default:
                return false;
        }
    };

    const searchFilter = (pool: BrowseTableRowData): boolean => {
        const searchString = state.search.toLowerCase();
        return Boolean(pool.name.toLowerCase().match(searchString));
    };

    const sorter = (poolA: BrowseTableRowData, poolB: BrowseTableRowData): number => {
        switch (state.sortBy) {
            case SortByEnum.TotalValueLocked:
                return poolB.tvl - poolA.tvl;
            case SortByEnum.MyHoldings:
                return poolB.myHoldings - poolA.myHoldings;
            default:
                return 0;
        }
    };

    const filteredTokens = tokens.filter(marketFilter).filter(searchFilter);
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
                <div className="p-4 md:pt-16 md:pb-12 md:px-8 lg:px-16 mb-4 shadow-xl rounded sm:rounded-2xl md:rounded-3xl bg-theme-background">
                    <section className="mb-8">
                        <h1 className="font-bold text-3xl mb-2 text-theme-text">Pools</h1>
                        <p className="mb-1 text-cool-gray-300 matrix:text-theme-text-secondary">
                            Browse the available Tracer Pools and Pool Tokens.
                        </p>
                        <FilterBar state={state} dispatch={dispatch} />
                    </section>
                    <PoolsTable
                        rows={sortedFilteredTokens}
                        deltaDenotion={state.deltaDenotion}
                        onClickMintBurn={handleMintBurn}
                        showNextRebalance={state.rebalanceFocus === RebalanceEnum.next}
                    />
                </div>
            </div>
            <MintBurnModal open={state.mintBurnModalOpen} onClose={handleModalClose} />
        </>
    );
};
