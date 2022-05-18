import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import BigNumber from 'bignumber.js';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import NetworkHint, { NetworkHintContainer } from '~/components/NetworkHint';
import PageTable from '~/components/PageTable';
import TooltipSelector, { TooltipKeys } from '~/components/Tooltips/TooltipSelector';
import { noDispatch, useSwapContext } from '~/context/SwapContext';
import useBrowsePools from '~/hooks/useBrowsePools';
import { useStore } from '~/store/main';
import { selectAccount } from '~/store/Web3Slice';
import { MarketFilterEnum, LeverageFilterEnum, SortByEnum } from '~/types/filters';
import { marketFilter } from '~/utils/filters';
import { escapeRegExp } from '~/utils/helpers';
import { getMarketLeverage } from '~/utils/poolNames';
import AddAltPoolModal from './AddAltPoolModal';
import FilterSelects from './FilterSelects';
import MintBurnModal from './MintBurnModal';
import PoolsTable from './PoolsTable';
import { browseReducer, BrowseState, BrowseTableRowData, DeltaEnum, RebalanceEnum } from './state';
import * as Styles from './styles';

export const Browse: React.FC = () => {
    const account = useStore(selectAccount);
    const { swapDispatch = noDispatch } = useSwapContext();
    const { rows: tokens, isLoading } = useBrowsePools();

    const [state, dispatch] = useReducer(browseReducer, {
        search: '',
        marketFilter: MarketFilterEnum.All,
        leverageFilter: LeverageFilterEnum.All,
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
                case LeverageFilterEnum.All:
                    return true;
                default:
                    return !!pool.name && getMarketLeverage(pool.name).toString() === state.leverageFilter;
            }
        },
        [state.leverageFilter],
    );

    const searchFilter = useCallback(
        (pool: BrowseTableRowData): boolean => {
            const searchString = escapeRegExp(state.search.toLowerCase());
            return Boolean(
                pool.name.toLowerCase().match(searchString) ||
                    pool.shortToken.symbol.toLowerCase().match(searchString) ||
                    pool.longToken.symbol.toLowerCase().match(searchString) ||
                    pool.marketSymbol.toLowerCase().match(searchString),
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

    const filteredTokens: BrowseTableRowData[] = useMemo(
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
            filteredTokens.reduce((groups, token) => {
                // @ts-ignore
                const group = groups[token.marketSymbol] || [];
                group.push(token);
                // @ts-ignore
                groups[token.marketSymbol] = group;
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
            <PageTable.Container>
                <PageTable.Header>
                    <div>
                        <PageTable.Heading>
                            <NetworkHintContainer>
                                Pools
                                <NetworkHint />
                            </NetworkHintContainer>
                        </PageTable.Heading>
                        <PageTable.SubHeading>
                            Unlocking Perpetual Pools v2 - take part in the Tracer Voyage to experience the true power
                            of DeFi.{' '}
                            <PageTable.Link href="https://tracer.finance/radar/the-tracer-voyage/">
                                Learn More.
                            </PageTable.Link>
                        </PageTable.SubHeading>
                    </div>
                    <FilterSelects state={state} dispatch={dispatch} />
                </PageTable.Header>
                {isLoading ? <Styles.Loading /> : null}
                {Object.keys(groupedSortedFilteredTokens).map((key, index) => {
                    const dataRows = groupedSortedFilteredTokens[key as any] as BrowseTableRowData[];
                    // sum of grouped pool volume
                    const oneDayVolume = dataRows.reduce(
                        (volume, row) => volume.plus(row.oneDayVolume),
                        new BigNumber(0),
                    );
                    return (
                        <Styles.DataRow key={index}>
                            <PoolsTable
                                rows={dataRows}
                                deltaDenotation={state.deltaDenotation}
                                onClickMintBurn={handleMintBurn}
                                showNextRebalance={showNextRebalance}
                                oneDayVolume={oneDayVolume}
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
            </PageTable.Container>
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
