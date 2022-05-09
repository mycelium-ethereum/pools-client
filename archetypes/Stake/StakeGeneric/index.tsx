import React, { useEffect, useReducer } from 'react';
import BigNumber from 'bignumber.js';
import { SideEnum } from '@tracer-protocol/pools-js';
import { Logo, LogoTicker } from '~/components/General/Logo';
import FarmNav from '~/components/Nav/FarmNav';
import PageTable from '~/components/PageTable';
import { MAX_SOL_UINT } from '~/constants/general';
import { useStore } from '~/store/main';
import { selectHandleTransaction } from '~/store/TransactionSlice';
import { TransactionType } from '~/store/TransactionSlice/types';
import { selectAccount } from '~/store/Web3Slice';
import { SideFilterEnum, LeverageFilterEnum } from '~/types/filters';
import { Farm } from '~/types/staking';

import FarmsTable from '../FarmsTable';
import FilterBar from '../FilterSelects';
import StakeModal from '../StakeModal';
import { stakeReducer, StakeAction, StakeState, SortByEnum, FarmTableRowData } from '../state';

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

export const StakeGeneric = ({
    logo,
    tokenType,
    title,
    subTitle,
    farms,
    refreshFarm,
    hideSideFilter,
    fetchingFarms,
    rewardsTokenUSDPrices,
}: {
    logo?: LogoTicker;
    title: string;
    subTitle: string;
    tokenType: string;
    farms: Record<string, Farm>;
    refreshFarm: (farmAddress: string) => void;
    hideSideFilter?: boolean;
    fetchingFarms: boolean;
    rewardsTokenUSDPrices: Record<string, BigNumber>;
}): JSX.Element => {
    const account = useStore(selectAccount);
    const handleTransaction = useStore(selectHandleTransaction);

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
        searchFilter: '',
        leverageFilter: LeverageFilterEnum.All,
        sideFilter: SideFilterEnum.All,
        sortBy: account ? SortByEnum.MyStaked : SortByEnum.Name,
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
        switch (state.leverageFilter) {
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
        switch (state.sideFilter) {
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
        const searchString = state.searchFilter.toLowerCase();
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
            handleTransaction({
                callMethod: contract.stake,
                params: [amount.times(10 ** stakingTokenDecimals).toFixed()],
                type: TransactionType.FARM_STAKE_WITHDRAW,
                injectedProps: {
                    farmName: farm.name,
                    type: 'stake',
                },
                callBacks: {
                    onSuccess: () => {
                        refreshFarm(farmAddress);
                        dispatch({
                            type: 'reset',
                        });
                    },
                },
            });
        }
    };

    const unstake = (farmAddress: string, amount: BigNumber) => {
        const farm = farms[farmAddress];
        const { contract, stakingTokenDecimals } = farm;
        console.debug(`unstaking ${amount.times(10 ** stakingTokenDecimals).toString()} in contract at ${farmAddress}`);

        if (handleTransaction) {
            handleTransaction({
                callMethod: contract.withdraw,
                params: [amount.times(10 ** stakingTokenDecimals).toFixed()],
                type: TransactionType.FARM_STAKE_WITHDRAW,
                injectedProps: {
                    farmName: farm.name,
                    type: 'withdraw',
                },
                callBacks: {
                    onSuccess: () => {
                        refreshFarm(farmAddress);
                        dispatch({
                            type: 'reset',
                        });
                    },
                },
            });
        }
    };

    const claim = (farmAddress: string) => {
        const farm = farms[farmAddress];
        const { contract } = farm;
        if (handleTransaction) {
            handleTransaction({
                callMethod: contract.getReward,
                params: [],
                type: TransactionType.FARM_CLAIM,
                injectedProps: undefined,
                callBacks: {
                    onSuccess: () => {
                        refreshFarm(farmAddress);
                        dispatch({
                            type: 'reset',
                        });
                    },
                },
            });
        }
    };

    const approve = (farmAddress: string) => {
        const farm = farms[farmAddress];
        const { stakingToken } = farm;

        if (handleTransaction) {
            handleTransaction({
                callMethod: stakingToken.approve,
                params: [farmAddress, MAX_SOL_UINT],
                type: TransactionType.APPROVE,
                injectedProps: {
                    tokenSymbol: farm.name,
                },
                callBacks: {
                    onSuccess: () => {
                        refreshFarm(farmAddress);
                    },
                },
            });
        }
    };

    return (
        <>
            <FarmNav />
            <PageTable.Container>
                <PageTable.Header>
                    <div>
                        <PageTable.Heading>
                            {!!logo ? <Logo ticker={logo} className="my-2 inline pb-0 pr-1 text-theme-text" /> : null}
                            {title}
                        </PageTable.Heading>
                        <PageTable.SubHeading>{subTitle}</PageTable.SubHeading>
                    </div>
                    <FilterBar hideSideFilter={hideSideFilter} state={state} dispatch={dispatch} />
                </PageTable.Header>
                <FarmsTable
                    rows={sortedFilteredFarms}
                    fetchingFarms={fetchingFarms}
                    rewardsTokenUSDPrices={rewardsTokenUSDPrices}
                    onClickClaim={handleClaim}
                    onClickUnstake={handleUnstake}
                    onClickStake={handleStake}
                />
            </PageTable.Container>
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
};

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

export default StakeGeneric;
