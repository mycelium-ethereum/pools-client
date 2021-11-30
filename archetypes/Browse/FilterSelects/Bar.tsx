import { Dropdown } from '@components/General';
import { SearchInput } from '@components/General/SearchInput';
import React from 'react';
import { BrowseAction, BrowseState, RebalanceEnum, SideFilterEnum } from '../state';
import TWButtonGroup from '@components/General/TWButtonGroup';

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
                        onClick={(option) => dispatch({ type: 'setRebalanceFocus', focus: option as RebalanceEnum })}
                        borderColor={'tracer'}
                        options={REBALANCE_OPTIONS}
                    />
                </div>
                <div className="flex-grow" />
                <div className="mr-4">
                    <h3 className="mb-1 text-theme-text">Side</h3>
                    <Dropdown
                        value={state.side}
                        options={Object.values(SideFilterEnum).map((key) => ({ key }))}
                        onSelect={(val) => dispatch({ type: 'setSide', side: val as SideFilterEnum })}
                    />
                </div>
                <div className="mr-4 flex-grow flex items-end" style={{ maxWidth: '20rem' }}>
                    <SearchInput
                        placeholder="Search"
                        value={state.search}
                        onChange={(search) => dispatch({ type: 'setSearch', search })}
                    />
                </div>
                {/* <div className="mr-6">
                    <TooltipSelector tooltip={{ key: TooltipKeys.PowerLeverage }}>
                        <h3 className="mb-1">Power Leverage</h3>
                    </TooltipSelector>
                    <Dropdown
                        className="w-full"
                        value={state.leverage}
                        options={Object.values(LeverageFilterEnum).map((key) => ({ key }))}
                        onSelect={(val) => dispatch({ type: 'setLeverage', leverage: val as LeverageFilterEnum })}
                    />
                </div> */}
                {/* <div>
                    <h3 className="mb-1 text-theme-text">Sort</h3>
                    <Dropdown
                        value={state.sortBy}
                        options={Object.values(SortByEnum).map((key) => ({ key: key }))}
                        onSelect={(val) => dispatch({ type: 'setSortBy', sortBy: val as SortByEnum })}
                    />
                </div> */}
            </div>
        </section>
    );
};

export default FilterSelects;
