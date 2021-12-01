import React from 'react';
import { SearchInput } from '@components/General/SearchInput';
import { Select } from '@components/General/Select';
import { TWModal } from '@components/General/TWModal';
import { BrowseAction, BrowseState, MarketFilterEnum, SortByEnum } from '../state';

interface FilterModalProps {
    state: BrowseState;
    dispatch: React.Dispatch<BrowseAction>;
}

const FilterModal: React.FC<FilterModalProps> = ({ state, dispatch }) => {
    return (
        <TWModal open={state.filterModalOpen} onClose={() => dispatch({ type: 'setFilterModalOpen', open: false })}>
            <div className="p-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-theme-text text-xl">Filter Data</h3>
                    <button className="text-xl" onClick={() => dispatch({ type: 'setFilterModalOpen', open: false })}>
                        &times;
                    </button>
                </div>
                <div className="my-3 w-full">
                    <SearchInput
                        placeholder="Search"
                        value={state.search}
                        onChange={(search) => dispatch({ type: 'setSearch', search })}
                    />
                </div>
                <div className="my-2">
                    <h4 className="text-theme-text opacity-80 font-bold mb-1">Market</h4>
                    <Select
                        className="w-1/2"
                        value={state.marketFilter}
                        options={Object.values(MarketFilterEnum)}
                        onSelect={(val) => dispatch({ type: 'setMarketFilter', market: val as MarketFilterEnum })}
                    />
                </div>
                <div className="my-2">
                    <h4 className="text-theme-text opacity-80 font-bold mb-1">Sort</h4>
                    <Select
                        className="w-1/2"
                        value={state.sortBy}
                        options={Object.values(SortByEnum)}
                        onSelect={(val) => dispatch({ type: 'setSortBy', sortBy: val as SortByEnum })}
                    />
                </div>
                <div className="mt-5">
                    <button
                        className="w-full px-4 py-3 bg-indigo-800 rounded text-white"
                        onClick={() => dispatch({ type: 'setFilterModalOpen', open: false })}
                    >
                        Okay
                    </button>
                </div>
            </div>
        </TWModal>
    );
};

export default FilterModal;
