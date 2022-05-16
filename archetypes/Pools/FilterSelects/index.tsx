import React from 'react';
import BaseFilters from '~/components/BaseFilters';
import TWButtonGroup from '~/components/General/TWButtonGroup';
import { CollateralFilterEnum, LeverageFilterEnum, MarketFilterEnum } from '~/types/filters';
import * as Styles from './styles';
import { BrowseAction, BrowseState, DeltaEnum, RebalanceEnum } from '../state';

interface FilterSelectsProps {
    state: BrowseState;
    dispatch: React.Dispatch<BrowseAction>;
}

const REBALANCE_OPTIONS = [
    {
        key: RebalanceEnum.next,
        text: 'Next Rebalance',
    },
    {
        key: RebalanceEnum.last,
        text: 'Last Rebalance',
    },
];

const DENOTATION_OPTIONS = [
    {
        key: DeltaEnum.Percentile,
        text: (
            <>
                <Styles.DenotationOptions>Relative</Styles.DenotationOptions>
                <Styles.ArrowIcon />
                <Styles.ArrowIcon isGreen />
            </>
        ),
    },
    {
        key: DeltaEnum.Numeric,
        text: (
            <>
                <Styles.DenotationOptions>Absolute</Styles.DenotationOptions>
                <Styles.ArrowIcon />
                <Styles.ArrowIcon isGreen />
            </>
        ),
    },
];

const FilterSelects: React.FC<FilterSelectsProps> = ({ state, dispatch }) => {
    const onMarketSelect = (val: string) => dispatch({ type: 'setMarketFilter', market: val as MarketFilterEnum });
    const onCollateralFilterSelect = (val: string) =>
        dispatch({ type: 'setCollateralFilter', collateral: val as CollateralFilterEnum });
    const onLeverageFilterSelect = (val: string) =>
        dispatch({ type: 'setLeverageFilter', leverage: val as LeverageFilterEnum });
    const onSearchInputChange = (search: string) => dispatch({ type: 'setSearch', search });
    const onSetDenotation = (option: number) => dispatch({ type: 'setDenotation', denotation: option as DeltaEnum });
    const onRebalanceFocus = (option: number) =>
        dispatch({ type: 'setRebalanceFocus', focus: option as RebalanceEnum });

    return (
        <BaseFilters.Container>
            <BaseFilters.SearchInput placeholder="Search" value={state.search} onChange={onSearchInputChange} />
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
                        <BaseFilters.MarketFilter marketFilter={state.marketFilter} onMarketSelect={onMarketSelect} />
                    </div>
                    <BaseFilters.Wrapper>
                        <BaseFilters.DropdownContainer>
                            <BaseFilters.Text>Collateral</BaseFilters.Text>
                            <BaseFilters.CollateralFilter
                                collateralFilter={state.collateralFilter}
                                onSelect={onCollateralFilterSelect}
                            />
                        </BaseFilters.DropdownContainer>
                        <BaseFilters.DropdownContainer>
                            <BaseFilters.Text>Power Leverage</BaseFilters.Text>
                            <BaseFilters.LeverageFilter
                                leverageFilter={state.leverageFilter}
                                onSelect={onLeverageFilterSelect}
                            />
                        </BaseFilters.DropdownContainer>
                    </BaseFilters.Wrapper>
                    <BaseFilters.DropdownContainer>
                        <TWButtonGroup
                            size="responsive"
                            value={state.deltaDenotation}
                            onClick={onSetDenotation}
                            color="greyed"
                            border="rounded"
                            borderColor="greyed"
                            options={DENOTATION_OPTIONS}
                            fullWidth
                        />
                    </BaseFilters.DropdownContainer>
                    <BaseFilters.DropdownContainer>
                        <TWButtonGroup
                            size="responsive"
                            value={state.rebalanceFocus}
                            onClick={onRebalanceFocus}
                            color="tracer"
                            options={REBALANCE_OPTIONS}
                            fullWidth
                        />
                    </BaseFilters.DropdownContainer>
                </BaseFilters.Content>
            </BaseFilters.FilterPopup>
        </BaseFilters.Container>
    );
};

export default FilterSelects;
