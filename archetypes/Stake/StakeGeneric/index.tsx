import React, { useEffect, useReducer, useRef } from 'react';
import { useRouter } from 'next/router';
import BigNumber from 'bignumber.js';
import { SideEnum } from '@tracer-protocol/pools-js';
import { NetworkHintContainer, NetworkHint } from '~/components/NetworkHint';
import PageTable from '~/components/PageTable';
import { MAX_SOL_UINT } from '~/constants/general';
import { useStore } from '~/store/main';
import { selectHandleTransaction } from '~/store/TransactionSlice';
import { TransactionType } from '~/store/TransactionSlice/types';
import { selectAccount, selectProvider } from '~/store/Web3Slice';
import { SideFilterEnum, LeverageFilterEnum, MarketFilterEnum, StakeSortByEnum } from '~/types/filters';
import { Farm } from '~/types/staking';

import { generalMarketFilter } from '~/utils/filters';
import { escapeRegExp } from '~/utils/helpers';
import FarmsTable from '../FarmsTable';
import FilterBar from '../FilterSelects';
import StakeModal from '../StakeModal';
import { stakeReducer, StakeAction, StakeState, FarmTableRowData } from '../state';

const getFilterFieldsFromPoolTokenFarm: (farm: Farm) => { leverage: number; side: SideEnum } = (farm) => {
    const leverageSide = farm.name.split('-')[0];
    const side = leverageSide.slice(-1);
    const leverage = leverageSide.slice(0, -1);
    return {
        leverage: parseInt(leverage),
        side: side === 'L' ? SideEnum.long : SideEnum.short,
    };
};

export const StakeGeneric = ({
    tokenType,
    title,
    subTitle,
    farms,
    refreshFarm,
    hideSideFilter,
    fetchingFarms,
    rewardsTokenUSDPrices,
}: {
    title: string;
    subTitle: string;
    tokenType: string;
    farms: Record<string, Farm>;
    refreshFarm: (farmAddress: string) => void;
    hideSideFilter?: boolean;
    fetchingFarms: boolean;
    rewardsTokenUSDPrices: Record<string, BigNumber>;
}): JSX.Element => {
    const router = useRouter();
    const hasSetFromQuery = useRef(false);
    const account = useStore(selectAccount);
    const provider = useStore(selectProvider);
    const handleTransaction = useStore(selectHandleTransaction);

    const farmTableRows: FarmTableRowData[] = Object.values(farms).map((farm) => {
        const filterFields = getFilterFieldsFromPoolTokenFarm(farm);

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
        marketFilter: MarketFilterEnum.All,
        sideFilter: SideFilterEnum.All,
        sortBy: account ? StakeSortByEnum.MyStaked : StakeSortByEnum.Name,
        stakeModalState: 'closed',
        amount: new BigNumber(0),
        invalidAmount: { isInvalid: false },
    } as StakeState);

    useEffect(() => {
        if (account && state.sortBy === StakeSortByEnum.Name) {
            dispatch({ type: 'setSortBy', sortBy: StakeSortByEnum.MyStaked });
        }
    }, [account]);

    useEffect(() => {
        const farmsArray = Object.values(farms);
        let tokenAddress;
        if (router.query.stake && !hasSetFromQuery.current) {
            if (typeof router.query.stake === 'string') {
                tokenAddress = router.query.stake;
            } else if (Array.isArray(router.query.stake)) {
                tokenAddress = router.query.stake[0];
            }
            if (tokenAddress) {
                const farm = farmsArray.find((farm) => farm.stakingToken.address === router.query.stake);
                if (farm) {
                    handleStake(farm.address);
                    hasSetFromQuery.current = true;
                }
            }
        } else if (router.query.unstake && !hasSetFromQuery.current) {
            if (typeof router.query.unstake === 'string') {
                tokenAddress = router.query.unstake;
            } else if (Array.isArray(router.query.unstake)) {
                tokenAddress = router.query.unstake[0];
            }
            if (tokenAddress) {
                const farm = farmsArray.find((farm) => farm.stakingToken.address === router.query.unstake);
                if (farm) {
                    handleUnstake(farm.address);
                    hasSetFromQuery.current = true;
                }
            }
        }
    }, [farms, router?.query?.stake, router?.query?.unstake]);

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
        const searchString = escapeRegExp(state.searchFilter.toLowerCase());
        return Boolean(farm.name.toLowerCase().match(searchString));
    };

    const sorter = (farmA: FarmTableRowData, farmB: FarmTableRowData): number => {
        switch (state.sortBy) {
            case StakeSortByEnum.Name:
                return farmA.name.localeCompare(farmB.name);
            case StakeSortByEnum.TotalValueLocked:
                return farmB.tvl.toNumber() - farmA.tvl.toNumber();
            case StakeSortByEnum.MyRewards:
                return farmB.myRewards.toNumber() - farmA.myRewards.toNumber();
            case StakeSortByEnum.MyStaked:
                return farmB.myStaked.toNumber() - farmA.myStaked.toNumber();
            default:
                return 0;
        }
    };

    const filteredTokens = farmTableRows
        .filter(sideFilter)
        .filter((farm) => generalMarketFilter(farm.name, state.marketFilter))
        .filter(leverageFilter)
        .filter(searchFilter);
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
            type: 'setMaxDecimals',
            value: farms[farmAddress].stakingTokenDecimals,
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
            type: 'setMaxDecimals',
            value: farms[farmAddress].stakingTokenDecimals,
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
            type: 'setMaxDecimals',
            value: farms[farmAddress].stakingTokenDecimals,
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
        const signer = provider?.getSigner();
        if (!signer) {
            console.error('Failed to stake: No signer');
            return;
        }
        const signingContract = contract.connect(signer);
        console.debug(`staking ${amount.times(10 ** stakingTokenDecimals).toString()} in contract at ${farmAddress}`);

        if (handleTransaction) {
            handleTransaction({
                callMethod: signingContract.stake,
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
        const signer = provider?.getSigner();
        if (!signer) {
            console.error('Failed to unstake: No signer');
            return;
        }
        const signingContract = contract.connect(signer);
        console.debug(`unstaking ${amount.times(10 ** stakingTokenDecimals).toString()} in contract at ${farmAddress}`);

        if (handleTransaction) {
            handleTransaction({
                callMethod: signingContract.withdraw,
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
        const signer = provider?.getSigner();
        if (!signer) {
            console.error('Failed to unstake: No signer');
            return;
        }
        const signingContract = contract.connect(signer);
        if (handleTransaction) {
            handleTransaction({
                callMethod: signingContract.getReward,
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
        const signer = provider?.getSigner();
        if (!signer) {
            console.error('Failed to unstake: No signer');
            return;
        }
        const signingStakingToken = stakingToken.connect(signer);

        if (handleTransaction) {
            handleTransaction({
                callMethod: signingStakingToken.approve,
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
            <PageTable.Container>
                <PageTable.Header>
                    <div>
                        <PageTable.Heading>
                            <NetworkHintContainer>
                                {title}
                                <NetworkHint />
                            </NetworkHintContainer>
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
