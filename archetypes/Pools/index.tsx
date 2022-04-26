import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import TooltipSelector, { TooltipKeys } from '~/components/Tooltips/TooltipSelector';
import { noDispatch, useSwapContext } from '~/context/SwapContext';
import useBrowsePools from '~/hooks/useBrowsePools';
import { useStore } from '~/store/main';
import { selectAccount } from '~/store/Web3Slice';
import { marketFilter } from '~/utils/filters';
import AddAltPoolModal from './AddAltPoolModal';
import FilterSelects from './FilterSelects';
import MintBurnModal from './MintBurnModal';
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
import * as Styles from './styles';

export const Browse: React.FC = () => {
    const account = useStore(selectAccount);
    const { swapDispatch = noDispatch } = useSwapContext();
    const { rows: tokens } = useBrowsePools();

    const [state, dispatch] = useReducer(browseReducer, {
        search: '',
        marketFilter: MarketFilterEnum.All,
        leverageFilter: LeverageEnum.All,
        rebalanceFocus: RebalanceEnum.next,
        sortBy: account ? SortByEnum.MyHoldings : SortByEnum.Name,
        filtersOpen: false,
        mintBurnModalOpen: false,
        addAltPoolModalOpen: false,
        deltaDenotation: DeltaEnum.Percentile,
    } as BrowseState);

    useEffect(() => {
        if (account && state.sortBy === SortByEnum.Name) {
            dispatch({ type: 'setSortBy', sortBy: SortByEnum.MyHoldings });
        }
    }, [account]);

    const leverageFilter = useCallback(
        (pool: BrowseTableRowData): boolean => {
            switch (state.leverageFilter) {
                case LeverageEnum.All:
                    return true;
                default:
                    return !!pool.name && pool.name.split('-')?.[0] === state.leverageFilter;
            }
        },
        [state.leverageFilter],
    );

    const searchFilter = useCallback(
        (pool: BrowseTableRowData): boolean => {
            const searchString = state.search.toLowerCase();
            return Boolean(
                pool.name.toLowerCase().match(searchString) ||
                    pool.shortToken.symbol.toLowerCase().match(searchString) ||
                    pool.longToken.symbol.toLowerCase().match(searchString) ||
                    pool.market.toLowerCase().match(searchString),
            );
        },
        [state.search],
    );

    const sorter = useCallback(
        (poolA: BrowseTableRowData, poolB: BrowseTableRowData): number => {
            switch (state.sortBy) {
                case SortByEnum.TotalValueLocked:
                    return poolB.tvl - poolA.tvl;
                case SortByEnum.MyHoldings:
                    return poolB.myHoldings - poolA.myHoldings;
                default:
                    return 0;
            }
        },
        [state.sortBy],
    );

    const filteredTokens = useMemo(
        () =>
            tokens
                .filter((pool) => marketFilter(pool.name, state.marketFilter))
                .filter(leverageFilter)
                .filter(searchFilter)
                .sort(sorter),
        [state.marketFilter, state.leverageFilter, state.search, state.sortBy, tokens],
    );

    const groupedSortedFilteredTokens = useMemo(
        () =>
            filteredTokens.reduce((groups, item) => {
                // @ts-ignore
                const group = groups[item.name.split('-')[1]] || [];
                group.push(item);
                // @ts-ignore
                groups[item.name.split('-')[1]] = group;
                return groups;
            }, []),
        [filteredTokens],
    );

    const handleMintBurn = useCallback((pool: string, side: SideEnum, commitAction: CommitActionEnum) => {
        console.debug(`
            ${commitAction === CommitActionEnum.mint ? 'Buying/minting ' : 'Burning/selling '}
            ${side === SideEnum.long ? 'long' : 'short'} token from pool ${pool}
        `);
        swapDispatch({ type: 'setSelectedPool', value: pool });
        swapDispatch({ type: 'setSide', value: side });
        swapDispatch({ type: 'setCommitAction', value: commitAction });
        dispatch({ type: 'setMintBurnModalOpen', open: true });
    }, []);

    const handleAltModalClose = useCallback(() => dispatch({ type: 'setAddAltPoolModalOpen', open: false }), []);
    const handleMintBurnModalClose = useCallback(() => dispatch({ type: 'setMintBurnModalOpen', open: false }), []);

    const showNextRebalance = useMemo(() => state.rebalanceFocus === RebalanceEnum.next, [state.rebalanceFocus]);

    return (
        <>
            <Styles.Container>
                <Styles.Header>
                    <div>
                        <Styles.Heading>Pools</Styles.Heading>
                        <Styles.SubHeading>
                            The most liquid, unique Pools with mitigated volatility decay*. Secured by Chainlink
                            Oracles, via Tracer’s SMA Wrapper.{' '}
                            <Styles.Link href="https://tracer-1.gitbook.io/ppv2-beta-testnet">Learn More</Styles.Link>
                        </Styles.SubHeading>
                    </div>
                    <FilterSelects state={state} dispatch={dispatch} />
                </Styles.Header>
                {!filteredTokens.length ? <Styles.Loading /> : null}
                {Object.keys(groupedSortedFilteredTokens).map((key, index) => {
                    const dataRows = groupedSortedFilteredTokens[key as any] as BrowseTableRowData[];
                    return (
                        <Styles.DataRow key={index}>
                            <PoolsTable
                                rows={dataRows}
                                deltaDenotation={state.deltaDenotation}
                                onClickMintBurn={handleMintBurn}
                                showNextRebalance={showNextRebalance}
                            />
                        </Styles.DataRow>
                    );
                })}
                <Styles.AltPoolRow>
                    <Styles.AltPoolTitle>Don’t see the pool you’re after?</Styles.AltPoolTitle>
                    <Styles.AltPoolActions>
                        <Styles.Button
                            variant="primary"
                            size="sm"
                            onClick={() => dispatch({ type: 'setAddAltPoolModalOpen', open: true })}
                        >
                            Display Alternative Pool
                        </Styles.Button>
                        <TooltipSelector tooltip={{ key: TooltipKeys.ComingSoon }}>
                            <Styles.Button variant="primary" size="sm" disabled>
                                Deploy New Pool
                            </Styles.Button>
                        </TooltipSelector>
                    </Styles.AltPoolActions>
                </Styles.AltPoolRow>
            </Styles.Container>
            {state.mintBurnModalOpen && (
                <MintBurnModal open={state.mintBurnModalOpen} onClose={handleMintBurnModalClose} />
            )}
            {state.addAltPoolModalOpen && (
                <AddAltPoolModal
                    open={state.addAltPoolModalOpen}
                    onClose={handleAltModalClose}
                    sortedFilteredTokens={filteredTokens}
                />
            )}
        </>
    );
};
