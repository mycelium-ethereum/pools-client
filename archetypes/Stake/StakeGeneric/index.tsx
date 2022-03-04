import React, { useEffect, useReducer } from 'react';
import BigNumber from 'bignumber.js';
import FilterBar from '../FilterSelects/Bar';
import FilterModal from '../FilterSelects/Modal';
import FarmsTable from '../FarmsTable';
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
import FarmNav from '@components/Nav/FarmNav';
import StakeModal from '../StakeModal';
import { Farm } from '@libs/types/Staking';
import { Logo, LogoTicker } from '@components/General/Logo';

const getFilterFieldsFromPoolTokenFarm: (farm: Farm) => { leverage: number; side: SideEnum } = (farm) => {
    const leverageSide = farm.name.split('-')[0];
    const side = leverageSide.slice(-1);
    const leverage = leverageSide.slice(0, -1);
    return {
        leverage: parseInt(leverage),
        side: side === 'L' ? SideEnum.long : SideEnum.short,
    };
};

const getFilterFieldsFromBPTFarm = (farm: Farm): { leverage?: number; side?: SideEnum } => {
    if (!farm.bptDetails) {
        return {};
    }

    const firstFoundPoolToken = farm.bptDetails.tokens.find((token) => token.isPoolToken);

    if (!firstFoundPoolToken) {
        return {};
    }

    // pool tokens have format <leverage><side>-<market>
    // first character is leverage (1, 3)
    const leverage = Number(firstFoundPoolToken.symbol.slice(0, 1));
    return {
        leverage,
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
    rewardsTokenUSDPrices,
}) => {
    const { account } = useWeb3();
    const { handleTransaction } = useTransactionContext();

    const farmTableRows: FarmTableRowData[] = Object.values(farms).map((farm) => {
        const filterFields = farm?.poolDetails
            ? getFilterFieldsFromPoolTokenFarm(farm)
            : getFilterFieldsFromBPTFarm(farm);

        return {
            farm: farm.address,
            tokenAddress: farm.stakingToken.address,
            name: farm.name,
            leverage: filterFields?.leverage,
            side: filterFields?.side,
            totalStaked: farm.totalStaked,
            tvl: farm.tvl,
            myStaked: farm.myStaked,
            myRewards: farm.myRewards,
            stakingTokenBalance: farm.stakingTokenBalance,
            rewardsPerYear: farm.rewardsPerYear,
            stakingTokenSupply: farm.stakingTokenSupply,
            bptDetails: farm.bptDetails,
            poolDetails: farm.poolDetails,
            link: farm.link,
            linkText: farm.linkText,
            rewardsEnded: farm.rewardsEnded,
            rewardsTokenAddress: farm.rewardsTokenAddress,
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
            case SortByEnum.TotalValueLocked:
                return farmB.tvl.toNumber() - farmA.tvl.toNumber();
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
                statusMessages: {
                    waiting: {
                        title: `Staking ${farm.name}`,
                        body: '',
                    },
                    success: {
                        title: `${farm.name} Staked`,
                        body: '',
                    },
                    error: {
                        title: `Stake ${farm.name} failed`,
                        body: '',
                    },
                },
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
                statusMessages: {
                    waiting: {
                        title: `Unstaking ${farm.name}`,
                        body: '',
                    },
                    success: {
                        title: `${farm.name} Unstaked`,
                        body: '',
                    },
                    error: {
                        title: `Unstake ${farm.name} failed`,
                        body: '',
                    },
                },
                onSuccess: () => {
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
                statusMessages: {
                    waiting: {
                        title: `Claiming TCR`,
                        body: '',
                    },
                    success: {
                        title: `TCR Claimed`,
                        body: '',
                    },
                    error: {
                        title: `Claim TCR Failed`,
                    },
                },
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
                statusMessages: {
                    waiting: {
                        title: `Unlocking ${farm.name}`,
                        body: '',
                    },
                    success: {
                        title: `${farm.name} Unlocked`,
                        body: '',
                    },
                    error: {
                        title: `Unlock ${farm.name} failed`,
                        body: '',
                    },
                },
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
            <div className="container mt-0 md:mt-7">
                <div className="p-0 md:py-20 md:px-16 shadow-xl bg-theme-background border-3xl rounded-3xl">
                    <section className="hidden md:block">
                        <span className="align-items: inline-flex ">
                            {!!logo ? <Logo ticker={logo} className="pb-0 my-2 pr-1 text-theme-text" /> : null}
                            <h1 className="mx-0 font-bold pb-0 pl-1s text-3xl text-theme-text sm:none flex-wrap: wrap;">
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
                        rewardsTokenUSDPrices={rewardsTokenUSDPrices}
                        onClickClaim={handleClaim}
                        onClickUnstake={handleUnstake}
                        onClickStake={handleStake}
                    />
                </div>
            </div>
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
    logo?: LogoTicker;
    title: string;
    subTitle: string;
    tokenType: string;
    farms: Record<string, Farm>;
    refreshFarm: (farmAddress: string) => void;
    hideLeverageFilter?: boolean;
    hideSideFilter?: boolean;
    fetchingFarms: boolean;
    rewardsTokenUSDPrices: Record<string, BigNumber>;
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
