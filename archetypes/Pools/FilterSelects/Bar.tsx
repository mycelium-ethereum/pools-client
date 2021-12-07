import { Dropdown, LogoTicker } from '@components/General';
import { SearchInput } from '@components/General/SearchInput';
import React from 'react';
import { BrowseAction, BrowseState, RebalanceEnum, MarketFilterEnum, DeltaEnum } from '../state';
import TWButtonGroup from '@components/General/TWButtonGroup';
import DenotionToggle from './DenotionToggle';

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

const FilterSelects: React.FC<FilterSelectsProps> = ({ state, dispatch }) => {
    return (
        <section className="container px-0">
            <div className="flex w-full mb-2">
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
                <div className="hidden md:block mr-4">
                    <h3 className="mb-1 text-theme-text">Denotion</h3>
                    <DenotionToggle
                        toggleValue={() => {
                            dispatch({
                                type: 'setDenotion',
                                denotion:
                                    state.deltaDenotion === DeltaEnum.Numeric
                                        ? DeltaEnum.Percentile
                                        : DeltaEnum.Numeric,
                            });
                        }}
                        value={state.deltaDenotion === DeltaEnum.Numeric}
                    />
                </div>
                <div className="hidden md:block mr-4">
                    <h3 className="mb-1 text-theme-text">Market</h3>
                    <Dropdown
                        value={state.marketFilter}
                        className="w-32"
                        options={Object.keys(MarketFilterEnum).map((key) => ({
                            key: (MarketFilterEnum as any)[key],
                            ticker: (key !== 'All' ? key : '') as LogoTicker,
                        }))}
                        onSelect={(val) => dispatch({ type: 'setMarketFilter', market: val as MarketFilterEnum })}
                    />
                </div>
                <div className="hidden md:flex mr-4 flex-grow items-end" style={{ maxWidth: '20rem' }}>
                    <SearchInput
                        placeholder="Search"
                        value={state.search}
                        onChange={(search) => dispatch({ type: 'setSearch', search })}
                    />
                </div>
            </div>
        </section>
    );
};

export default FilterSelects;
