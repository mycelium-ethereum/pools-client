import React, { useEffect } from 'react';
import BaseFilters from '~/components/BaseFilters';
import TooltipSelector, { TooltipKeys } from '~/components/Tooltips/TooltipSelector';
import { SIDE_OPTIONS, STAKE_SORT_BY_OPTIONS } from '~/constants/filters';
import { useStore } from '~/store/main';
import { selectNetwork } from '~/store/Web3Slice';
import {
    CollateralFilterEnum,
    LeverageFilterEnum,
    MarketFilterEnum,
    SideFilterEnum,
    StakeSortByEnum,
} from '~/types/filters';
import { StakeAction, StakeState } from '../state';

interface FilterSelectsProps {
    state: StakeState;
    dispatch: React.Dispatch<StakeAction>;
    hideSideFilter?: boolean;
}

const FilterSelects = ({ state, dispatch, hideSideFilter }: FilterSelectsProps): JSX.Element => {
    const network = useStore(selectNetwork);

    const onMarketSelect = (val: string) => dispatch({ type: 'setMarketFilter', market: val as MarketFilterEnum });
    const onCollateralFilterSelect = (val: string) =>
        dispatch({ type: 'setCollateralFilter', collateral: val as CollateralFilterEnum });
    const onLeverageFilterSelect = (val: string) =>
        dispatch({ type: 'setLeverageFilter', leverage: val as LeverageFilterEnum });
    const onSearchInputChange = (search: string) => dispatch({ type: 'setSearchFilter', search });
    const onSideFilterSelect = (val: string) => dispatch({ type: 'setSideFilter', side: val as SideFilterEnum });
    const onSortByFilterSelect = (val: string) => dispatch({ type: 'setSortBy', sortBy: val as StakeSortByEnum });

    useEffect(() => {
        if (network) {
            onMarketSelect(MarketFilterEnum.All);
            onLeverageFilterSelect(LeverageFilterEnum.All);
            onCollateralFilterSelect(CollateralFilterEnum.All);
        }
    }, [network]);

    return (
        <BaseFilters.Container>
            <BaseFilters.SearchInput placeholder="Search" value={state.searchFilter} onChange={onSearchInputChange} />
            <BaseFilters.FilterPopup
                preview={
                    <BaseFilters.Preview>
                        <BaseFilters.FilterIcon />
                        Filter Results
                    </BaseFilters.Preview>
                }
                buttonClasses="action-button"
            >
                <BaseFilters.Content>
                    <div>
                        <BaseFilters.Heading>Market</BaseFilters.Heading>
                        <BaseFilters.MarketFilter
                            marketFilter={state.marketFilter}
                            onMarketSelect={onMarketSelect}
                            network={network}
                        />
                    </div>
                    <BaseFilters.Wrapper>
                        <BaseFilters.DropdownContainer>
                            <BaseFilters.Text>Collateral</BaseFilters.Text>
                            <BaseFilters.CollateralFilter
                                collateralFilter={state.collateralFilter}
                                onSelect={onCollateralFilterSelect}
                                network={network}
                            />
                        </BaseFilters.DropdownContainer>
                        <BaseFilters.DropdownContainer>
                            <TooltipSelector tooltip={{ key: TooltipKeys.PowerLeverage }}>
                                <BaseFilters.Text>Power Leverage</BaseFilters.Text>
                            </TooltipSelector>
                            <BaseFilters.LeverageFilter
                                leverageFilter={state.leverageFilter}
                                onSelect={onLeverageFilterSelect}
                                network={network}
                            />
                        </BaseFilters.DropdownContainer>
                    </BaseFilters.Wrapper>
                    <BaseFilters.Wrapper>
                        {!hideSideFilter && (
                            <BaseFilters.DropdownContainer>
                                <BaseFilters.Text>Side</BaseFilters.Text>
                                <BaseFilters.Dropdown
                                    value={state.sideFilter}
                                    options={SIDE_OPTIONS}
                                    onSelect={onSideFilterSelect}
                                />
                            </BaseFilters.DropdownContainer>
                        )}
                        <BaseFilters.DropdownContainer>
                            <BaseFilters.Text>Sort</BaseFilters.Text>
                            <BaseFilters.Dropdown
                                value={state.sortBy}
                                options={STAKE_SORT_BY_OPTIONS}
                                onSelect={onSortByFilterSelect}
                            />
                        </BaseFilters.DropdownContainer>
                    </BaseFilters.Wrapper>
                </BaseFilters.Content>
            </BaseFilters.FilterPopup>
        </BaseFilters.Container>
    );
};

export default FilterSelects;
