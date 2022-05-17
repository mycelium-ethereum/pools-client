import React from 'react';
import BaseFilters from '~/components/BaseFilters';
import { LogoTicker } from '~/components/General';
import TWButtonGroup from '~/components/General/TWButtonGroup';
import { MARKET_FILTER_OPTIONS, LEVERAGE_FILTER_OPTIONS, COLLATERAL_FILTER_OPTIONS } from '~/constants/filters';
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
                            <BaseFilters.Text>Power Leverage</BaseFilters.Text>
                            <BaseFilters.Dropdown
                                value={state.leverageFilter}
                                options={LEVERAGE_FILTER_OPTIONS}
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
