import React from 'react';
import BaseFilters from '~/components/BaseFilters';
import { LogoTicker } from '~/components/General';
import TooltipSelector, { TooltipKeys } from '~/components/Tooltips/TooltipSelector';
import {
    MARKET_FILTER_OPTIONS,
    LEVERAGE_FILTER_OPTIONS,
    COLLATERAL_FILTER_OPTIONS,
    SIDE_OPTIONS,
    STAKE_SORT_BY_OPTIONS,
} from '~/constants/filters';
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
    const onMarketSelect = (val: string) => dispatch({ type: 'setMarketFilter', market: val as MarketFilterEnum });
    const onCollateralFilterSelect = (val: string) =>
        dispatch({ type: 'setCollateralFilter', collateral: val as CollateralFilterEnum });
    const onLeverageFilterSelect = (val: string) =>
        dispatch({ type: 'setLeverageFilter', leverage: val as LeverageFilterEnum });
    const onSearchInputChange = (search: string) => dispatch({ type: 'setSearchFilter', search });
    const onSideFilterSelect = (val: string) => dispatch({ type: 'setSideFilter', side: val as SideFilterEnum });
    const onSortByFilterSelect = (val: string) => dispatch({ type: 'setSortBy', sortBy: val as StakeSortByEnum });

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
                        <BaseFilters.Dropdown
                            variant="default"
                            iconSize="xs"
                            placeHolderIcon={
                                Object.entries(MarketFilterEnum).find(
                                    ([_key, val]) => val === state.marketFilter,
                                )?.[0] as LogoTicker
                            }
                            value={state.marketFilter}
                            options={MARKET_FILTER_OPTIONS}
                            onSelect={onMarketSelect}
                        />
                    </div>
                    <BaseFilters.Wrapper>
                        <BaseFilters.DropdownContainer>
                            <BaseFilters.Text>Collateral</BaseFilters.Text>
                            <BaseFilters.Dropdown
                                value={state.collateralFilter ?? 'All'}
                                options={COLLATERAL_FILTER_OPTIONS}
                                onSelect={onCollateralFilterSelect}
                            />
                        </BaseFilters.DropdownContainer>
                        <BaseFilters.DropdownContainer>
                            <TooltipSelector tooltip={{ key: TooltipKeys.PowerLeverage }}>
                                <BaseFilters.Text>Power Leverage</BaseFilters.Text>
                            </TooltipSelector>
                            <BaseFilters.Dropdown
                                value={state.leverageFilter}
                                options={LEVERAGE_FILTER_OPTIONS}
                                onSelect={onLeverageFilterSelect}
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
