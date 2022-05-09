import React from 'react';
import BaseFilters from '~/components/BaseFilters';
import TooltipSelector, { TooltipKeys } from '~/components/Tooltips/TooltipSelector';
import { StakeAction, StakeState, LeverageFilterEnum, SideFilterEnum, SortByEnum } from '../state';

interface FilterSelectsProps {
    state: StakeState;
    dispatch: React.Dispatch<StakeAction>;
    hideLeverageFilter?: boolean;
    hideSideFilter?: boolean;
}

const FilterSelects: React.FC<FilterSelectsProps> = ({ state, dispatch, hideLeverageFilter, hideSideFilter }) => {
    return (
        <BaseFilters.Container>
            <BaseFilters.SearchInput
                placeholder="Search"
                value={state.search}
                onChange={(search) => dispatch({ type: 'setSearch', search })}
            />
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
                    {!hideLeverageFilter && (
                        <div>
                            <TooltipSelector tooltip={{ key: TooltipKeys.PowerLeverage }}>
                                <BaseFilters.Heading>Power Leverage</BaseFilters.Heading>
                            </TooltipSelector>
                            <BaseFilters.Dropdown
                                value={state.leverage}
                                options={Object.values(LeverageFilterEnum).map((key) => ({ key }))}
                                onSelect={(val) =>
                                    dispatch({ type: 'setLeverage', leverage: val as LeverageFilterEnum })
                                }
                            />
                        </div>
                    )}
                    <BaseFilters.Wrapper>
                        {!hideSideFilter && (
                            <BaseFilters.DropdownContainer>
                                <BaseFilters.Text>Side</BaseFilters.Text>
                                <BaseFilters.Dropdown
                                    value={state.side}
                                    options={Object.values(SideFilterEnum).map((key) => ({ key }))}
                                    onSelect={(val) => dispatch({ type: 'setSide', side: val as SideFilterEnum })}
                                />
                            </BaseFilters.DropdownContainer>
                        )}
                        <BaseFilters.DropdownContainer>
                            <BaseFilters.Text>Sort</BaseFilters.Text>
                            <BaseFilters.Dropdown
                                value={state.sortBy}
                                options={Object.values(SortByEnum).map((key) => ({ key: key }))}
                                onSelect={(val) => dispatch({ type: 'setSortBy', sortBy: val as SortByEnum })}
                            />
                        </BaseFilters.DropdownContainer>
                    </BaseFilters.Wrapper>
                    <BaseFilters.DropdownContainer />
                </BaseFilters.Content>
            </BaseFilters.FilterPopup>
        </BaseFilters.Container>
    );
};

export default FilterSelects;
