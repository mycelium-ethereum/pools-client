import React from 'react';
import { Dropdown, HiddenExpand, LogoTicker } from '@components/General';
import { SearchInput } from '@components/General/SearchInput';
import {
    BrowseAction,
    BrowseState,
    CollateralEnum,
    DeltaEnum,
    LeverageEnum,
    MarketFilterEnum,
    RebalanceEnum,
} from '../state';
import TWButtonGroup from '@components/General/TWButtonGroup';
import TooltipSelector, { TooltipKeys } from '@components/Tooltips/TooltipSelector';
import Button from '@components/General/Button';

import FilterToggleIcon from '@public/img/general/filters.svg';
import ArrowDownIcon from '@public/img/general/arrow-circle-down.svg';

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
                <ArrowDownIcon className="text-red-600 w-4" />
                <ArrowDownIcon className="rotate-180 text-green-600 w-4" />
            </>
        ),
    },
    {
        key: DeltaEnum.Numeric,
        text: (
            <>
                <div className="mr-2">Absolute</div>
                <ArrowDownIcon className="text-red-600 w-4" />
                <ArrowDownIcon className="rotate-180 text-green-600 w-4" />
            </>
        ),
    },
];

const FilterSelects: React.FC<FilterSelectsProps> = ({ state, dispatch }) => {
    return (
        <section className="container px-4 sm:px-0">
            <div className="w-full mb-2">
                <div className="lg:flex">
                    <div className="hidden lg:flex mr-4 flex-col">
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
                            className="w-48 mt-auto"
                            options={Object.keys(MarketFilterEnum).map((key) => ({
                                key: (MarketFilterEnum as any)[key],
                                ticker: (key !== 'All' ? key : '') as LogoTicker,
                            }))}
                            onSelect={(val) => dispatch({ type: 'setMarketFilter', market: val as MarketFilterEnum })}
                        />
                    </div>
                    <div className="hidden lg:flex mr-4 flex-col">
                        <h3 className="mb-1 text-theme-text">Collateral</h3>
                        <Dropdown
                            value={state.collateralFilter ?? 'All'}
                            className="w-32 mt-auto"
                            options={Object.keys(CollateralEnum).map((key) => ({
                                key: (CollateralEnum as any)[key],
                            }))}
                            onSelect={(val) =>
                                dispatch({ type: 'setCollateralFilter', collateral: val as CollateralEnum })
                            }
                        />
                    </div>
                    <div className="hidden lg:flex mr-4 flex-col">
                        <h3 className="mb-1 text-theme-text">Power Leverage</h3>
                        <Dropdown
                            value={state.leverageFilter}
                            className="w-32 mt-auto"
                            options={Object.keys(LeverageEnum).map((key) => ({
                                key: (LeverageEnum as any)[key],
                            }))}
                            onSelect={(val) => dispatch({ type: 'setLeverageFilter', leverage: val as LeverageEnum })}
                        />
                    </div>
                    <div className="hidden lg:flex mr-4 flex-grow items-end">
                        <SearchInput
                            className="w-60"
                            placeholder="Search"
                            value={state.search}
                            onChange={(search) => dispatch({ type: 'setSearch', search })}
                        />
                    </div>
                    <div className="lg:hidden">Market</div>
                    <div className="flex lg:hidden w-full mt-2 justify-between items-center">
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
                            options={Object.keys(MarketFilterEnum).map((key) => ({
                                key: (MarketFilterEnum as any)[key],
                                ticker: (key !== 'All' ? key : '') as LogoTicker,
                            }))}
                            onSelect={(val) => dispatch({ type: 'setMarketFilter', market: val as MarketFilterEnum })}
                        />
                        <FilterToggleIcon
                            className={`${state.filtersOpen ? 'text-cool-gray-300' : ''} lg:hidden w-8`}
                            onClick={() => dispatch({ type: 'setFiltersOpen', open: !state.filtersOpen })}
                        />
                    </div>
                </div>

                <HiddenExpand className="lg:hidden" defaultHeight={0} open={state.filtersOpen}>
                    <div className="flex flex-col sm:flex-row mb-5">
                        <div className="flex sm:mr-5">
                            <div className="mr-5">
                                <h3 className="mb-1 text-theme-text">Collateral</h3>
                                <Dropdown
                                    value={state.collateralFilter ?? 'All'}
                                    className="w-40 sm:w-32"
                                    options={Object.keys(CollateralEnum).map((key) => ({
                                        key: (CollateralEnum as any)[key],
                                    }))}
                                    onSelect={(val) =>
                                        dispatch({ type: 'setCollateralFilter', collateral: val as CollateralEnum })
                                    }
                                />
                            </div>
                            <div>
                                <h3 className="mb-1 text-theme-text">Power Leverage</h3>
                                <Dropdown
                                    value={state.leverageFilter}
                                    className="w-40 sm:w-32"
                                    options={Object.keys(LeverageEnum).map((key) => ({
                                        key: (LeverageEnum as any)[key],
                                    }))}
                                    onSelect={(val) =>
                                        dispatch({ type: 'setLeverageFilter', leverage: val as LeverageEnum })
                                    }
                                />
                            </div>
                        </div>
                        <SearchInput
                            className="w-full mt-5 sm:mt-auto"
                            placeholder="Search"
                            value={state.search}
                            onChange={(search) => dispatch({ type: 'setSearch', search })}
                        />
                    </div>
                    <TWButtonGroup
                        className="p-1"
                        value={state.deltaDenotation}
                        onClick={(option) => dispatch({ type: 'setDenotation', denotation: option as DeltaEnum })}
                        color="greyed"
                        border="rounded"
                        borderColor="greyed"
                        options={DENOTATION_OPTIONS}
                    />
                </HiddenExpand>

                <div className="mt-5 flex flex-col lg:flex-row lg:justify-between lg:items-center">
                    <div className="flex">
                        <div className="xl:hidden">
                            <TWButtonGroup
                                value={state.rebalanceFocus}
                                onClick={(option) =>
                                    dispatch({ type: 'setRebalanceFocus', focus: option as RebalanceEnum })
                                }
                                color="tracer"
                                options={REBALANCE_OPTIONS_MOBILE}
                            />
                        </div>
                        <div className="hidden xl:block mr-2">
                            <TWButtonGroup
                                value={state.rebalanceFocus}
                                onClick={(option) =>
                                    dispatch({ type: 'setRebalanceFocus', focus: option as RebalanceEnum })
                                }
                                color="tracer"
                                options={REBALANCE_OPTIONS_DESKTOP}
                            />
                        </div>
                        <div className="hidden lg:flex mx-4 flex-col">
                            <TWButtonGroup
                                className="p-0.5"
                                size="sm"
                                value={state.deltaDenotation}
                                onClick={(option) =>
                                    dispatch({ type: 'setDenotation', denotation: option as DeltaEnum })
                                }
                                color="greyed"
                                border="rounded"
                                borderColor="greyed"
                                options={DENOTATION_OPTIONS}
                            />
                        </div>
                    </div>
                    <div className="mt-12 lg:mt-0 relative">
                        <div className="absolute -top-2/3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            Don’t see the pool you’re after?
                        </div>
                        <div className="flex">
                            <TooltipSelector tooltip={{ key: TooltipKeys.ComingSoon }}>
                                <Button variant="primary" size="sm" className="mr-5 cursor-not-allowed opacity-50">
                                    Display Alternative Pool
                                </Button>
                            </TooltipSelector>
                            <TooltipSelector tooltip={{ key: TooltipKeys.ComingSoon }}>
                                <Button variant="primary" size="sm" className="cursor-not-allowed opacity-50">
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
