import React from 'react';
import { Dropdown, HiddenExpand, LogoTicker } from '@components/General';
import { SearchInput } from '@components/General/SearchInput';
import { BrowseAction, BrowseState, RebalanceEnum, MarketFilterEnum, DeltaEnum } from '../state';
import TWButtonGroup from '@components/General/TWButtonGroup';
import ArrowDown from '/public/img/general/arrow-circle-down.svg';
import Filters from '/public/img/general/filters.svg';
import { TooltipKeys } from '@components/Tooltips/TooltipSelector';

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
    {
        key: RebalanceEnum.historic,
        text: 'Historic Data',
        disabled: {
            optionKey: TooltipKeys.ComingSoon,
        },
    },
];

const DENOTION_OPTIONS = [
    {
        key: DeltaEnum.Percentile,
        text: 'Percent',
    },
    {
        key: DeltaEnum.Numeric,
        text: 'Number',
    },
];

const FilterSelects: React.FC<FilterSelectsProps> = ({ state, dispatch }) => {
    return (
        <section className="container px-0">
            {/** Desktop */}
            <div className="block lg:flex w-full mb-2">
                <div className="mt-auto">
                    <TWButtonGroup
                        value={state.rebalanceFocus}
                        size="lg"
                        onClick={(option) => dispatch({ type: 'setRebalanceFocus', focus: option as RebalanceEnum })}
                        color={'tracer'}
                        options={REBALANCE_OPTIONS}
                    />
                </div>
                <div className="flex-grow" />
                <div className="hidden lg:flex mx-4 flex-col">
                    <span className="inline-flex">
                        <ArrowDown className="rotate-180 text-green-600 h-6" />
                        <ArrowDown className="text-red-600 mr-1 h-6" />
                        <h3 className="mb-1 text-theme-text">Denotion</h3>
                    </span>
                    <div className="mt-auto ml-auto">
                        <TWButtonGroup
                            value={state.deltaDenotion}
                            onClick={(option) => dispatch({ type: 'setDenotion', denotion: option as DeltaEnum })}
                            color="greyed"
                            border="rounded"
                            borderColor="greyed"
                            options={DENOTION_OPTIONS}
                        />
                    </div>
                </div>
                <div className="hidden lg:flex mr-4 flex-col">
                    <h3 className="mb-1 text-theme-text">Market</h3>
                    <Dropdown
                        value={state.marketFilter}
                        className="w-32 mt-auto"
                        options={Object.keys(MarketFilterEnum).map((key) => ({
                            key: (MarketFilterEnum as any)[key],
                            ticker: (key !== 'All' ? key : '') as LogoTicker,
                        }))}
                        onSelect={(val) => dispatch({ type: 'setMarketFilter', market: val as MarketFilterEnum })}
                    />
                </div>
                <div className="hidden lg:flex mr-4 flex-grow items-end" style={{ maxWidth: '20rem' }}>
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
                <HiddenExpand className="lg:hidden" defaultHeight={0} open={state.filtersOpen}>
                    <div className="flex">
                        <div className="flex mr-4 flex-col">
                            <span className="inline-flex">
                                <ArrowDown className="rotate-180 text-green-600 h-6" />
                                <ArrowDown className="text-red-600 mr-1 h-6" />
                                <h3 className="mb-1 text-theme-text">Denotion</h3>
                            </span>
                            <div className="mt-auto ml-auto">
                                <TWButtonGroup
                                    value={state.deltaDenotion}
                                    onClick={(option) =>
                                        dispatch({ type: 'setDenotion', denotion: option as DeltaEnum })
                                    }
                                    color="greyed"
                                    border="rounded"
                                    borderColor="greyed"
                                    options={DENOTION_OPTIONS}
                                />
                            </div>
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
