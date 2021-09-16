import React, { useEffect, useReducer } from 'react';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import FilterBar from '../FilterSelects/Bar';
import FilterModal from '../FilterSelects/Modal';
import FarmsTable from '../FarmsTable';
import { Container } from '@components/General';
import { MAX_SOL_UINT } from '@libs/constants';
import {
    stakeReducer,
    StakeAction,
    StakeState,
    FarmTableRowData,
    LeverageFilterEnum,
    SideFilterEnum,
    SortByEnum,
} from '../state';
import { FilterFilled, SearchOutlined } from '@ant-design/icons';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { useTransactionContext } from '@context/TransactionContext';
import FarmNav from '@components/Nav/FarmNav';
import StakeModal from '../StakeModal';
import { Farm } from '@libs/types/Staking';

export default (({ tokenType, title, subTitle, farms, refreshFarm }) => {
    const { account } = useWeb3();
    const { handleTransaction } = useTransactionContext();

    const farmTableRows: FarmTableRowData[] = Object.values(farms).map((farm) => ({
        farm: farm.address,
        tokenAddress: farm.stakingToken.address,
        name: farm.name,
        leverage: 1,
        side: 'long',
        apy: farm.apy.toNumber(),
        totalStaked: farm.totalStaked.toNumber(),
        myStaked: farm.myStaked.toNumber(),
        myRewards: farm.myRewards.toNumber(),
        stakingTokenBalance: farm.stakingTokenBalance,
        rewardsPerYear: farm.rewardsPerYear,
    }));

    const [state, dispatch] = useReducer(stakeReducer, {
        search: '',
        leverage: LeverageFilterEnum.All,
        side: SideFilterEnum.All,
        sortBy: account ? SortByEnum.MyStaked : SortByEnum.Name,
        filterModalOpen: false,
        stakeModalState: 'closed',
        amount: new BigNumber(0),
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

    const handleStake = (farmAddress: string) => {
        dispatch({
            type: 'setSelectedFarm',
            farm: farmAddress,
        });
        dispatch({
            type: 'setStakeModalBalance',
            balance: farms[farmAddress].stakingTokenBalance,
        });
        dispatch({
            type: 'setAmount',
            amount: new BigNumber(0),
        });
        dispatch({
            type: 'setStakeModalState',
            state: 'stake',
        });
    };

    const handleUnstake = (farmAddress: string) => {
        dispatch({
            type: 'setSelectedFarm',
            farm: farmAddress,
        });
        dispatch({
            type: 'setStakeModalBalance',
            balance: farms[farmAddress].myStaked,
        });
        dispatch({
            type: 'setAmount',
            amount: new BigNumber(0),
        });
        dispatch({
            type: 'setStakeModalState',
            state: 'unstake',
        });
    };

    const handleClaim = (farmAddress: string) => {
        dispatch({
            type: 'setSelectedFarm',
            farm: farmAddress,
        });
        dispatch({
            type: 'setStakeModalBalance',
            balance: farms[farmAddress].myRewards,
        });
        dispatch({
            type: 'setAmount',
            amount: farms[farmAddress].myRewards,
        });
        dispatch({
            type: 'setStakeModalState',
            state: 'claim',
        });
    };

    const stake = (farmAddress: string, amount: BigNumber) => {
        const farm = farms[farmAddress];
        const { contract, stakingTokenDecimals } = farm;
        console.debug(`staking ${amount.times(10 ** stakingTokenDecimals).toString()} in contract at ${farmAddress}`);

        if (handleTransaction) {
            handleTransaction(contract.stake, [amount.times(10 ** stakingTokenDecimals).toFixed()], {
                onSuccess: () => {
                    refreshFarm(farmAddress);
                    dispatch({
                        type: 'reset',
                    });
                },
            });
        }
    };

    const unstake = (farmAddress: string, amount: BigNumber) => {
        const farm = farms[farmAddress];
        const { contract, stakingTokenDecimals } = farm;
        console.debug(`unstaking ${amount.times(10 ** stakingTokenDecimals).toString()} in contract at ${farmAddress}`);

        if (handleTransaction) {
            handleTransaction(contract.withdraw, [amount.times(10 ** stakingTokenDecimals).toFixed()], {
                onSuccess: () => {
                    console.log('UNSTAKE ON SUCCESS');
                    refreshFarm(farmAddress);
                    dispatch({
                        type: 'reset',
                    });
                },
            });
        }
    };

    const claim = (farmAddress: string) => {
        const farm = farms[farmAddress];
        const { contract } = farm;

        if (handleTransaction) {
            handleTransaction(contract.getReward, [], {
                onSuccess: () => {
                    refreshFarm(farmAddress);
                    dispatch({
                        type: 'reset',
                    });
                },
            });
        }
    };

    const approve = (farmAddress: string) => {
        const farm = farms[farmAddress];
        const { stakingToken } = farm;

        if (handleTransaction) {
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
                        <h1 className="font-bold pb-4 text-3xl text-cool-gray-900 sm:none md:block">{title}</h1>
                        <p className="mb-1 text-gray-500">{subTitle}</p>
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
            <StakeModalWithState
                state={state}
                tokenType={tokenType}
                dispatch={dispatch}
                approve={approve}
                stake={stake}
                unstake={unstake}
                claim={claim}
            />
        </>
    );
}) as React.FC<{
    title: string;
    subTitle: string;
    tokenType: string;
    farms: Record<string, Farm>;
    refreshFarm: (farmAddress: string) => void;
}>;

const StakeModalWithState: React.FC<{
    state: StakeState;
    tokenType: string;
    approve: (farmAddress: string) => void;
    stake: (farmAddress: string, amount: BigNumber) => void;
    unstake: (farmAddress: string, amount: BigNumber) => void;
    claim: (farmAddress: string) => void;
    dispatch: React.Dispatch<StakeAction>;
}> = ({ state, tokenType, approve, stake, unstake, claim, dispatch }) => {
    switch (state.stakeModalState) {
        case 'stake':
            return (
                <StakeModal
                    state={state}
                    dispatch={dispatch}
                    onStake={stake}
                    onApprove={approve}
                    title={`Stake ${tokenType} Tokens`}
                    btnLabel="Stake"
                />
            );
        case 'unstake':
            return (
                <StakeModal
                    state={state}
                    dispatch={dispatch}
                    onStake={unstake}
                    onApprove={approve}
                    title={`Unstake ${tokenType} Tokens`}
                    btnLabel="Unstake"
                />
            );
        case 'claim':
            return (
                <StakeModal
                    state={state}
                    dispatch={dispatch}
                    onStake={claim}
                    onApprove={approve}
                    title={`Claim ${tokenType} Tokens Reward`}
                    btnLabel="Claim"
                />
            );
        case 'closed':
        default:
            return null;
    }
};

const FarmContainer = styled.div`
    @media (max-width: 768px) {
        padding: 0;
    }
    background: var(--color-background);
    box-shadow: 4px 4px 50px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 48px 32px;
`;
