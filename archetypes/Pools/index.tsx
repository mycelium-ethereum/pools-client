import React, { useEffect, useReducer } from 'react';
import FilterBar from './FilterSelects/Bar';
import PoolsTable from './PoolsTable';
import {
    browseReducer,
    BrowseState,
    BrowseTableRowData,
    DeltaEnum,
    LeverageEnum,
    MarketFilterEnum,
    RebalanceEnum,
    SortByEnum,
} from './state';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import useBrowsePools from '@libs/hooks/useBrowsePools';
import { CommitActionEnum, SideEnum } from '@libs/constants';
import { noDispatch, useSwapContext } from '@context/SwapContext';
import MintBurnModal from './MintBurnModal';
import { marketFilter } from '@libs/utils/functions';
import Loading from '@components/General/Loading';

export const Browse: React.FC = () => {
    const { account } = useWeb3();
    const { swapDispatch = noDispatch } = useSwapContext();

    const [state, dispatch] = useReducer(browseReducer, {
        search: '',
        marketFilter: MarketFilterEnum.All,
        leverageFilter: LeverageEnum.All,
        rebalanceFocus: RebalanceEnum.next,
        sortBy: account ? SortByEnum.MyHoldings : SortByEnum.Name,
        filtersOpen: false,
        mintBurnModalOpen: false,
        deltaDenotation: DeltaEnum.Percentile,
    } as BrowseState);

    useEffect(() => {
        if (account && state.sortBy === SortByEnum.Name) {
            dispatch({ type: 'setSortBy', sortBy: SortByEnum.MyHoldings });
        }
    }, [account]);

    // parse the pools rows
    const { rows: tokens } = useBrowsePools();

    const leverageFilter = (pool: BrowseTableRowData): boolean => {
        switch (state.leverageFilter) {
            case LeverageEnum.All:
                return true;
            case LeverageEnum.One:
                return pool.name.split('-')[0] === '1';
            case LeverageEnum.Three:
                return pool.name.split('-')[0] === '3';
            default:
                return false;
        }
    };
    const searchFilter = (pool: BrowseTableRowData): boolean => {
        const searchString = state.search.toLowerCase();
        return Boolean(
            pool.name.toLowerCase().match(searchString) ||
                pool.shortToken.symbol.toLowerCase().match(searchString) ||
                pool.longToken.symbol.toLowerCase().match(searchString) ||
                pool.market.toLowerCase().match(searchString),
        );
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

    const filteredTokens = tokens
        .filter((pool) => marketFilter(pool.name, state.marketFilter))
        .filter(leverageFilter)
        .filter(searchFilter);
    const sortedFilteredTokens = filteredTokens.sort(sorter);

    const groupedSortedFilteredTokens = sortedFilteredTokens.reduce((groups, item) => {
        // @ts-ignore
        const group = groups[item.name.split('-')[1]] || [];
        group.push(item);
        // @ts-ignore
        groups[item.name.split('-')[1]] = group;
        return groups;
    }, []);

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
            <div className="container mb-10">
                <section className="mb-8">
                    <h1 className="mt-8 mb-2 px-4 sm:px-0 font-semibold text-3xl text-theme-text">Pools</h1>
                    <div className="mb-6 px-4 sm:px-0 text-sm font-light">
                        The most liquid, unique Pools with mitigated volatility decay*. Secured by Chainlink Oracles,
                        via Tracer’s SMA Wrapper. <a className="text-tracer-400 underline">Learn More</a>
                    </div>
                    <FilterBar state={state} dispatch={dispatch} />
                </section>
                {!sortedFilteredTokens.length ? <Loading className="w-10 mx-auto mt-10" /> : null}
                {Object.keys(groupedSortedFilteredTokens).map((key, index) => {
                    const dataRows = groupedSortedFilteredTokens[key as any] as BrowseTableRowData[];
                    return (
                        <div
                            key={index}
                            className="p-4 md:p-8 lg:px-16 mb-10 shadow-xl rounded sm:rounded-2xl md:rounded-3xl bg-theme-background"
                        >
                            <PoolsTable
                                rows={dataRows}
                                deltaDenotation={state.deltaDenotation}
                                onClickMintBurn={handleMintBurn}
                                showNextRebalance={state.rebalanceFocus === RebalanceEnum.next}
                            />
                        </div>
                    );
                })}
            </div>
            <MintBurnModal open={state.mintBurnModalOpen} onClose={handleModalClose} />
        </>
    );
};
