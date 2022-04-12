import React from 'react';
import { Dropdown, HiddenExpand, LogoTicker } from '~/components/General';
import Button from '~/components/General/Button';
import { SearchInput } from '~/components/General/SearchInput';
import TWButtonGroup from '~/components/General/TWButtonGroup';
import TooltipSelector, { TooltipKeys } from '~/components/Tooltips/TooltipSelector';

import ArrowDownIcon from '~/public/img/general/arrow-circle-down.svg';
import FilterToggleIcon from '~/public/img/general/filters.svg';
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

const REBALANCE_OPTIONS_DESKTOP = [
    {
        key: RebalanceEnum.next,
        text: 'Next Rebalance',
    },
    {
        key: RebalanceEnum.last,
        text: 'Last Rebalance',
    },
    {
        key: RebalanceEnum.historic,
        text: 'Historic Data',
        disabled: {
            optionKey: TooltipKeys.ComingSoon,
        },
    },
];

const REBALANCE_OPTIONS_MOBILE = [
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
    const onFiltersOpen = () => dispatch({ type: 'setFiltersOpen', open: !state.filtersOpen });
    const onRebalanceFocus = (option: number) =>
        dispatch({ type: 'setRebalanceFocus', focus: option as RebalanceEnum });

    return (
        <section>
            <div className="mb-2 w-full">
                <div className="lg:flex">
                    <div className="mr-4 hidden flex-col lg:flex">
                        <h3 className="mb-1 text-theme-text">Market</h3>
                        <Dropdown
                            variant="tracer"
                            iconSize="xs"
                            placeHolderIcon={
                                Object.entries(MarketFilterEnum).find(
                                    ([_key, val]) => val === state.marketFilter,
                                )?.[0] as LogoTicker
                            }
                            value={state.marketFilter}
                            className="mt-auto w-48"
                            options={MARKET_FILTER_OPTIONS}
                            onSelect={onMarketSelect}
                        />
                    </div>
                    <div className="mr-4 hidden flex-col lg:flex">
                        <h3 className="mb-1 text-theme-text">Collateral</h3>
                        <Dropdown
                            value={state.collateralFilter ?? 'All'}
                            className="mt-auto w-32"
                            options={COLLATERAL_FILTER_OPTIONS}
                            onSelect={onCollateralFilterSelect}
                        />
                    </div>
                    <div className="mr-4 hidden flex-col lg:flex">
                        <h3 className="mb-1 text-theme-text">Power Leverage</h3>
                        <Dropdown
                            value={state.leverageFilter}
                            className="mt-auto w-32"
                            options={LEVERAGE_FILTER_OPTIONS}
                            onSelect={onLeverageFilterSelect}
                        />
                    </div>
                    <div className="mr-4 hidden flex-grow items-end lg:flex">
                        <SearchInput
                            className="w-60"
                            placeholder="Search"
                            value={state.search}
                            onChange={onSearchInputChange}
                        />
                    </div>
                    <div className="lg:hidden">Market</div>
                    <div className="mt-2 flex w-full items-center justify-between lg:hidden">
                        <Dropdown
                            variant="tracer"
                            iconSize="xs"
                            placeHolderIcon={
                                Object.entries(MarketFilterEnum).find(
                                    ([_key, val]) => val === state.marketFilter,
                                )?.[0] as LogoTicker
                            }
                            value={state.marketFilter}
                            className="w-4/5"
                            options={MARKET_FILTER_OPTIONS}
                            onSelect={onMarketSelect}
                        />
                        <FilterToggleIcon
                            className={`${state.filtersOpen ? 'text-cool-gray-300' : ''} w-8 lg:hidden`}
                            onClick={onFiltersOpen}
                        />
                    </div>
                </div>

                <HiddenExpand className="lg:hidden" defaultHeight={0} open={state.filtersOpen}>
                    <div className="mb-5 flex flex-col sm:flex-row">
                        <div className="flex sm:mr-5">
                            <div className="mr-5">
                                <h3 className="mb-1 text-theme-text">Collateral</h3>
                                <Dropdown
                                    value={state.collateralFilter ?? 'All'}
                                    className="w-40 sm:w-32"
                                    options={COLLATERAL_FILTER_OPTIONS}
                                    onSelect={onCollateralFilterSelect}
                                />
                            </div>
                            <div>
                                <h3 className="mb-1 text-theme-text">Power Leverage</h3>
                                <Dropdown
                                    value={state.leverageFilter}
                                    className="w-40 sm:w-32"
                                    options={LEVERAGE_FILTER_OPTIONS}
                                    onSelect={onLeverageFilterSelect}
                                />
                            </div>
                        </div>
                        <SearchInput
                            className="mt-5 w-full sm:mt-auto"
                            placeholder="Search"
                            value={state.search}
                            onChange={onSearchInputChange}
                        />
                    </div>
                    <TWButtonGroup
                        className="p-1"
                        value={state.deltaDenotation}
                        onClick={onSetDenotation}
                        color="greyed"
                        border="rounded"
                        borderColor="greyed"
                        options={DENOTATION_OPTIONS}
                    />
                </HiddenExpand>

                <div className="mt-5 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex">
                        <div className="xl:hidden">
                            <TWButtonGroup
                                value={state.rebalanceFocus}
                                onClick={onRebalanceFocus}
                                color="tracer"
                                options={REBALANCE_OPTIONS_MOBILE}
                            />
                        </div>
                        <div className="mr-2 hidden xl:block">
                            <TWButtonGroup
                                value={state.rebalanceFocus}
                                onClick={onRebalanceFocus}
                                color="tracer"
                                options={REBALANCE_OPTIONS_DESKTOP}
                            />
                        </div>
                        <div className="mx-4 hidden flex-col lg:flex">
                            <TWButtonGroup
                                className="p-0.5"
                                size="sm"
                                value={state.deltaDenotation}
                                onClick={onSetDenotation}
                                color="greyed"
                                border="rounded"
                                borderColor="greyed"
                                options={DENOTATION_OPTIONS}
                            />
                        </div>
                    </div>
                    <div className="relative mt-12 lg:mt-0">
                        <div className="absolute -top-2/3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            Don’t see the pool you’re after?
                        </div>
                        <div className="flex">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => dispatch({ type: 'setAddAltPoolModalOpen', open: true })}
                            >
                                Display Alternative Pool
                            </Button>
                            <TooltipSelector tooltip={{ key: TooltipKeys.ComingSoon }}>
                                <Button variant="primary" size="sm" className="ml-5 cursor-not-allowed opacity-50">
                                    Deploy New Pool
                                </Button>
                            </TooltipSelector>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FilterSelects;
