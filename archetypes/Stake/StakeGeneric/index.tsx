import React, { useEffect, useReducer } from 'react';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import FilterBar from '../FilterSelects/Bar';
import FilterModal from '../FilterSelects/Modal';
import FarmsTable from '../FarmsTable';
import { Container } from '@components/General';
import { MAX_SOL_UINT, SideEnum } from '@libs/constants';
import {
    stakeReducer,
    StakeAction,
    StakeState,
    LeverageFilterEnum,
    SideFilterEnum,
    SortByEnum,
    FarmTableRowData,
} from '../state';
import { FilterFilled, SearchOutlined } from '@ant-design/icons';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { useTransactionContext } from '@context/TransactionContext';
import usePoolTokens from '@libs/hooks/usePoolTokens';
import FarmNav from '@components/Nav/FarmNav';
import StakeModal from '../StakeModal';
import { Farm } from '@libs/types/Staking';
import { Logo } from '@components/General/Logo';

const getFilterFieldsFromFarm = (farm: Farm): { leverage?: number; side?: SideEnum } => {
    if (!farm.slpDetails) {
        return {};
    }
    const firstFoundPoolToken = farm.slpDetails.token0.isPoolToken ? farm.slpDetails.token0 : farm.slpDetails.token1;

    // pool tokens have format <leverage><side>-<market>
    // first character is leverage (1, 3)
    const leverage = Number(firstFoundPoolToken.symbol.slice(0, 1));
    // since all sushi pools contain the short token, we check for the presence of the long token in the pair
    // if long pool token is one of the tokens in the sushi pair, use long side
    // second character is the side (S, L)
    const poolContainsLongToken =
        farm.slpDetails.token0.symbol.slice(1, 2).startsWith('L') ||
        farm.slpDetails.token1.symbol.slice(1, 2).startsWith('L');

    return {
        leverage,
        side: poolContainsLongToken ? SideEnum.long : SideEnum.short,
    };
};

export default (({
    logo,
    tokenType,
    title,
    subTitle,
    farms,
    refreshFarm,
    hideLeverageFilter,
    hideSideFilter,
    fetchingFarms,
    strategySubtitle,
}) => {
    const { account } = useWeb3();
    const { handleTransaction } = useTransactionContext();
    const { tokenMap } = usePoolTokens();

    const farmTableRows: FarmTableRowData[] = Object.values(farms).map((farm) => {
        const filterFields = farm?.poolDetails
            ? {
                  leverage: tokenMap[farm.stakingToken.address]?.leverage,
                  side: tokenMap[farm.stakingToken.address]?.side,
              }
            : getFilterFieldsFromFarm(farm);

        return {
            farm: farm.address,
            tokenAddress: farm.stakingToken.address,
            name: farm.name,
            leverage: filterFields?.leverage,
            side: filterFields?.side,
            totalStaked: farm.totalStaked,
            myStaked: farm.myStaked,
            myRewards: farm.myRewards,
            stakingTokenBalance: farm.stakingTokenBalance,
            rewardsPerYear: farm.rewardsPerYear,
            stakingTokenSupply: farm.stakingTokenSupply,
            slpDetails: farm.slpDetails,
            poolDetails: farm.poolDetails,
        };
    });

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
                return pool.side === SideEnum.long;
            case SideFilterEnum.Short:
                return pool.side === SideEnum.short;
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
            // case SortByEnum.TotalValueLocked:
            // TODO fix this, tvl is calculated using tokenPrice so tricky to get in here
            //     return farmB.apr - farmA.apr;
            case SortByEnum.MyRewards:
                return farmB.myRewards.toNumber() - farmA.myRewards.toNumber();
            case SortByEnum.MyStaked:
                return farmB.myStaked.toNumber() - farmA.myStaked.toNumber();
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
                        <span className="align-items: inline-flex ">
                            {!!logo ? <Logo ticker={logo} className="pb-0 pr-1" /> : null}
                            <h1 className="mx-0 font-bold pb-0 pl-1s text-3xl text-cool-gray-900 sm:none flex-wrap: wrap;">
                                {title}
                            </h1>
                        </span>
                        <p className="mb-1 text-gray-500">{subTitle}</p>
                        <FilterBar
                            hideLeverageFilter={hideLeverageFilter}
                            hideSideFilter={hideSideFilter}
                            state={state}
                            dispatch={dispatch}
                        />
                    </section>
                    <FarmsTable
                        rows={sortedFilteredFarms}
                        fetchingFarms={fetchingFarms}
                        onClickClaim={handleClaim}
                        onClickUnstake={handleUnstake}
                        onClickStake={handleStake}
                        strategySubtitle={strategySubtitle}
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
    logo: string;
    title: string;
    subTitle: string;
    tokenType: string;
    farms: Record<string, Farm>;
    refreshFarm: (farmAddress: string) => void;
    hideLeverageFilter?: boolean;
    hideSideFilter?: boolean;
    fetchingFarms: boolean;
    strategySubtitle?: string;
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
                    title={`Claim ${tokenType} Token Rewards`}
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
