import React from 'react';
import { Dropdown, LogoTicker } from '~/components/General';
import TWButtonGroup from '~/components/General/TWButtonGroup';
import ArrowDownIcon from '~/public/img/general/arrow-circle-down.svg';
import * as Styles from './styles';
import {
    BrowseAction,
    BrowseState,
    CollateralEnum,
    DeltaEnum,
    LeverageEnum,
    MarketFilterEnum,
    RebalanceEnum,
} from '../state';

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
                <div className="mr-2">Relative</div>
                <ArrowDownIcon className="w-4 text-red-600" />
                <ArrowDownIcon className="w-4 rotate-180 text-green-600" />
            </>
        ),
    },
    {
        key: DeltaEnum.Numeric,
        text: (
            <>
                <div className="mr-2">Absolute</div>
                <ArrowDownIcon className="w-4 text-red-600" />
                <ArrowDownIcon className="w-4 rotate-180 text-green-600" />
            </>
        ),
    },
];

const MARKET_FILTER_OPTIONS = Object.keys(MarketFilterEnum).map((key) => ({
    key: (MarketFilterEnum as any)[key],
    ticker: (key !== 'All' ? key : '') as LogoTicker,
}));

const COLLATERAL_FILTER_OPTIONS = Object.keys(CollateralEnum).map((key) => ({
    key: (CollateralEnum as any)[key],
}));

const LEVERAGE_FILTER_OPTIONS = Object.keys(LeverageEnum).map((key) => ({
    key: (LeverageEnum as any)[key],
}));

const FilterSelects: React.FC<FilterSelectsProps> = ({ state, dispatch }) => {
    const onMarketSelect = (val: string) => dispatch({ type: 'setMarketFilter', market: val as MarketFilterEnum });
    const onCollateralFilterSelect = (val: string) =>
        dispatch({ type: 'setCollateralFilter', collateral: val as CollateralEnum });
    const onLeverageFilterSelect = (val: string) =>
        dispatch({ type: 'setLeverageFilter', leverage: val as LeverageEnum });
    const onSearchInputChange = (search: string) => dispatch({ type: 'setSearch', search });
    const onSetDenotation = (option: number) => dispatch({ type: 'setDenotation', denotation: option as DeltaEnum });
    // const onFiltersOpen = () => dispatch({ type: 'setFiltersOpen', open: !state.filtersOpen });
    const onRebalanceFocus = (option: number) =>
        dispatch({ type: 'setRebalanceFocus', focus: option as RebalanceEnum });

    return (
        <Styles.Container>
            <Styles.SearchInput placeholder="Search" value={state.search} onChange={onSearchInputChange} />
            <Styles.FilterPopup
                preview={
                    <Styles.Preview>
                        <Styles.FilterIcon />
                        Filter Results
                    </Styles.Preview>
                }
                buttonClasses="action-button"
            >
                <Styles.Content>
                    <div>
                        <Styles.Heading>Market</Styles.Heading>
                        <Dropdown
                            variant="default"
                            iconSize="xs"
                            placeHolderIcon={
                                Object.entries(MarketFilterEnum).find(
                                    ([_key, val]) => val === state.marketFilter,
                                )?.[0] as LogoTicker
                            }
                            value={state.marketFilter}
                            className="mt-auto w-full"
                            options={MARKET_FILTER_OPTIONS}
                            onSelect={onMarketSelect}
                        />
                    </div>
                    <Styles.Wrapper>
                        <Styles.DropdownContainer>
                            <Styles.Heading>Collateral</Styles.Heading>
                            <Styles.Dropdown
                                value={state.collateralFilter ?? 'All'}
                                options={COLLATERAL_FILTER_OPTIONS}
                                onSelect={onCollateralFilterSelect}
                            />
                        </Styles.DropdownContainer>
                        <Styles.DropdownContainer>
                            <Styles.Heading>Power Leverage</Styles.Heading>
                            <Styles.Dropdown
                                value={state.leverageFilter}
                                options={LEVERAGE_FILTER_OPTIONS}
                                onSelect={onLeverageFilterSelect}
                            />
                        </Styles.DropdownContainer>
                    </Styles.Wrapper>
                    <Styles.DropdownContainer>
                        <TWButtonGroup
                            size="responsive"
                            value={state.deltaDenotation}
                            onClick={onSetDenotation}
                            color="greyed"
                            border="rounded"
                            borderColor="greyed"
                            options={DENOTATION_OPTIONS}
                            fullWidthButtons
                        />
                    </Styles.DropdownContainer>
                    <Styles.DropdownContainer>
                        <TWButtonGroup
                            size="responsive"
                            value={state.rebalanceFocus}
                            onClick={onRebalanceFocus}
                            color="tracer"
                            options={REBALANCE_OPTIONS}
                            fullWidthButtons
                        />
                    </Styles.DropdownContainer>
                </Styles.Content>
            </Styles.FilterPopup>
        </Styles.Container>
    );
};

export default FilterSelects;
