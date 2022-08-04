import React, { useEffect } from 'react';
import BaseFilters from '~/components/BaseFilters';
import { findTicker } from '~/components/BaseFilters/MarketFilter';
import { Logo, LogoTicker } from '~/components/General/Logo';
import TWButtonGroup from '~/components/General/TWButtonGroup';
import { useStore } from '~/store/main';
import { selectNetwork } from '~/store/Web3Slice';
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
    const network = useStore(selectNetwork);
    const onMarketSelect = (val: string) => dispatch({ type: 'setMarketFilter', market: val as MarketFilterEnum });
    const onCollateralFilterSelect = (val: string) =>
        dispatch({ type: 'setCollateralFilter', collateral: val as CollateralFilterEnum });
    const onLeverageFilterSelect = (val: string) =>
        dispatch({ type: 'setLeverageFilter', leverage: val as LeverageFilterEnum });
    const onSearchInputChange = (search: string) => dispatch({ type: 'setSearch', search });
    const onSetDenotation = (option: number) => dispatch({ type: 'setDenotation', denotation: option as DeltaEnum });
    const onRebalanceFocus = (option: number) =>
        dispatch({ type: 'setRebalanceFocus', focus: option as RebalanceEnum });

    const onResetFilters = () => {
        onMarketSelect(MarketFilterEnum.All);
        onCollateralFilterSelect(CollateralFilterEnum.All);
        onLeverageFilterSelect(LeverageFilterEnum.All);
    };

    useEffect(() => {
        if (network) {
            onMarketSelect(MarketFilterEnum.All);
            onCollateralFilterSelect(CollateralFilterEnum.All);
            onLeverageFilterSelect(LeverageFilterEnum.All);
        }
    }, [network]);

    return (
        <BaseFilters.Container>
            <BaseFilters.SearchInput placeholder="Search" value={state.search} onChange={onSearchInputChange} />
            <BaseFilters.FilterPopup
                preview={
                    <BaseFilters.Preview>
                        <BaseFilters.FilterIcon />
                        {state.marketFilter === MarketFilterEnum.All &&
                            state.leverageFilter === LeverageFilterEnum.All &&
                            state.collateralFilter === CollateralFilterEnum.All &&
                            `Filter Results`}
                        {state.marketFilter !== MarketFilterEnum.All && (
                            <>
                                <Logo ticker={findTicker(state.marketFilter) as LogoTicker} className="mr-2 inline" />
                                {state.marketFilter}
                            </>
                        )}
                        {state.collateralFilter !== CollateralFilterEnum.All && `, `}
                        {state.collateralFilter !== CollateralFilterEnum.All && `${state.collateralFilter}`}
                        {state.leverageFilter !== LeverageFilterEnum.All && `, `}
                        {state.leverageFilter !== LeverageFilterEnum.All && `${state.leverageFilter}x`}
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
                            <BaseFilters.Text>Leverage</BaseFilters.Text>
                            <BaseFilters.LeverageFilter
                                leverageFilter={state.leverageFilter}
                                onSelect={onLeverageFilterSelect}
                                network={network}
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
                    <BaseFilters.ResetButton onClick={onResetFilters}>Reset Filter</BaseFilters.ResetButton>
                </BaseFilters.Content>
            </BaseFilters.FilterPopup>
        </BaseFilters.Container>
    );
};

export default FilterSelects;
