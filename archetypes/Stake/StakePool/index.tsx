import React, { useEffect, useReducer } from 'react';
import BigNumber from 'bignumber.js';
import { useFarms } from '@context/FarmContext';
import styled from 'styled-components';
import FilterBar from '../FilterSelects/Bar';
import FilterModal from '../FilterSelects/Modal';
import FarmsTable from '../FarmsTable';
import { Container } from '@components/General';
import { MAX_SOL_UINT } from '@libs/constants';
import { stakeReducer, StakeState, FarmTableRowData, LeverageFilterEnum, SideFilterEnum, SortByEnum } from '../state';
import { FilterFilled, SearchOutlined } from '@ant-design/icons';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { useTransactionContext } from '@context/TransactionContext';
import FarmNav from '@components/Nav/FarmNav';
import StakeModal from '../StakeModal';

export default (() => {
    const { account } = useWeb3();
    const { handleTransaction } = useTransactionContext();
    const { poolFarms: farms, refreshFarm } = useFarms();

    const farmTableRows: FarmTableRowData[] = Object.values(farms).map((farm) => ({
        farm: farm.address,
        name: farm.name,
        leverage: 1,
        side: 'long',
        apy: farm.apy.toNumber(),
        tvl: farm.tvl.toNumber(),
        myStaked: farm.myStaked.toNumber(),
        myRewards: farm.myRewards.toNumber(),
        stakingTokenBalance: farm.stakingTokenBalance,
    }));

    const [state, dispatch] = useReducer(stakeReducer, {
        search: '',
        leverage: LeverageFilterEnum.All,
        side: SideFilterEnum.All,
        sortBy: account ? SortByEnum.MyStaked : SortByEnum.Name,
        filterModalOpen: false,
        stakeModalState: 'closed',
        amount: NaN,
        invalidAmount: { isInvalid: false },
    } as StakeState);

    useEffect(() => {
        if (account && state.sortBy === SortByEnum.Name) {
            dispatch({ type: 'setSortBy', sortBy: SortByEnum.MyStaked });
        }
    }, [account]);

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
        return Boolean(farm.name.toLowerCase().match(searchString));
    };

    const sorter = (farmA: FarmTableRowData, farmB: FarmTableRowData): number => {
        switch (state.sortBy) {
            case SortByEnum.Name:
                return farmA.name.localeCompare(farmB.name);
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

    const filteredTokens = farmTableRows.filter(sideFilter).filter(leverageFilter).filter(searchFilter);
    const sortedFilteredFarms = filteredTokens.sort(sorter);

    const handleClaim = () => {
        console.debug('Claiming...');
    };

    const handleStake = (farmAddress: string) => {
        dispatch({
            type: 'setSelectedFarm',
            farm: farmAddress,
        });
        dispatch({
            type: 'setStakeModalState',
            state: 'stake',
        });
    };

    const handleUnstake = () => {
        console.debug('Unstaking...');
    };

    const stake = (farmAddress: string, amount: number) => {
        const farm = farms[farmAddress];
        const { contract, stakingTokenDecimals } = farm;
        console.debug(
            `staking ${new BigNumber(amount)
                .times(10 ** stakingTokenDecimals)
                .toString()} in contract at ${farmAddress}`,
        );

        if (handleTransaction) {
            handleTransaction(
                contract.stake, 
                [new BigNumber(amount).times(10 ** stakingTokenDecimals).toString()],
                {
                    onSuccess: () => {
                        refreshFarm(farmAddress);
                        dispatch({
                            type: 'setAmount',
                            amount: NaN
                        })
                    },
                }
            );
        }
    };

    const approve = (farmAddress: string) => {
        const farm = farms[farmAddress];
        const { stakingToken } = farm;

        if (handleTransaction) {
            console.log(stakingToken);
            handleTransaction(stakingToken.approve, [farmAddress, MAX_SOL_UINT.toString()], {
                onSuccess: () => {
                    refreshFarm(farmAddress);
                },
            });
        }
    };

    const SearchButton = (
        <SearchOutlined
            className="m-2 cursor-pointer md:hidden"
            onClick={() => dispatch({ type: 'setFilterModalOpen', open: true })}
        />
    );
    const FilterButton = (
        <FilterFilled
            className="m-2 cursor-pointer md:hidden"
            onClick={() => dispatch({ type: 'setFilterModalOpen', open: true })}
        />
    );

    return (
        <>
            <FarmNav left={SearchButton} right={FilterButton} />
            <Container className="mt-0 md:mt-[100px]">
                <FarmContainer>
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
                        onClickUnstake={handleUnstake}
                        onClickStake={handleStake}
                    />
                </FarmContainer>
            </Container>
            <FilterModal state={state} dispatch={dispatch} />
            {state.stakeModalOpen}
            <StakeModal
                state={state}
                dispatch={dispatch}
                onStake={stake}
                onApprove={approve}
                title="Stake Pool Tokens"
                btnLabel="Stake"
            />
        </>
    );
}) as React.FC;

const FarmContainer = styled.div`
    @media (max-width: 768px) {
        padding: 0;
    }
    background: var(--color-background);
    box-shadow: 4px 4px 50px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 48px 32px;
`;
