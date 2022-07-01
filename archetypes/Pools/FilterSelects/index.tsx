import React, { useEffect } from 'react';
import BaseFilters from '~/components/BaseFilters';
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

    const onResetClick = () => {
        onMarketSelect(MarketFilterEnum.All);
        onLeverageFilterSelect(LeverageFilterEnum.All);
        onCollateralFilterSelect(CollateralFilterEnum.All);
    };

    useEffect(() => {
        if (network) {
            onMarketSelect(MarketFilterEnum.All);
            onLeverageFilterSelect(LeverageFilterEnum.All);
            onCollateralFilterSelect(CollateralFilterEnum.All);
        }
    }, [network]);

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
                        <BaseFilters.HeadingContainer>
                            <BaseFilters.Heading>Market</BaseFilters.Heading>
                            <BaseFilters.ResetButton onClick={onResetClick}>Reset</BaseFilters.ResetButton>
                        </BaseFilters.HeadingContainer>
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
                </BaseFilters.Content>
            </BaseFilters.FilterPopup>
        </BaseFilters.Container>
    );
};

export default FilterSelects;
