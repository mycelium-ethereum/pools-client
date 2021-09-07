import React, { useEffect, useReducer } from 'react';
import styled from 'styled-components';
import FilterBar from './FilterSelects/Bar';
import FilterModal from './FilterSelects/Modal';
import PoolsTable from './PoolsTable';
import { Container } from '@components/General';
import dummyPoolData from './testData';
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

export const Browse: React.FC = () => {
    const { account } = useWeb3();
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

    const pools = getPoolData();

    function getPoolData() {
        // Update this to fetch real data
        return dummyPoolData;
    }

    const leverageFilter = (pool: BrowseTableRowData): boolean => {
        switch (state.leverage) {
            case LeverageFilterEnum.All:
                return true;
            case LeverageFilterEnum.One:
                return pool.leverage === 1;
            case LeverageFilterEnum.Two:
                return pool.leverage === 2;
            case LeverageFilterEnum.Three:
                return pool.leverage === 3;
            case LeverageFilterEnum.Four:
                return pool.leverage === 4;
            case LeverageFilterEnum.Five:
                return pool.leverage === 5;
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

    const searchFilter = (pool: BrowseTableRowData): boolean => {
        const searchString = state.search.toLowerCase();
        return Boolean(pool.tokenName.toLowerCase().match(searchString));
    };

    const sorter = (poolA: BrowseTableRowData, poolB: BrowseTableRowData): number => {
        switch (state.sortBy) {
            case SortByEnum.Name:
                return poolA.tokenName.localeCompare(poolB.tokenName);
            case SortByEnum.Price:
                return poolB.lastPrice - poolA.lastPrice;
            case SortByEnum.Change24Hours:
                return poolB.change24Hours - poolA.change24Hours;
            case SortByEnum.RebalanceRate:
                return poolB.rebalanceRate - poolA.rebalanceRate;
            case SortByEnum.APY30Day:
                return poolB.APY30Days - poolA.APY30Days;
            case SortByEnum.TotalValueLocked:
                return poolB.totalValueLocked - poolA.totalValueLocked;
            case SortByEnum.MyHoldings:
                return poolB.myHoldings - poolA.myHoldings;
            default:
                return 0;
        }
    };

    const filteredPools = pools.filter(sideFilter).filter(leverageFilter).filter(searchFilter);
    const sortedFilteredPools = filteredPools.sort(sorter);

    const handleBuyToken = (address: string) => {
        console.log(`buying token with address ${address}`);
        // Trigger buy token UX
    };

    const handleSellToken = (address: string) => {
        // Trigger sell token UX
        console.log(`selling token with address ${address}`);
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
                        <p className="mb-1 text-gray-500">This is a list of latest transactions.</p>
                        <FilterBar state={state} dispatch={dispatch} />
                    </section>
                    <PoolsTable rows={sortedFilteredPools} onClickBuy={handleBuyToken} onClickSell={handleSellToken} />
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
