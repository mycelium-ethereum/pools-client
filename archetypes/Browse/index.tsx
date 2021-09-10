import React, { useEffect, useReducer } from 'react';
import styled from 'styled-components';
import FilterBar from './FilterSelects/Bar';
import FilterModal from './FilterSelects/Modal';
import PoolsTable from './PoolsTable';
import { Container } from '@components/General';
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
import { BURN, SideEnum, MINT } from '@libs/constants';
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
            case SortByEnum.Change24Hours:
                return tokenB.change24Hours - tokenA.change24Hours;
            case SortByEnum.RebalanceRate:
                return tokenB.rebalanceRate - tokenA.rebalanceRate;
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
                type: MINT,
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
                type: BURN,
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
            <BrowseContainer>
                <BrowseModal>
                    <section className="hidden md:block">
                        <Title>Pool Tokens</Title>
                        <p className="mb-1 text-gray-500">Browse the available Tracer Pool Tokens.</p>
                        <FilterBar state={state} dispatch={dispatch} />
                    </section>
                    <PoolsTable rows={sortedFilteredTokens} onClickBuy={handleBuyToken} onClickSell={handleSellToken} />
                </BrowseModal>
            </BrowseContainer>
            <FilterModal state={state} dispatch={dispatch} />
        </>
    );
};

const Title = styled.h1`
    @media (max-width: 768px) {
        display: none;
    }
    font-style: normal;
    font-weight: bold;
    font-size: 30px;
    color: #111928;
    padding-bottom: 0.8rem;
`;

const BrowseContainer = styled(Container)`
    @media (max-width: 768px) {
        margin-top: 0;
    }
    margin-top: 100px;
`;

const BrowseModal = styled.div`
    @media (max-width: 768px) {
        padding: 0;
    }
    background: var(--color-background);
    box-shadow: 4px 4px 50px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 48px 32px;
`;
