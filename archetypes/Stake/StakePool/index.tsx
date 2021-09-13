import React, { useEffect, useReducer } from 'react';
import styled from 'styled-components';
import FilterBar from '../FilterSelects/Bar';
import FilterModal from '../FilterSelects/Modal';
import FarmsTable from '../FarmsTable';
import { Container } from '@components/General';
import { browseReducer, BrowseState, FarmTableRowData, LeverageFilterEnum, SideFilterEnum, SortByEnum } from '../state';
import { FilterFilled, SearchOutlined } from '@ant-design/icons';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import FarmNav from '@components/Nav/FarmNav';

export default (() => {
    const { account } = useWeb3();

    const [state, dispatch] = useReducer(browseReducer, {
        search: '',
        leverage: LeverageFilterEnum.All,
        side: SideFilterEnum.All,
        sortBy: account ? SortByEnum.MyStaked : SortByEnum.Name,
        filterModalOpen: false,
    } as BrowseState);

    useEffect(() => {
        if (account && state.sortBy === SortByEnum.Name) {
            dispatch({ type: 'setSortBy', sortBy: SortByEnum.MyStaked });
        }
    }, [account]);

    // parse the pools rows
    const farms: FarmTableRowData[] = [
        {
            farm: '1L-ETH/USDC',
            tokenSymbol: '1L-ETH/USDC',
            leverage: 1,
            side: 'long',
            apy: 0,
            tvl: 0,
            myStaked: 0,
            myRewards: 0,
        },
    ];

    // TODO make these dynamic with a list of leverages given by pools
    const leverageFilter = (pool: FarmTableRowData): boolean => {
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

    const sideFilter = (pool: FarmTableRowData): boolean => {
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

    const searchFilter = (farm: FarmTableRowData): boolean => {
        const searchString = state.search.toLowerCase();
        return Boolean(farm.tokenSymbol.toLowerCase().match(searchString));
    };

    const sorter = (farmA: FarmTableRowData, farmB: FarmTableRowData): number => {
        switch (state.sortBy) {
            case SortByEnum.Name:
                return farmA.tokenSymbol.localeCompare(farmB.tokenSymbol);
            case SortByEnum.TotalValueLocked:
                return farmB.apy - farmA.apy;
            case SortByEnum.MyRewards:
                return farmB.myRewards - farmA.myRewards;
            case SortByEnum.MyStaked:
                return farmB.myStaked - farmA.myStaked;
            default:
                return 0;
        }
    };

    const filteredTokens = farms.filter(sideFilter).filter(leverageFilter).filter(searchFilter);
    const sortedFilteredFarms = filteredTokens.sort(sorter);

    const handleClaim = () => {
        console.debug('Claiming...');
    };

    const handleStake = () => {
        console.debug('Staking...');
    };

    const handleUnstake = () => {
        console.debug('Unstaking...');
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
            <FarmNav left={SearchButton} right={FilterButton} />
            <Container className="mt-0 md:mt-[100px]">
                <BrowseModal>
                    <section className="hidden md:block">
                        <h1 className="font-bold pb-4 text-3xl text-cool-gray-900 sm:none md:block">
                            Pool Token Farms
                        </h1>
                        <p className="mb-1 text-gray-500">Stake Pool Tokens and earn TCR.</p>
                        <FilterBar state={state} dispatch={dispatch} />
                    </section>
                    <FarmsTable
                        rows={sortedFilteredFarms}
                        onClickClaim={handleClaim}
                        onClickUnstake={handleStake}
                        onClickStake={handleUnstake}
                    />
                </BrowseModal>
            </Container>
            <FilterModal state={state} dispatch={dispatch} />
        </>
    );
}) as React.FC;

const BrowseModal = styled.div`
    @media (max-width: 768px) {
        padding: 0;
    }
    background: var(--color-background);
    box-shadow: 4px 4px 50px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 48px 32px;
`;
