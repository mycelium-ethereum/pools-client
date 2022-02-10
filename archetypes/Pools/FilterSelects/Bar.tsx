import React from 'react';
import { Dropdown, HiddenExpand, LogoTicker } from '@components/General';
import { SearchInput } from '@components/General/SearchInput';
import { BrowseAction, BrowseState, RebalanceEnum, MarketFilterEnum, DeltaEnum, LeverageEnum } from '../state';
import TWButtonGroup from '@components/General/TWButtonGroup';
import ArrowDown from '/public/img/general/arrow-circle-down.svg';
import Filters from '/public/img/general/filters.svg';
import { TooltipKeys } from '@components/Tooltips/TooltipSelector';
import Button from '@components/General/Button';

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
                <ArrowDown className="text-red-600 w-6" />
                <ArrowDown className="rotate-180 text-green-600 w-6" />
            </>
        ),
    },
    {
        key: DeltaEnum.Numeric,
        text: (
            <>
                <div className="mr-2">Absolute</div>
                <ArrowDown className="text-red-600 w-6" />
                <ArrowDown className="rotate-180 text-green-600 w-6" />
            </>
        ),
    },
];

const FilterSelects: React.FC<FilterSelectsProps> = ({ state, dispatch }) => {
    return (
        <section className="container px-4 sm:px-0">
            <div className="w-full mb-2">
                <div className="flex">
                    <div className="hidden lg:flex mr-4 flex-col">
                        <h3 className="mb-1 text-theme-text">Market</h3>
                        <Dropdown
                            variant="blue"
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
                        <h3 className="mb-1 text-theme-text">Power Leverage</h3>
                        <Dropdown
                            value={state.leverageFilter}
                            className="w-32 mt-auto"
                            options={Object.keys(LeverageEnum).map((key) => ({
                                key: (LeverageEnum as any)[key],
                                ticker: (key !== 'All' ? key : '') as LogoTicker,
                            }))}
                            onSelect={(val) => dispatch({ type: 'setLeverageFilter', leverage: val as LeverageEnum })}
                        />
                    </div>
                    <div className="hidden lg:flex mr-4 flex-grow items-end" style={{ maxWidth: '15rem' }}>
                        <SearchInput
                            placeholder="Search"
                            value={state.search}
                            onChange={(search) => dispatch({ type: 'setSearch', search })}
                        />
                    </div>
                    <div className="flex lg:hidden w-full mr-4 mt-4">
                        <SearchInput
                            placeholder="Search"
                            value={state.search}
                            onChange={(search) => dispatch({ type: 'setSearch', search })}
                        />
                        <Filters
                            className="lg:hidden m-auto w-8 ml-2"
                            onClick={() => dispatch({ type: 'setFiltersOpen', open: !state.filtersOpen })}
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
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
                        <div className="hidden xl:block">
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
                                size="sm"
                                value={state.deltaDenotion}
                                onClick={(option) => dispatch({ type: 'setDenotion', denotion: option as DeltaEnum })}
                                color="greyed"
                                border="rounded"
                                borderColor="greyed"
                                options={DENOTATION_OPTIONS}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="mb-2 text-center">Don’t see the pool you’re after?</div>
                        <div className="flex">
                            <Button variant="primary" className="mr-5">
                                Display Alternative Pool
                            </Button>
                            <Button variant="primary">Deploy New Pool</Button>
                        </div>
                    </div>
                </div>
                <HiddenExpand className="lg:hidden" defaultHeight={0} open={state.filtersOpen}>
                    <div className="flex">
                        <div className="flex mr-4 flex-col">
                            <TWButtonGroup
                                value={state.deltaDenotion}
                                onClick={(option) => dispatch({ type: 'setDenotion', denotion: option as DeltaEnum })}
                                color="greyed"
                                border="rounded"
                                borderColor="greyed"
                                options={DENOTATION_OPTIONS}
                            />
                        </div>
                        <div className="flex mr-4 flex-col">
                            <h3 className="mb-1 text-theme-text">Market</h3>
                            <Dropdown
                                value={state.marketFilter}
                                className="w-32 mt-auto"
                                options={Object.keys(MarketFilterEnum).map((key) => ({
                                    key: (MarketFilterEnum as any)[key],
                                    ticker: (key !== 'All' ? key : '') as LogoTicker,
                                }))}
                                onSelect={(val) =>
                                    dispatch({ type: 'setMarketFilter', market: val as MarketFilterEnum })
                                }
                            />
                        </div>
                    </div>
                </HiddenExpand>
            </div>
        </section>
    );
};

export default FilterSelects;
